'use client';

interface HowItWorksContent {
  title?: string;
  description?: string;
  step_1_title?: string;
  step_1_description?: string;
  step_1_icon?: string;
  step_2_title?: string;
  step_2_description?: string;
  step_2_icon?: string;
  step_3_title?: string;
  step_3_description?: string;
  step_3_icon?: string;
  step_4_title?: string;
  step_4_description?: string;
  step_4_icon?: string;
}

interface DynamicHowItWorksSectionProps {
  content: HowItWorksContent;
}

const DynamicHowItWorksSection = ({ content }: DynamicHowItWorksSectionProps) => {
  const defaultContent = {
    title: "How It Works",
    description: "Our streamlined process ensures quick implementation and immediate results.",
    step_1_title: "Analysis",
    step_1_description: "We analyze your current ad setup and identify optimization opportunities.",
    step_2_title: "Strategy",
    step_2_description: "Develop a customized optimization strategy based on your specific needs.",
    step_3_title: "Implementation",
    step_3_description: "Deploy our solutions with minimal disruption to your current operations.",
    step_4_title: "Optimization",
    step_4_description: "Continuous monitoring and optimization to maximize your revenue potential."
  };

  const sectionData = { ...defaultContent, ...content };

  const steps = [
    {
      number: "01",
      title: sectionData.step_1_title,
      description: sectionData.step_1_description,
      icon: sectionData.step_1_icon
    },
    {
      number: "02",
      title: sectionData.step_2_title,
      description: sectionData.step_2_description,
      icon: sectionData.step_2_icon
    },
    {
      number: "03",
      title: sectionData.step_3_title,
      description: sectionData.step_3_description,
      icon: sectionData.step_3_icon
    },
    {
      number: "04",
      title: sectionData.step_4_title,
      description: sectionData.step_4_description,
      icon: sectionData.step_4_icon
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6 mx-auto">
                {step.icon ? (
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  step.number
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DynamicHowItWorksSection;
