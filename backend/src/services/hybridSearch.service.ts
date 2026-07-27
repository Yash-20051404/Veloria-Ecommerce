import { Product, IProduct } from '../models/Product';
import { embeddingService } from './embedding.service';
import { tfidfService } from './tfidf.service';

// ─────────────────────────────────────────────
// HYBRID SEARCH SERVICE
// Orchestrates: TF-IDF → Embedding → Cosine Similarity → Hybrid Ranking
// ─────────────────────────────────────────────

export interface SearchResult {
  product: IProduct;
  score: number;
  tfidfScore: number;
  semanticScore: number;
  matchType: 'hybrid' | 'semantic' | 'lexical' | 'fallback';
}

export interface SearchOptions {
  /** Natural language query */
  query: string;
  /** Optional category filter */
  category?: string;
  /** Optional price range */
  minPrice?: number;
  maxPrice?: number;
  /** Optional metal filter */
  metal?: string;
  /** Optional gemstone filter */
  gemstone?: string;
  /** Optional occasion filter */
  occasion?: string;
  /** Number of results to return */
  limit?: number;
}

class HybridSearchService {
  // Hybrid ranking weights
  private readonly TFIDF_WEIGHT = 0.4;
  private readonly SEMANTIC_WEIGHT = 0.6;

  /** Initialize the search engine: load model, build index, cache embeddings */
  async initialize(): Promise<void> {
    console.log('[HybridSearch] Initializing...');

    // Load all products from DB
    const products = await Product.find({}).lean();

    if (products.length === 0) {
      console.log('[HybridSearch] No products found, skipping initialization');
      return;
    }

    // Build TF-IDF index
    tfidfService.buildIndex(products as IProduct[]);

    // Generate and cache embeddings
    await embeddingService.cacheAllProducts(products as IProduct[]);

    console.log(`[HybridSearch] Initialized: ${products.length} products indexed`);
  }

  /** Rebuild index and embeddings for a single product (on create/update) */
  async indexProduct(product: IProduct): Promise<void> {
    // Update TF-IDF
    tfidfService.addDocument(product);

    // Update embedding
    await embeddingService.updateProductEmbedding(product);
  }

  /** Update index for a product (on update) */
  async reindexProduct(product: IProduct): Promise<void> {
    // Update TF-IDF
    tfidfService.updateDocument(product);

    // Update embedding
    await embeddingService.updateProductEmbedding(product);
  }

  /** Remove product from index (on delete) */
  async deindexProduct(productId: string): Promise<void> {
    tfidfService.removeDocument(productId);
    embeddingService.removeProductEmbedding(productId);
  }

