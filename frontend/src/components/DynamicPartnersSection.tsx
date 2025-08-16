'use client';

interface PartnersContent {
  title?: string;
  description?: string;
  partner_1_logo?: string;
  partner_1_name?: string;
  partner_2_logo?: string;
  partner_2_name?: string;
  partner_3_logo?: string;
  partner_3_name?: string;
  partner_4_logo?: string;
  partner_4_name?: string;
  partner_5_logo?: string;
  partner_5_name?: string;
  partner_6_logo?: string;
  partner_6_name?: string;
}

interface DynamicPartnersSectionProps {
  content: PartnersContent;
}

const DynamicPartnersSection = ({ content }: DynamicPartnersSectionProps) => {
  const defaultContent = {
    title: "Trusted by Leading Publishers",
    description: "Join hundreds of successful publishers who trust RevAdOps for their ad revenue optimization.",
    partner_1_name: "Partner 1",
    partner_2_name: "Partner 2",
    partner_3_name: "Partner 3",
    partner_4_name: "Partner 4",
    partner_5_name: "Partner 5",
    partner_6_name: "Partner 6"
  };

  const sectionData = { ...defaultContent, ...content };

  const partners = [
    { logo: sectionData.partner_1_logo, name: sectionData.partner_1_name },
    { logo: sectionData.partner_2_logo, name: sectionData.partner_2_name },
    { logo: sectionData.partner_3_logo, name: sectionData.partner_3_name },
    { logo: sectionData.partner_4_logo, name: sectionData.partner_4_name },
    { logo: sectionData.partner_5_logo, name: sectionData.partner_5_name },
    { logo: sectionData.partner_6_logo, name: sectionData.partner_6_name }
  ].filter(partner => partner.logo); // Only show partners with logos

  // Don't render the section if no partners have logos
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {sectionData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {sectionData.description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicPartnersSection;
