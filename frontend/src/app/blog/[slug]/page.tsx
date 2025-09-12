import { notFound } from 'next/navigation';
import BlogArticleClient from './BlogArticleClient';
import { Metadata } from 'next';
import { articleCache } from '@/lib/articleCache';

// Types
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

// ✅ Enhanced fetch function that uses cache first, then API fallback
async function fetchArticleData(slug: string): Promise<Article | null> {
  try {
    // First, try to get from cache (instant)
    console.log(`🔍 Checking cache for article: ${slug}`);

    // Initialize cache if not already done
    await articleCache.initialize();

    // Try cache first
    const cachedArticle = articleCache.getArticle(slug);
    if (cachedArticle) {
      console.log(`✅ Article "${slug}" found in cache`);
      return cachedArticle;
    }

    console.log(`📡 Article "${slug}" not in cache, fetching from API...`);

    // Fallback to API with multiple URL attempts
    const possibleUrls = [
      process.env.NEXT_PUBLIC_API_URL,
      'http://localhost:5001',
      'http://127.0.0.1:5001',
    ].filter(Boolean);

    for (const apiUrl of possibleUrls) {
      try {
        const fullUrl = `${apiUrl}/blogs/post/${slug}`;
        console.log('Attempting to fetch article from:', fullUrl);

        const response = await fetch(fullUrl, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-Server',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(3000), // Shorter timeout for metadata generation
        });

        console.log('Response status:', response.status, 'from:', fullUrl);

        if (response.ok) {
          const article = await response.json();
          console.log('✅ Article fetched from API:', article.title);
          return article;
        }
      } catch (urlError) {
        console.log('❌ Failed to fetch from:', apiUrl, urlError instanceof Error ? urlError.message : 'Unknown error');
        continue; // Try next URL
      }
    }

    console.log(`❌ Article "${slug}" not found in cache or API`);
    return null;
  } catch (error) {
    console.error('❌ Error fetching article for metadata:', error);
    return null;
  }
}

// ✅ Enhanced generateMetadata that ALWAYS returns comprehensive metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  console.log('generateMetadata called for slug:', params.slug);

  // Create comprehensive fallback metadata that will always work
  const createFallbackMetadata = (slug: string): Metadata => {
    const formattedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://revadops.com'}/blog/${slug}`;

    return {
      title: `${formattedTitle} | RevAdOps Blog`,
      description: 'Discover advanced AdTech solutions, revenue optimization strategies, and programmatic advertising insights on RevAdOps Blog.',
      keywords: 'adtech, revenue optimization, programmatic advertising, header bidding, ad monetization',
      authors: [{ name: 'RevAdOps Team' }],
      creator: 'RevAdOps Team',
      publisher: 'RevAdOps',
      category: 'AdTech',

      openGraph: {
        title: `${formattedTitle} | RevAdOps Blog`,
        description: 'Discover advanced AdTech solutions, revenue optimization strategies, and programmatic advertising insights.',
        type: 'article',
        url: canonicalUrl,
        siteName: 'RevAdOps Blog',
        locale: 'en_US',
        publishedTime: new Date().toISOString(),
        authors: ['RevAdOps Team'],
        section: 'AdTech',
      },

      twitter: {
        card: 'summary_large_image',
        title: formattedTitle,
        description: 'Discover advanced AdTech solutions and revenue optimization strategies.',
        creator: '@revadops',
        site: '@revadops',
      },

      other: {
        'article:author': 'RevAdOps Team',
        'article:section': 'AdTech',
        'article:published_time': new Date().toISOString(),
      },

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  };

  // Try to fetch article data with a very short timeout to prevent blocking
  let article: Article | null = null;
  try {
    console.log('Attempting to fetch article data for metadata...');

    // Use a very short timeout for metadata generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/blogs/post/${params.slug}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      article = await response.json();
      console.log('Article fetched successfully for metadata:', article?.title);
    } else {
      console.log('Article fetch failed with status:', response.status);
    }
  } catch (error) {
    console.log('Article fetch failed or timed out for metadata, using fallback:', error instanceof Error ? error.message : 'Unknown error');
  }

  // If no article found, return fallback metadata
  if (!article) {
    console.log('No article found for metadata generation, using fallback');
    return createFallbackMetadata(params.slug);
  }

  console.log('Generating dynamic metadata for article:', article.title);

  const metaTitle = article.metaTitle || article.title;
  const metaDescription = article.metaDescription || article.excerpt || 'Discover advanced AdTech solutions and revenue optimization strategies.';
  const metaKeywords = article.metaKeywords || 'adtech, revenue optimization, programmatic advertising';
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://revadops.com'}/blog/${article.slug}`;
  const publishedDate = article.publishedAt || new Date().toISOString();

  return {
    title: `${metaTitle} | RevAdOps Blog`,
    description: metaDescription,
    keywords: metaKeywords,
    authors: [{ name: article.author || 'RevAdOps Team' }],
    creator: article.author || 'RevAdOps Team',
    publisher: 'RevAdOps',
    category: article.metaCategory || article.category?.name || 'AdTech',

    // Open Graph
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      url: canonicalUrl,
      siteName: 'RevAdOps Blog',
      locale: 'en_US',
      ...(article.featuredImage && {
        images: [
          {
            url: article.featuredImage,
            width: 1200,
            height: 630,
            alt: article.title,
          }
        ]
      }),
      publishedTime: publishedDate,
      modifiedTime: publishedDate,
      authors: [article.author || 'RevAdOps Team'],
      section: article.metaCategory || article.category?.name || 'AdTech',
      tags: Array.isArray(article.tags) ? article.tags : [],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@revadops',
      site: '@revadops',
      ...(article.featuredImage && {
        images: [article.featuredImage]
      }),
    },

    // Additional meta tags
    other: {
      'article:author': article.author || 'RevAdOps Team',
      'article:published_time': publishedDate,
      'article:modified_time': publishedDate,
      'article:section': article.metaCategory || article.category?.name || 'AdTech',
      ...(metaKeywords && { 'article:tag': metaKeywords }),
    },

    // Canonical URL
    alternates: {
      canonical: canonicalUrl,
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// ✅ Server component — fetch article + pass to client
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  console.log('ArticlePage server component called for slug:', params.slug);

  // Try to fetch article data, but don't fail if it doesn't work
  let article: Article | null = null;
  try {
    article = await fetchArticleData(params.slug);
  } catch (error) {
    console.log('Server component article fetch failed:', error);
  }

  if (!article) {
    console.log('No article found in server component, using notFound');
    notFound();
  }

  console.log('Server component rendering with article:', article.title);
  return (
    <BlogArticleClient initialArticle={article} slug={params.slug} />
  );
}
