import { pipeline } from '@xenova/transformers';
import { IProduct } from '../models/Product';

// ─────────────────────────────────────────────
// EMBEDDING SERVICE
// Singleton: loads Xenova/all-MiniLM-L6-v2 once
// Generates & caches 384-dim product embeddings in memory
// ─────────────────────────────────────────────

class EmbeddingService {
  private model: any = null;
  private embeddingCache: Map<string, number[]> = new Map();
  private initialized = false;
  private initializing = false;

  /** Load the transformer model once */
  async initialize(): Promise<void> {
    if (this.initialized || this.initializing) return;
    this.initializing = true;
    try {
      // all-MiniLM-L6-v2: 384-dim embeddings, fast CPU inference
      this.model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.initialized = true;
      console.log('[EmbeddingService] Model loaded successfully');
    } catch (error) {
      console.error('[EmbeddingService] Failed to load model:', error);
      throw error;
    } finally {
      this.initializing = false;
    }
  }

  /** Ensure model is loaded before any embedding operation */
  private async ensureModel(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /** Generate a 384-dim embedding vector for any text */
  async generateEmbedding(text: string): Promise<number[]> {
    await this.ensureModel();
    const result = await this.model!(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data) as number[];
  }

  /** Build the text representation for a product (all searchable fields combined) */
  productToText(product: IProduct): string {
    const parts = [
      product.name,
      product.description || '',
      product.category || '',
      product.metal || '',
      product.purity || '',
      product.gemstone || '',
      product.occasion || '',
    ];
    return parts.filter(Boolean).join(' ');
  }

  /** Generate embedding for a single product and cache it */
  async generateProductEmbedding(product: IProduct): Promise<number[]> {
    const text = this.productToText(product);
    const embedding = await this.generateEmbedding(text);
    this.embeddingCache.set(product._id.toString(), embedding);
    return embedding;
  }

  /** Batch-generate embeddings for all products (used at startup + after bulk changes) */
  async cacheAllProducts(products: IProduct[]): Promise<void> {
    await this.ensureModel();
    this.embeddingCache.clear();
    const batchSize = 10;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      const promises = batch.map(async (product) => {
        try {
          const text = this.productToText(product);
          const embedding = await this.generateEmbedding(text);
          return { id: product._id.toString(), embedding };
        } catch (err) {
          console.error(`[EmbeddingService] Failed to embed product ${product._id}:`, err);
          return null;
        }
      });
      const results = await Promise.all(promises);
      for (const result of results) {
        if (result) {
          this.embeddingCache.set(result.id, result.embedding);
        }
      }
    }

    console.log(`[EmbeddingService] Cached ${this.embeddingCache.size} product embeddings`);
  }

  /** Update a single product's embedding (on create/update) */
  async updateProductEmbedding(product: IProduct): Promise<void> {
    await this.generateProductEmbedding(product);
  }

  /** Remove a product embedding (on delete) */
  removeProductEmbedding(productId: string): void {
    this.embeddingCache.delete(productId);
  }

  /** Get a cached embedding */
  getCachedEmbedding(productId: string): number[] | undefined {
    return this.embeddingCache.get(productId);
  }

  /** Check if embeddings are loaded */
  get isReady(): boolean {
    return this.initialized && this.embeddingCache.size > 0;
  }

  /** Get cache size */
  get cacheSize(): number {
    return this.embeddingCache.size;
  }

  /** Compute cosine similarity between two L2-normalized vectors */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
    }
    // Clamp to [0, 1] for safety (should already be in range for normalized vectors)
    return Math.max(0, Math.min(1, dot));
  }

  /** Get product IDs sorted by cosine similarity to query embedding */
  rankBySimilarity(queryEmbedding: number[]): Array<{ productId: string; score: number }> {
    const results: Array<{ productId: string; score: number }> = [];
    for (const [productId, productEmbedding] of this.embeddingCache) {
      const score = this.cosineSimilarity(queryEmbedding, productEmbedding);
      results.push({ productId, score });
    }
    results.sort((a, b) => b.score - a.score);
    return results;
  }
}

// Singleton export — one model instance for the entire app lifetime
export const embeddingService = new EmbeddingService();