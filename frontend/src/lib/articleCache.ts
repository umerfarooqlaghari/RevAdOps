// Article Cache Service for pre-rendering and caching article metadata
interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string;
  author: string;
  metaDescription: string;
  metaTitle?: string;
  metaKeywords?: string;
  metaCategory?: string;
  publishedAt: string;
  tags: string[];
  viewCount: number;
  advertisement1?: string;
  advertisement2?: string;
  htmlWidgetIds?: string[];
  category: {
    name: string;
    slug: string;
  } | null;
}

interface ArticleMetadata {
  title: string;
  metaTitle?: string;
  metaDescription: string;
  metaKeywords?: string;
  metaCategory?: string;
  slug: string;
  author: string;
  publishedAt: string;
  featuredImage: string;
  excerpt: string;
  tags: string[];
  category: {
    name: string;
    slug: string;
  } | null;
}

class ArticleCacheService {
  private cache: Map<string, Article> = new Map();
  private metadataCache: Map<string, ArticleMetadata> = new Map();
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Initialize cache with all articles
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.loadAllArticles();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async loadAllArticles(): Promise<void> {
    try {
      console.log('🚀 Loading all articles for cache...');
      
      // Fetch all published articles
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/blogs?limit=1000&published=true`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }

      const data = await response.json();
      const articles: Article[] = data.blogs || data.data || [];

      console.log(`📚 Caching ${articles.length} articles...`);

      // Cache full articles and metadata
      articles.forEach(article => {
        this.cache.set(article.slug, article);
        
        // Extract metadata for quick access
        const metadata: ArticleMetadata = {
          title: article.title,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          metaCategory: article.metaCategory,
          slug: article.slug,
          author: article.author,
          publishedAt: article.publishedAt,
          featuredImage: article.featuredImage,
          excerpt: article.excerpt,
          tags: article.tags,
          category: article.category,
        };
        
        this.metadataCache.set(article.slug, metadata);
      });

      console.log(`✅ Successfully cached ${articles.length} articles`);
    } catch (error) {
      console.error('❌ Failed to load articles for cache:', error);
      // Don't throw error to prevent app from breaking
    }
  }

  // Get article from cache (instant)
  getArticle(slug: string): Article | null {
    return this.cache.get(slug) || null;
  }

  // Get article metadata from cache (instant)
  getArticleMetadata(slug: string): ArticleMetadata | null {
    return this.metadataCache.get(slug) || null;
  }

  // Get all cached articles
  getAllArticles(): Article[] {
    return Array.from(this.cache.values());
  }

  // Get all cached metadata
  getAllMetadata(): ArticleMetadata[] {
    return Array.from(this.metadataCache.values());
  }

  // Check if article exists in cache
  hasArticle(slug: string): boolean {
    return this.cache.has(slug);
  }

  // Get article with fallback to API
  async getArticleWithFallback(slug: string): Promise<Article | null> {
    // First try cache
    const cachedArticle = this.getArticle(slug);
    if (cachedArticle) {
      console.log(`📖 Article "${slug}" served from cache`);
      return cachedArticle;
    }

    // Fallback to API
    try {
      console.log(`🌐 Fetching article "${slug}" from API...`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/blogs/post/${slug}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const article = await response.json();
        // Cache the newly fetched article
        this.cache.set(slug, article);
        
        const metadata: ArticleMetadata = {
          title: article.title,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          metaCategory: article.metaCategory,
          slug: article.slug,
          author: article.author,
          publishedAt: article.publishedAt,
          featuredImage: article.featuredImage,
          excerpt: article.excerpt,
          tags: article.tags,
          category: article.category,
        };
        this.metadataCache.set(slug, metadata);
        
        console.log(`✅ Article "${slug}" fetched and cached`);
        return article;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch article "${slug}":`, error);
    }

    return null;
  }

  // Refresh cache
  async refresh(): Promise<void> {
    this.cache.clear();
    this.metadataCache.clear();
    this.isInitialized = false;
    this.initPromise = null;
    await this.initialize();
  }

  // Get cache stats
  getStats() {
    return {
      totalArticles: this.cache.size,
      totalMetadata: this.metadataCache.size,
      isInitialized: this.isInitialized,
      articles: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const articleCache = new ArticleCacheService();

// Export types
export type { Article, ArticleMetadata };
