'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceDetailHero from '@/components/ServiceDetailHero';
import ServiceImageSlider from '@/components/ServiceImageSlider';
import ServiceDetailCTA from '@/components/ServiceDetailCTA';
import { notFound } from 'next/navigation';

interface ServiceImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

interface ServicePackage {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular: boolean;
  order: number;
  ctaText: string;
  ctaLink?: string;
  isActive: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  shortDesc?: string;
  icon?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ctaText?: string;
  ctaLink?: string;
  createdAt: string;
  updatedAt: string;
  images: ServiceImage[];
  packages: ServicePackage[];
}

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/detail/${slug}`);
        
        if (response.ok) {
          const data = await response.json();
          setService(data);
          
          // Update page title and meta tags
          if (data.metaTitle) {
            document.title = data.metaTitle;
          } else {
            document.title = `${data.title} - RevAdOps`;
          }
          
          // Update meta description
          if (data.metaDescription) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', data.metaDescription);
            } else {
              const meta = document.createElement('meta');
              meta.name = 'description';
              meta.content = data.metaDescription;
              document.head.appendChild(meta);
            }
          }
          
          // Update meta keywords
          if (data.metaKeywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
              metaKeywords.setAttribute('content', data.metaKeywords);
            } else {
              const meta = document.createElement('meta');
              meta.name = 'keywords';
              meta.content = data.metaKeywords;
              document.head.appendChild(meta);
            }
          }
        } else if (response.status === 404) {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Service Header Section */}
        <ServiceDetailHero service={service} />
        
        {/* Image Slider Section */}
        {service.images && service.images.length > 0 && (
          <ServiceImageSlider images={service.images} serviceName={service.title} />
        )}
        
        {/* Call-to-Action Section */}
        <ServiceDetailCTA service={service} />
      </main>
      <Footer />
    </div>
  );
}
