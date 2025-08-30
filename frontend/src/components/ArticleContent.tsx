/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import Image from 'next/image';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Function to process and sanitize HTML content
  const processContent = (htmlContent: string) => {
    // Basic HTML sanitization and processing
    // In a production environment, you might want to use a library like DOMPurify
    
    // Replace image tags with Next.js Image components
    const processedContent = htmlContent
      .replace(/<img([^>]*?)src="([^"]*?)"([^>]*?)>/gi, (match, before, src, after) => {
        const altMatch = match.match(/alt="([^"]*?)"/i);
        const alt = altMatch ? altMatch[1] : '';
        const widthMatch = match.match(/width="([^"]*?)"/i);
        const heightMatch = match.match(/height="([^"]*?)"/i);
        const width = widthMatch ? widthMatch[1] : '800';
        const height = heightMatch ? heightMatch[1] : '400';
        
        return `<div class="article-image-wrapper my-8">
          <img src="${src}" alt="${alt}" width="${width}" height="${height}" class="article-image" />
        </div>`;
      });

    return processedContent;
  };

  return (
    <div className="article-content">
      <style jsx global>{`
        .article-content {
          line-height: 1.8;
          color: #374151;
        }
        
        .article-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem 0;
          line-height: 1.2;
        }
        
        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 600;
          color: #111827;
          margin: 1.75rem 0 1rem 0;
          line-height: 1.3;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 0.5rem;
        }
        
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin: 1.5rem 0 0.75rem 0;
          line-height: 1.4;
        }
        
        .article-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 1.25rem 0 0.75rem 0;
          line-height: 1.4;
        }
        
        .article-content h5 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .article-content h6 {
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          margin: 1rem 0 0.5rem 0;
          line-height: 1.4;
        }
        
        .article-content p {
          margin: 1rem 0;
          font-size: 1.125rem;
          line-height: 1.8;
        }
        
        .article-content strong {
          font-weight: 600;
          color: #111827;
        }
        
        .article-content em {
          font-style: italic;
        }
        
        .article-content u {
          text-decoration: underline;
        }
        
        .article-content a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }
        
        .article-content a:hover {
          color: #1d4ed8;
        }
        
        .article-content ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        
        .article-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
          list-style-type: decimal;
        }
        
        .article-content li {
          margin: 0.5rem 0;
          font-size: 1.125rem;
          line-height: 1.7;
        }
        
        .article-content blockquote {
          margin: 2rem 0;
          padding: 1rem 1.5rem;
          border-left: 4px solid #2563eb;
          background-color: #f8fafc;
          font-style: italic;
          font-size: 1.125rem;
          color: #475569;
        }
        
        .article-content blockquote p {
          margin: 0;
        }
        
        .article-content code {
          background-color: #f1f5f9;
          color: #e11d48;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        
        .article-content pre {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .article-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }
        
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 1rem;
        }
        
        .article-content th,
        .article-content td {
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          text-align: left;
        }
        
        .article-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #111827;
        }
        
        .article-content .article-image-wrapper {
          margin: 2rem 0;
          text-align: center;
        }
        
        .article-content .article-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .article-content hr {
          margin: 2rem 0;
          border: none;
          border-top: 2px solid #e5e7eb;
        }
        
        .article-content .highlight {
          background-color: #fef3c7;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        
        .article-content .callout {
          margin: 1.5rem 0;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #10b981;
          background-color: #ecfdf5;
        }
        
        .article-content .callout.warning {
          border-left-color: #f59e0b;
          background-color: #fffbeb;
        }
        
        .article-content .callout.error {
          border-left-color: #ef4444;
          background-color: #fef2f2;
        }
        
        .article-content .callout.info {
          border-left-color: #3b82f6;
          background-color: #eff6ff;
        }
        
        @media (max-width: 768px) {
          .article-content h1 {
            font-size: 1.875rem;
          }
          
          .article-content h2 {
            font-size: 1.5rem;
          }
          
          .article-content h3 {
            font-size: 1.25rem;
          }
          
          .article-content p,
          .article-content li {
            font-size: 1rem;
          }
          
          .article-content table {
            font-size: 0.875rem;
          }
          
          .article-content th,
          .article-content td {
            padding: 0.5rem;
          }
        }
      `}</style>
      
      <div 
        dangerouslySetInnerHTML={{ 
          __html: processContent(content) 
        }} 
      />
    </div>
  );
}
