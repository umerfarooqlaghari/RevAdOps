'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';


interface FooterContent {
  company_description?: string;
  linkedin_link?: string;
  upwork_link?: string;
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
        console.log('Footer content fetched:', data.footer);
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
          {/* Footer Content */}
          <div className="text-center mb-8">
            {footerContent.company_description && (
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                {footerContent.company_description}
              </p>
            )}

            {/* Social Links */}
            <div className="flex justify-center items-center space-x-4 mb-8">
              <Link
                href={footerContent.linkedin_link || "https://linkedin.com/company/revadops"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 bg-[#0077B5] hover:bg-[#005885] rounded-lg transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium text-white">LinkedIn</span>
              </Link>

              <Link
                href={footerContent.upwork_link || "https://upwork.com/agencies/revadops"}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 bg-[#14A800] hover:bg-[#0F7A00] rounded-lg transition-colors duration-200"
                aria-label="Upwork"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3.002-2.439-5.453-5.439-5.453z"/>
                </svg>
                <span className="text-sm font-medium text-white">Upwork</span>
              </Link>
            </div>
          </div>

          {/* Bottom Section - ITAO Style */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
              <p className="text-gray-400 text-sm">
                {footerContent.copyright_text || `Copyright © ${new Date().getFullYear()} RevAdOps. All Rights Reserved`}
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
