'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

interface FooterContent {
  logo?: string;
  logo_alt?: string;
  company_description?: string;
  facebook_icon?: string;
  facebook_link?: string;
  twitter_icon?: string;
  twitter_link?: string;
  linkedin_icon?: string;
  linkedin_link?: string;
  instagram_icon?: string;
  instagram_link?: string;
  copyright_text?: string;
}

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [footerContent, setFooterContent] = useState<FooterContent>({});

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const fetchFooterContent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      if (response.ok) {
        const data = await response.json();
        setFooterContent(data.footer || {});
      }
    } catch (error) {
      console.error('Failed to fetch footer content:', error);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement newsletter signup API call
      console.log('Newsletter signup:', email);
      setEmail('');
      // Show success message
    } catch (error) {
      console.error('Newsletter signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  const services = [
    { name: 'Header Bidding', href: '/services/header-bidding' },
    { name: 'Programmatic Deals', href: '/services/programmatic' },
    { name: 'Revenue Analytics', href: '/services/analytics' },
    { name: 'Ad Fraud Protection', href: '/services/fraud-protection' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Instagram', href: '#', icon: Instagram },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="py-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <img
                src={footerContent.logo || "/logo-placeholder.svg"}
                alt={footerContent.logo_alt || "RevAdOps Logo"}
                className="h-8 w-auto"
              />
            </Link>
            {footerContent.company_description && (
              <p className="text-gray-400 mt-4 max-w-md mx-auto">
                {footerContent.company_description}
              </p>
            )}
          </div>

          {/* Bottom Section - ITAO Style */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <p className="text-gray-400 text-sm">
                Copyright © {new Date().getFullYear()} RevAdOps. All Rights Reserved
              </p>

              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                  | Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
