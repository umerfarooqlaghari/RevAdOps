'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';


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



  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="py-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="RevAdOps Logo"
                width={96}
                height={32}
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
