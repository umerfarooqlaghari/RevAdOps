'use client';

interface TestimonialsContent {
  title?: string;
  description?: string;
  testimonial_1_text?: string;
  testimonial_1_author?: string;
  testimonial_1_company?: string;
  testimonial_1_logo?: string;
  testimonial_1_avatar?: string;
  testimonial_2_text?: string;
  testimonial_2_author?: string;
  testimonial_2_company?: string;
  testimonial_2_logo?: string;
  testimonial_2_avatar?: string;
  testimonial_3_text?: string;
  testimonial_3_author?: string;
  testimonial_3_company?: string;
  testimonial_3_logo?: string;
  testimonial_3_avatar?: string;
}

interface DynamicTestimonialsSectionProps {
  content: TestimonialsContent;
}

const DynamicTestimonialsSection = ({ content }: DynamicTestimonialsSectionProps) => {
  const defaultContent = {
    title: "What Our Clients Say",
    description: "Hear from publishers who have transformed their ad revenue with RevAdOps.",
    testimonial_1_text: "RevAdOps increased our ad revenue by 45% in just 3 months. Their team is incredibly knowledgeable and responsive.",
    testimonial_1_author: "Sarah Johnson",
    testimonial_1_company: "TechNews Daily",
    testimonial_2_text: "The fraud detection capabilities saved us thousands in invalid traffic. Highly recommend their services.",
    testimonial_2_author: "Mike Chen",
    testimonial_2_company: "Gaming Hub",
    testimonial_3_text: "Professional service and outstanding results. Our fill rates improved dramatically.",
    testimonial_3_author: "Lisa Rodriguez",
    testimonial_3_company: "Mobile App Co."
  };

  const sectionData = { ...defaultContent, ...content };

  const testimonials = [
    {
      text: sectionData.testimonial_1_text,
      author: sectionData.testimonial_1_author,
      company: sectionData.testimonial_1_company,
      logo: sectionData.testimonial_1_logo,
      avatar: sectionData.testimonial_1_avatar
    },
    {
      text: sectionData.testimonial_2_text,
      author: sectionData.testimonial_2_author,
      company: sectionData.testimonial_2_company,
      logo: sectionData.testimonial_2_logo,
      avatar: sectionData.testimonial_2_avatar
    },
    {
      text: sectionData.testimonial_3_text,
      author: sectionData.testimonial_3_author,
      company: sectionData.testimonial_3_company,
      logo: sectionData.testimonial_3_logo,
      avatar: sectionData.testimonial_3_avatar
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
              {testimonial.logo && (
                <div className="mb-4">
                  <img
                    src={testimonial.logo}
                    alt={`${testimonial.company} logo`}
                    className="h-8 object-contain"
                  />
                </div>
              )}
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicTestimonialsSection;
