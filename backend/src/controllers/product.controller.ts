import { Request, Response, NextFunction } from 'express';

// Express 5 types: query params can be string | string[]
type QueryParam = string | string[] | undefined;

import { Product } from '../models/Product';
import { AppError } from '../utils/errors';
import { uploadBase64Image } from '../utils/cloudinary';
import { hybridSearchService } from '../services/hybridSearch.service';
import { embeddingService } from '../services/embedding.service';

export class ProductController {
  
  // 1. CREATE PRODUCT (Add new product)
  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Fallback: Auto-generate slug if it's missing from the request
      if (req.body.name && !req.body.slug) {
        req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
      }

      // Upload base64 images to Cloudinary
      if (req.body.images && Array.isArray(req.body.images)) {
        const uploadedImages = [];
        for (const img of req.body.images) {
          if (img.startsWith('data:image')) {
            const url = await uploadBase64Image(img);
            uploadedImages.push(url);
          } else {
            uploadedImages.push(img);
          }
        }
        req.body.images = uploadedImages;
      }

      let product;
      let attempts = 0;
      while (true) {
        try {
          product = await Product.create(req.body);
          break;
        } catch (err: any) {
          // A slug collision (extremely rare with the random suffix, but also
          // what you'd see if the database still has an old unique index left
          // over from before this schema had `sparse: true`) can be healed by
          // just generating a fresh slug and retrying, instead of failing the
          // whole request over what the user sees as an unrelated product.
          if (err.code === 11000 && err.keyPattern?.slug && attempts < 3) {
            attempts++;
            req.body.slug = (req.body.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 10);
            continue;
          }
          throw err;
        }
      }

      // Index in hybrid search engine (non-blocking)
      hybridSearchService.indexProduct(product).catch(err => {
        console.error('[ProductController] Failed to index product:', err);
      });

