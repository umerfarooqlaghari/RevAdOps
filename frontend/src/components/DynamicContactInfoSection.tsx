'use client';

import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Users, 
  Award, 
  Headphones 
} from 'lucide-react';

interface ContactInfoProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    // Office info
    office_1_name?: string;
    office_1_address?: string;
    office_1_phone?: string;
    office_1_email?: string;
    office_2_name?: string;
    office_2_address?: string;
    office_2_phone?: string;
    office_2_email?: string;
    // Support info
    support_title?: string;
    support_description?: string;
    support_hours?: string;
    support_phone?: string;
    support_email?: string;
    // Features
    feature_1_title?: string;
    feature_1_description?: string;
    feature_1_icon?: string;
    feature_2_title?: string;
    feature_2_description?: string;
    feature_2_icon?: string;
    feature_3_title?: string;
    feature_3_description?: string;
    feature_3_icon?: string;
    feature_4_title?: string;
    feature_4_description?: string;
    feature_4_icon?: string;
  };
}

const iconMap: { [key: string]: React.ComponentType<{className?: string}> } = {
  phone: Phone,
  mail: Mail,
  map: MapPin,
  clock: Clock,
  message: MessageCircle,
  users: Users,
  award: Award,
  headphones: Headphones,
};

export default function DynamicContactInfoSection({ content }: ContactInfoProps) {
  const offices = [
    {
      name: content.office_1_name || 'Main Office',
      address: content.office_1_address || '123 Business Street, Suite 100\nNew York, NY 10001',
      phone: content.office_1_phone || '+1 (555) 123-4567',
      email: content.office_1_email || 'ny@revadops.com',
    },
    {
      name: content.office_2_name || 'West Coast Office',
      address: content.office_2_address || '456 Innovation Ave, Floor 5\nSan Francisco, CA 94105',
      phone: content.office_2_phone || '+1 (555) 987-6543',
      email: content.office_2_email || 'sf@revadops.com',
    },
  ];

  const features = [
    {
      title: content.feature_1_title || '24/7 Support',
      description: content.feature_1_description || 'Round-the-clock assistance for all your needs.',
      icon: content.feature_1_icon || 'headphones',
    },
    {
      title: content.feature_2_title || 'Expert Team',
      description: content.feature_2_description || 'Experienced professionals ready to help.',
      icon: content.feature_2_icon || 'users',
    },
    {
      title: content.feature_3_title || 'Quick Response',
      description: content.feature_3_description || 'Fast response times to your inquiries.',
      icon: content.feature_3_icon || 'message',
    },
    {
      title: content.feature_4_title || 'Proven Results',
      description: content.feature_4_description || 'Track record of successful partnerships.',
      icon: content.feature_4_icon || 'award',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Multiple Ways to Reach Us'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'Choose the most convenient way to get in touch with our team.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Office Locations */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Our Offices</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{office.name}</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Address</div>
                        <div className="text-gray-900 whitespace-pre-line">{office.address}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Phone</div>
                        <a href={`tel:${office.phone}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                          {office.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <a href={`mailto:${office.email}`} className="text-gray-900 hover:text-blue-600 transition-colors">
                          {office.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Support Center</h3>
            <div className="bg-blue-600 text-white rounded-xl p-8">
              <h4 className="text-xl font-bold mb-4">
                {content.support_title || 'Need Help?'}
              </h4>
              
              <p className="text-blue-100 mb-6">
                {content.support_description || 'Our support team is here to assist you with any questions or concerns.'}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <div className="text-sm text-blue-200">Hours</div>
                    <div>{content.support_hours || 'Mon-Fri: 9AM-6PM EST'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3" />
                  <div>
                    <div className="text-sm text-blue-200">Support Phone</div>
                    <a href={`tel:${content.support_phone || '+15551234567'}`} className="hover:text-blue-200 transition-colors">
                      {content.support_phone || '+1 (555) 123-4567'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3" />
                  <div>
                    <div className="text-sm text-blue-200">Support Email</div>
                    <a href={`mailto:${content.support_email || 'support@revadops.com'}`} className="hover:text-blue-200 transition-colors">
                      {content.support_email || 'support@revadops.com'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Choose Us</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon] || Headphones;
              
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