  /** Perform a hybrid search */
  async search(options: SearchOptions): Promise<SearchResult[]> {
    const { query, limit = 20 } = options;

    if (!query || query.trim().length === 0) {
      return [];
    }

    const trimmedQuery = query.trim();

    // ── Step 1: Get TF-IDF scores (lexical) ──
    const tfidfScores = tfidfService.scoreQuery(trimmedQuery);
    const maxTfidf = Math.max(...tfidfScores.values(), 1);
    const hasLexicalMatches = tfidfScores.size > 0;

    // ── Step 2: Get semantic scores (embedding cosine similarity) ──
    //
    // IMPORTANT — why "necklace" was also returning rings:
    // Short catalog-style product text (e.g. "Gold Ring", "Gold Necklace")
    // embeds into a very *tight* cluster with MiniLM — the gap between a
    // "true match" and an "unrelated" product is often only 0.05-0.10,
    // smaller than any safe margin/threshold. So filtering on the semantic
    // score alone (absolute OR relative) can never fully separate rings
    // from necklaces — the embeddings themselves aren't discriminative
    // enough at this text length.
    //
    // Fix: change WHAT the semantic score is allowed to do.
    //   • If the query has real lexical (keyword) matches — e.g. "necklace"
    //     literally appears in some products' category/name — semantic
    //     score is only used to RE-RANK those already-matched products.
    //     It can no longer pull in unrelated categories.
    //   • Only when the query has ZERO lexical matches at all (a synonym,
    //     typo, or natural-language phrase like "elegant wedding gift")
    //     does semantic search get to introduce its own candidates.
    let semanticRankings: Array<{ productId: string; score: number }> = [];

    try {
      const queryEmbedding = await embeddingService.generateEmbedding(trimmedQuery);
      const allSemanticRankings = embeddingService.rankBySimilarity(queryEmbedding);
      const semanticMap = new Map(allSemanticRankings.map(r => [r.productId, r.score]));

      if (hasLexicalMatches) {
        // Gate: only re-rank products that already matched lexically.
        semanticRankings = Array.from(tfidfScores.keys()).map(productId => ({
          productId,
          score: semanticMap.get(productId) || 0,
        }));
      } else if (allSemanticRankings.length > 0) {
        // No keyword matches at all — fall back to pure semantic search,
        // but still apply a relative cutoff so we don't return the whole
        // catalog when nothing is genuinely close either.
        const MIN_ABSOLUTE_SIMILARITY = 0.2;
        const RELATIVE_MARGIN = 0.12;
        const topScore = allSemanticRankings[0].score;
        const cutoff = Math.max(MIN_ABSOLUTE_SIMILARITY, topScore - RELATIVE_MARGIN);
        semanticRankings = allSemanticRankings.filter(r => r.score >= cutoff);
      }
    } catch (error) {
      console.error('[HybridSearch] Semantic search failed, falling back to lexical:', error);
    }

    // Build a map for quick semantic score lookup
    const semanticScoreMap = new Map<string, number>();
    for (const r of semanticRankings) {
      semanticScoreMap.set(r.productId, r.score);
    }

    // ── Step 3: Combine scores ──
    // Collect all unique product IDs from both result sets.
    // Note: when hasLexicalMatches is true, semanticRankings is already a
    // subset of tfidfScores' keys (by construction above), so this union
    // is effectively just the lexically-matched products — exactly what
    // we want for a query like "necklace".
    const allProductIds = new Set<string>();

    for (const id of tfidfScores.keys()) allProductIds.add(id);
    for (const r of semanticRankings) allProductIds.add(r.productId);

    const combined: Array<{
      productId: string;
      tfidfScore: number;
      semanticScore: number;
      finalScore: number;
    }> = [];

    for (const productId of allProductIds) {
      const tfidf = (tfidfScores.get(productId) || 0) / maxTfidf; // Normalize to [0, 1]
      const semantic = semanticScoreMap.get(productId) || 0;       // Already [0, 1]

      const finalScore = this.TFIDF_WEIGHT * tfidf + this.SEMANTIC_WEIGHT * semantic;

      combined.push({
        productId,
        tfidfScore: Math.round(tfidf * 1000) / 1000,
        semanticScore: Math.round(semantic * 1000) / 1000,
        finalScore: Math.round(finalScore * 1000) / 1000,
      });
    }

    // Sort by final score descending
    combined.sort((a, b) => b.finalScore - a.finalScore);

    // ── Step 4: Fetch a wide enough candidate pool ──
    // If explicit filters are set (category/price/metal/etc.), those can only be
    // checked once we have the real product documents (below), so we must not
    // truncate to `limit` yet — otherwise a filter could drop products that would
    // have matched, just because they didn't make the top `limit` by raw score.
    const hasExplicitFilters = !!(
      (options.category && options.category !== 'ALL') ||
      options.minPrice !== undefined ||
      options.maxPrice !== undefined ||
      (options.metal && options.metal !== 'All') ||
      (options.gemstone && options.gemstone !== 'All') ||
      (options.occasion && options.occasion !== 'All')
    );
    const candidatePoolSize = hasExplicitFilters ? Math.min(combined.length, 500) : limit;

    // ── Step 5: Fetch full product documents ──
    const topIds = combined.slice(0, candidatePoolSize).map(r => r.productId);
    if (topIds.length === 0) return [];

    const products = await Product.find({
      _id: { $in: topIds },
    }).lean();

    const productMap = new Map<string, IProduct>();
    for (const p of products as IProduct[]) {
      productMap.set(p._id.toString(), p);
    }

    // ── Step 6: Build results with metadata ──
    const results: SearchResult[] = [];

    for (const item of combined.slice(0, candidatePoolSize)) {
      const product = productMap.get(item.productId);
      if (!product) continue;

      // Apply explicit filters
      if (options.category && options.category !== 'ALL') {
        if ((product.category || '').toUpperCase() !== options.category.toUpperCase()) continue;
      }
      if (options.minPrice !== undefined && product.price < options.minPrice) continue;
      if (options.maxPrice !== undefined && product.price > options.maxPrice) continue;
      if (options.metal && options.metal !== 'All') {
        if (!(product.metal || '').toLowerCase().includes(options.metal.toLowerCase())) continue;
      }
      if (options.gemstone && options.gemstone !== 'All') {
        if (!(product.gemstone || '').toLowerCase().includes(options.gemstone.toLowerCase())) continue;
      }
      if (options.occasion && options.occasion !== 'All') {
        if (!(product.occasion || '').toLowerCase().includes(options.occasion.toLowerCase())) continue;
      }

      // Determine match type
      let matchType: SearchResult['matchType'] = 'hybrid';
      if (item.tfidfScore === 0 && item.semanticScore > 0) matchType = 'semantic';
      else if (item.semanticScore === 0 && item.tfidfScore > 0) matchType = 'lexical';
      else if (item.tfidfScore === 0 && item.semanticScore === 0) matchType = 'fallback';

      results.push({
        product,
        score: item.finalScore,
        tfidfScore: item.tfidfScore,
        semanticScore: item.semanticScore,
        matchType,
      });

      if (results.length >= limit) break;
    }

    // ── Step 7: Fallback to simple keyword search if no results ──
    if (results.length === 0) {
      return this.fallbackSearch(trimmedQuery, options);
    }

    return results;
  }