      res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: product
      });
    } catch (error: any) {
      if (error.code === 11000) {
        // Name the actual field/value that collided rather than always blaming
        // slug - if this fires for a field other than slug, it almost always
        // means the database has a leftover unique index from an earlier
        // version of this schema that Mongoose never auto-removes.
        const field = error.keyPattern ? Object.keys(error.keyPattern)[0] : 'field';
        const value = error.keyValue ? error.keyValue[field] : undefined;
        return res.status(400).json({
          success: false,
          message: `Duplicate Error: a product already exists with ${field} = ${JSON.stringify(value)}. If this doesn't look right (e.g. you used a new name), your database likely has a leftover unique index on "${field}" from an earlier schema version - drop and recreate the indexes on the products collection.`
        });
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
      }
      next(error);
    }
  }

  // 2. GET ALL PRODUCTS (Read products for UI)
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Fetch all products, newest first
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  // 3. UPDATE PRODUCT (Edit product)
  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      // Upload new base64 images to Cloudinary
      if (req.body.images && Array.isArray(req.body.images)) {
        const uploadedImages = [];
        for (const img of req.body.images) {
          if (img.startsWith('data:image')) {
            const url = await uploadBase64Image(img);
            uploadedImages.push(url);
          } else {
            uploadedImages.push(img);
          }
        }
        req.body.images = uploadedImages;
      }

      const { id } = req.params as { id: string };
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      
      if (!product) throw new AppError(404, 'Product not found');
      
      // Re-index in hybrid search engine (non-blocking)
      hybridSearchService.reindexProduct(product).catch(err => {
        console.error('[ProductController] Failed to re-index product:', err);
      });
      
      res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Duplicate Error: A product with this detail already exists.' });
      }
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
      }
      next(error);
    }
  }

  // 4. DELETE PRODUCT
  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) throw new AppError(404, 'Product not found');
      
      // Remove from hybrid search index (non-blocking)
      hybridSearchService.deindexProduct(id).catch(err => {
        console.error('[ProductController] Failed to de-index product:', err);
      });
      
      res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // 5. SEMANTIC SEARCH (Hybrid search endpoint)
  static async semanticSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, category, minPrice, maxPrice, metal, gemstone, occasion, limit } = req.query as Record<string, QueryParam>;

      if (!q || typeof q !== 'string') {
        return res.status(200).json({ success: true, data: [], message: 'No search query provided' });
      }

      const results = await hybridSearchService.search({
        query: q,
        category: typeof category === 'string' ? category : undefined,
        minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        metal: typeof metal === 'string' ? metal : undefined,
        gemstone: typeof gemstone === 'string' ? gemstone : undefined,
        occasion: typeof occasion === 'string' ? occasion : undefined,
        limit: limit !== undefined ? Number(limit) : 20,
      });

      // Format response to match existing pattern: { success, data }
      const products = results.map(r => ({
        ...r.product,
        _searchScore: r.score,
        _searchType: r.matchType,
        _tfidfScore: r.tfidfScore,
        _semanticScore: r.semanticScore,
      }));

      res.status(200).json({
        success: true,
        data: products,
        meta: {
          query: q,
          total: products.length,
          hybrid: results.some(r => r.matchType === 'hybrid'),
          semantic: results.some(r => r.matchType === 'semantic'),
          fallback: results.some(r => r.matchType === 'fallback'),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // 6. GET SIMILAR PRODUCTS (AI-powered recommendations using cached embeddings)
  static async getSimilarProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };

      // Get the cached embedding for the current product
      const currentEmbedding = embeddingService.getCachedEmbedding(id);
      if (!currentEmbedding) {
        // Fallback: if no embedding exists, return category-based products
        const product = await Product.findById(id);
        if (!product) throw new AppError(404, 'Product not found');
        const fallback = await Product.find({ category: product.category, _id: { $ne: id } })
          .limit(8)
          .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: fallback, source: 'fallback' });
      }

      // Rank all cached products by cosine similarity
      const ranked = embeddingService.rankBySimilarity(currentEmbedding);

      // Exclude the current product and take Top 8
      const topResults = ranked
        .filter(r => r.productId !== id)
        .slice(0, 8);

      if (topResults.length === 0) {
        return res.status(200).json({ success: true, data: [], source: 'embedding' });
      }

      // Fetch the actual product documents
      const similarProductIds = topResults.map(r => r.productId);
      const products = await Product.find({ _id: { $in: similarProductIds } as any });

      // Attach similarity scores and preserve ranking order
      const scoreMap = new Map(topResults.map(r => [r.productId, r.score]));
      const sorted = products
        .map(p => ({
          ...p.toObject(),
          id: p._id.toString(),
          image: p.images?.[0] || 'https://via.placeholder.com/150',
          _similarityScore: scoreMap.get(p._id.toString()) || 0,
        }))
        .sort((a, b) => (b._similarityScore || 0) - (a._similarityScore || 0));

      res.status(200).json({ success: true, data: sorted, source: 'embedding' });
    } catch (error) {
      next(error);
    }
  }

  // 7. GET RECOMMENDATIONS (You May Also Like)
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { productIds: queryProductIds } = req.query as { productIds?: string };

      // Parse product IDs from query param (comma-separated: from wishlist/cart/orders)
      const ids = queryProductIds
        ? queryProductIds.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      // If no user history, fallback to trending products (newest first)
      if (ids.length === 0) {
        const trending = await Product.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .lean();

        const formatted = trending.map(p => ({
          ...p,
          id: p._id.toString(),
          image: p.images?.[0] || 'https://via.placeholder.com/150',
        }));

        return res.status(200).json({ success: true, data: formatted, source: 'trending' });
      }

      // Get cached embeddings for the user's products
      const embeddings: number[][] = [];
      for (const pid of ids) {
        const emb = embeddingService.getCachedEmbedding(pid);
        if (emb) embeddings.push(emb);
      }

      // If none of the products have embeddings, fallback to trending
      if (embeddings.length === 0) {
        const trending = await Product.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .lean();

        const formatted = trending.map(p => ({
          ...p,
          id: p._id.toString(),
          image: p.images?.[0] || 'https://via.placeholder.com/150',
        }));

        return res.status(200).json({ success: true, data: formatted, source: 'trending' });
      }

      // Compute average embedding vector
      const dim = embeddings[0].length;
      const avgEmbedding = new Array(dim).fill(0);
      for (const emb of embeddings) {
        for (let i = 0; i < dim; i++) {
          avgEmbedding[i] += emb[i];
        }
      }
      for (let i = 0; i < dim; i++) {
        avgEmbedding[i] /= embeddings.length;
      }

      // Rank all cached products against the average embedding
      const ranked = embeddingService.rankBySimilarity(avgEmbedding);

      // Exclude products already in user's history, take Top 8
      const excludeSet = new Set(ids);
      const topResults = ranked
        .filter(r => !excludeSet.has(r.productId))
        .slice(0, 8);

      if (topResults.length === 0) {
        // If no new products to recommend, return trending
        const trending = await Product.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .lean();

        const formatted = trending.map(p => ({
          ...p,
          id: p._id.toString(),
          image: p.images?.[0] || 'https://via.placeholder.com/150',
        }));

        return res.status(200).json({ success: true, data: formatted, source: 'trending' });
      }

      // Fetch the actual product documents
      const matchedProductIds = topResults.map(r => r.productId);
      const products = await Product.find({ _id: { $in: matchedProductIds } as any });

      // Attach similarity scores and preserve ranking order
      const scoreMap = new Map(topResults.map(r => [r.productId, r.score]));
      const sorted = products
        .map(p => ({
          ...p.toObject(),
          id: p._id.toString(),
          image: p.images?.[0] || 'https://via.placeholder.com/150',
          _similarityScore: scoreMap.get(p._id.toString()) || 0,
        }))
        .sort((a, b) => (b._similarityScore || 0) - (a._similarityScore || 0));

      res.status(200).json({ success: true, data: sorted, source: 'embedding' });
    } catch (error) {
      next(error);
    }
  }
}