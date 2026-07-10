import { IProduct } from '../models/Product';

// ─────────────────────────────────────────────
// TF-IDF SERVICE
// Builds an inverted index from the product corpus
// Computes BM25-style TF-IDF scores for lexical search
// ─────────────────────────────────────────────

interface DocVector {
  /** Term frequency map for this document */
  tf: Map<string, number>;
  /** Document length in tokens */
  length: number;
}

class TFIDFService {
  private docCount = 0;
  /** Document frequency: term → number of documents containing it */
  private df: Map<string, number> = new Map();
  /** Document vectors: productId → { tf, length } */
  private docVectors: Map<string, DocVector> = new Map();
  /** All tokens across all documents (for normalization) */
  private allTerms: Set<string> = new Set();
  /** Average document length for BM25 */
  private avgDocLength = 0;

  // BM25 parameters
  private readonly k1 = 1.5;
  private readonly b = 0.75;

  /** Tokenize text into lowercase word tokens */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  /** Build the full text for a product (same as embedding service for consistency) */
  private productToText(product: IProduct): string {
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

  /** Build or rebuild the entire TF-IDF index from all products */
  buildIndex(products: IProduct[]): void {
    this.docCount = products.length;
    this.df.clear();
    this.docVectors.clear();
    this.allTerms.clear();

    if (products.length === 0) return;

    // First pass: compute term frequencies per document
    for (const product of products) {
      const text = this.productToText(product);
      const tokens = this.tokenize(text);
      const productId = product._id.toString();

      const tf = new Map<string, number>();
      for (const token of tokens) {
        tf.set(token, (tf.get(token) || 0) + 1);
        this.allTerms.add(token);
      }

      this.docVectors.set(productId, {
        tf,
        length: tokens.length,
      });
    }

    // Second pass: compute document frequency
    for (const [productId, vector] of this.docVectors) {
      for (const term of vector.tf.keys()) {
        this.df.set(term, (this.df.get(term) || 0) + 1);
      }
    }

    // Compute average document length
    let totalLength = 0;
    for (const vector of this.docVectors.values()) {
      totalLength += vector.length;
    }
    this.avgDocLength = totalLength / this.docCount;

    console.log(`[TFIDFService] Index built: ${this.docCount} docs, ${this.allTerms.size} unique terms`);
  }

  /** Add a single document to the index (on product create) */
  addDocument(product: IProduct): void {
    const text = this.productToText(product);
    const tokens = this.tokenize(text);
    const productId = product._id.toString();

    const tf = new Map<string, number>();
    for (const token of tokens) {
      tf.set(token, (tf.get(token) || 0) + 1);
      this.allTerms.add(token);
    }

    this.docVectors.set(productId, { tf, length: tokens.length });

    // Update document frequency
    for (const term of tf.keys()) {
      this.df.set(term, (this.df.get(term) || 0) + 1);
    }

    // Recompute averages
    this.docCount++;
    let totalLength = 0;
    for (const vector of this.docVectors.values()) {
      totalLength += vector.length;
    }
    this.avgDocLength = totalLength / this.docCount;
  }

  /** Update a document in the index (on product update) */
  updateDocument(product: IProduct): void {
    this.removeDocument(product._id.toString());
    this.addDocument(product);
  }

  /** Remove a document from the index (on product delete) */
  removeDocument(productId: string): void {
    const vector = this.docVectors.get(productId);
    if (!vector) return;

    // Decrement document frequency
    for (const term of vector.tf.keys()) {
      const currentDf = this.df.get(term) || 0;
      if (currentDf <= 1) {
        this.df.delete(term);
      } else {
        this.df.set(term, currentDf - 1);
      }
    }

    this.docVectors.delete(productId);
    this.docCount = Math.max(0, this.docCount - 1);

    // Recompute average length
    if (this.docCount > 0) {
      let totalLength = 0;
      for (const v of this.docVectors.values()) {
        totalLength += v.length;
      }
      this.avgDocLength = totalLength / this.docCount;
    }
  }

  /** Compute IDF for a term */
  private idf(term: string): number {
    const df = this.df.get(term) || 0;
    return Math.log(1 + (this.docCount - df + 0.5) / (df + 0.5));
  }

  /** Score all documents against a query using BM25 */
  scoreQuery(query: string): Map<string, number> {
    const queryTerms = this.tokenize(query);
    const scores = new Map<string, number>();

    if (queryTerms.length === 0 || this.docCount === 0) return scores;

    for (const [productId, vector] of this.docVectors) {
      let score = 0;

      for (const term of queryTerms) {
        const tf = vector.tf.get(term) || 0;
        if (tf === 0) continue;

        const idf = this.idf(term);
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (vector.length / this.avgDocLength));
        score += idf * (numerator / denominator);
      }

      if (score > 0) {
        scores.set(productId, score);
      }
    }

    return scores;
  }

  /** Get the number of indexed documents */
  get documentCount(): number {
    return this.docCount;
  }

  /** Check if the index is built */
  get isReady(): boolean {
    return this.docCount > 0;
  }
}

// Singleton export
export const tfidfService = new TFIDFService();