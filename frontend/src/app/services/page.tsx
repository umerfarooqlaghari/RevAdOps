'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DynamicServicesHeroSection from '@/components/DynamicServicesHeroSection';
import DynamicServicesGridSection from '@/components/DynamicServicesGridSection';
import ServicePackagesSection from '@/components/ServicePackagesSection';
import DynamicTestimonialsSection from '@/components/DynamicTestimonialsSection';
import ScheduleAppointmentSection from '@/components/ScheduleAppointmentSection';
import BlogSliderSection from '@/components/BlogSliderSection';
import { useState, useEffect } from 'react';

interface ContentSection {
  [key: string]: string;
}

interface ServicesContent {
  hero: ContentSection;
  services_intro: ContentSection;
  testimonials: ContentSection;
  services_appointment?: ContentSection;
  services_packages?: ContentSection;
  services_page_content?: ContentSection;
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
  ctaText?: string;
  ctaLink?: string;
  images: ServiceImage[];
}

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

interface TestimonialItem {
  id?: string;
  text: string;
  clientName: string;
  companyName?: string;
  clientImage?: string;
  author?: string;
  company?: string;
  logo?: string;
  avatar?: string;
  order?: number;
}

export default function ServicesPage() {
  const [content, setContent] = useState<ServicesContent>({
    hero: {},
    services_intro: {},
    testimonials: {},
    services_appointment: {},
    services_packages: {},
  });
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch content
        const contentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
        const contentData = await contentResponse.json();

        // Transform services_page_content to extract values
        const transformContentSection = (section: Record<string, unknown>) => {
          if (!section || typeof section !== 'object') return {};
          const transformed: Record<string, string> = {};
          Object.entries(section).forEach(([key, item]) => {
            if (typeof item === 'object' && item !== null && 'value' in item) {
              transformed[key] = String((item as { value: unknown }).value || '');
            } else {
              transformed[key] = String(item || '');
            }
          });
          return transformed;
        };

        const servicesContent = {
          hero: contentData.services_hero || {},
          services_intro: contentData.services_intro || {},
          testimonials: contentData.testimonials || {},
          services_appointment: contentData.services_appointment || {},
          services_packages: contentData.services_packages || {},
          services_page_content: transformContentSection(contentData.services_page_content),
        };

        setContent(servicesContent);

        // Fetch services
        const servicesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`);
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }

        // Fetch service packages
        const packagesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/packages`);
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          setPackages(packagesData);
        }

        // Fetch testimonials
        const testimonialsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/testimonials`);
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.items || []);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Available</h1>
          <p className="text-gray-600">Unable to load services content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <DynamicServicesHeroSection content={content.hero} />

        {/* Core Services Grid Section */}
        <DynamicServicesGridSection
          content={content.services_intro}
          services={services}
        />

        {/* Service Packages Section */}
        <ServicePackagesSection packages={packages} content={content.services_page_content} />

        {/* Testimonials Section */}
        <DynamicTestimonialsSection
          content={content.testimonials}
          items={testimonials}
          source="services"
        />

        {/* Schedule Appointment CTA Section */}
        <ScheduleAppointmentSection content={content.services_page_content} />

        {/* Blog Slider Section */}
        <BlogSliderSection />
      </main>
      <Footer />
    </div>
  );
}