  /** Fallback: simple MongoDB regex search when hybrid returns nothing */
  private async fallbackSearch(query: string, options: SearchOptions): Promise<SearchResult[]> {
    const { limit = 20 } = options;

    const filter: any = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { metal: { $regex: query, $options: 'i' } },
        { gemstone: { $regex: query, $options: 'i' } },
        { occasion: { $regex: query, $options: 'i' } },
      ],
    };

    // Apply explicit filters
    if (options.category && options.category !== 'ALL') {
      filter.category = { $regex: `^${options.category}$`, $options: 'i' };
    }
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      filter.price = {};
      if (options.minPrice !== undefined) filter.price.$gte = options.minPrice;
      if (options.maxPrice !== undefined) filter.price.$lte = options.maxPrice;
    }
    if (options.metal && options.metal !== 'All') {
      filter.metal = { $regex: options.metal, $options: 'i' };
    }
    if (options.gemstone && options.gemstone !== 'All') {
      filter.gemstone = { $regex: options.gemstone, $options: 'i' };
    }
    if (options.occasion && options.occasion !== 'All') {
      filter.occasion = { $regex: options.occasion, $options: 'i' };
    }

    const products = await Product.find(filter).limit(limit).lean();

    return (products as IProduct[]).map(p => ({
      product: p,
      score: 0.1,
      tfidfScore: 0,
      semanticScore: 0,
      matchType: 'fallback' as SearchResult['matchType'],
    }));
  }

  /** Check if the search engine is ready */
  get isReady(): boolean {
    return embeddingService.isReady && tfidfService.isReady;
  }
}

// Singleton export
export const hybridSearchService = new HybridSearchService();
