/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from 'next';
import ArticlePageClient from './ArticlePageClient';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/post/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        title: 'Article Not Found | RevAdOps Blog',
        description: 'The requested article could not be found.'
      };
    }

    const article = await response.json();

    const metaTitle = article.metaTitle || article.title;
    const metaDescription = article.metaDescription || article.excerpt || '';
    const metaKeywords = article.metaKeywords || '';

    return {
      title: `${metaTitle} | RevAdOps Blog`,
      description: metaDescription,
      keywords: metaKeywords,
      authors: [{ name: article.author || 'RevAdOps Team' }],
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author || 'RevAdOps Team'],
        section: article.metaCategory || article.category?.name || '',
        tags: article.tags || [],
        images: article.featuredImage ? [
          {
            url: article.featuredImage,
            alt: article.title,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: article.featuredImage ? [article.featuredImage] : [],
      },
      other: {
        'article:author': article.author || 'RevAdOps Team',
        'article:published_time': article.publishedAt,
        'article:section': article.metaCategory || article.category?.name || '',
        ...(article.tags && article.tags.length > 0 && {
          'article:tag': article.tags.join(', ')
        })
      },
      // Add structured data (JSON-LD)
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
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
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Article | RevAdOps Blog',
      description: 'Read the latest insights and articles from RevAdOps.'
    };
  }
}

// Server component that renders the client component
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticlePageClient slug={slug} />;
}


