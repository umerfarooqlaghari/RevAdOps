'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "What services does RevAdOps provide in the realm of Digital Media Ad Operations for publishers?",
      answer: "RevAdOps specializes in providing end-to-end solutions for publishers, including ad trafficking, campaign management, optimization, analytics, and technical support to enhance the efficiency and effectiveness of digital advertising campaigns."
    },
    {
      id: 2,
      question: "How can RevAdOps help publishers optimize their ad campaigns?",
      answer: "RevAdOps employs advanced analytics and optimization strategies to analyze key performance indicators (KPIs) and refine targeting, ad creatives, and other campaign elements. This ensures that publishers achieve maximum performance and ROI from their digital ad campaigns."
    },
    {
      id: 3,
      question: "What role does RevAdOps play in troubleshooting technical issues for publishers?",
      answer: "RevAdOps has a dedicated technical support team to identify and resolve any technical challenges publishers may encounter, including ad delivery issues, discrepancies, and other technical intricacies related to digital advertising."
    },
    {
      id: 4,
      question: "How does RevAdOps collaborate with publishers' sales and marketing teams?",
      answer: "RevAdOps works closely with publishers' sales and marketing teams to align digital ad operations with overall business objectives. This collaboration involves understanding client requirements, executing campaigns, and providing insights to enhance strategic decision-making."
    },
    {
      id: 5,
      question: "What measures does RevAdOps take to prevent ad fraud for publishers?",
      answer: "To combat ad fraud, RevAdOps implements robust ad verification tools, monitors traffic sources rigorously, and utilizes cutting-edge fraud detection technologies. Regular audits and validations of traffic sources are conducted to ensure a secure and fraud-free advertising environment."
    },
    {
      id: 6,
      question: "How can RevAdOps assist publishers in implementing Header Bidding?",
      answer: "RevAdOps provides comprehensive support in implementing Header Bidding, including integration into the ad stack, setup configuration, and management of demand partners. This enables publishers to maximize revenue through optimized auction processes."
    },
    {
      id: 7,
      question: "Can RevAdOps provide detailed insights into campaign performance and audience engagement?",
      answer: "Absolutely. RevAdOps utilizes state-of-the-art analytics tools and reporting platforms to generate detailed insights into campaign performance. Publishers receive comprehensive reports on key metrics, empowering them to make informed decisions and refine their advertising strategies."
    },
    {
      id: 8,
      question: "How does RevAdOps enhance Programmatic Advertising for publishers?",
      answer: "RevAdOps leverages its expertise to streamline Programmatic Advertising, utilizing advanced algorithms and real-time bidding (RTB) platforms. This automation ensures efficient buying and selling of digital ad inventory, resulting in targeted and impactful ad placements for publishers."
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            FAQ
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.id}. {faq.question}
                </span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === faq.id && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
