'use client';

import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

interface ContactMapProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    map_embed_url?: string;
    show_directions?: string;
    // Location 1
    location_1_name?: string;
    location_1_address?: string;
    location_1_phone?: string;
    location_1_email?: string;
    location_1_hours?: string;
    location_1_lat?: string;
    location_1_lng?: string;
    // Location 2
    location_2_name?: string;
    location_2_address?: string;
    location_2_phone?: string;
    location_2_email?: string;
    location_2_hours?: string;
    location_2_lat?: string;
    location_2_lng?: string;
  };
}

export default function DynamicContactMapSection({ content }: ContactMapProps) {
  const locations = [
    {
      name: content.location_1_name || 'New York Office',
      address: content.location_1_address || '123 Business Street, Suite 100\nNew York, NY 10001',
      phone: content.location_1_phone || '+1 (555) 123-4567',
      email: content.location_1_email || 'ny@revadops.com',
      hours: content.location_1_hours || 'Mon-Fri: 9AM-6PM EST',
      lat: content.location_1_lat || '40.7128',
      lng: content.location_1_lng || '-74.0060',
    },
    {
      name: content.location_2_name || 'San Francisco Office',
      address: content.location_2_address || '456 Innovation Avenue, Floor 5\nSan Francisco, CA 94105',
      phone: content.location_2_phone || '+1 (555) 987-6543',
      email: content.location_2_email || 'sf@revadops.com',
      hours: content.location_2_hours || 'Mon-Fri: 9AM-6PM PST',
      lat: content.location_2_lat || '37.7749',
      lng: content.location_2_lng || '-122.4194',
    },
  ].filter(location => location.name && location.address);

  const getDirectionsUrl = (address: string) => {
    const encodedAddress = encodeURIComponent(address.replace('\n', ', '));
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  };

  const getMapEmbedUrl = () => {
    if (content.map_embed_url) {
      return content.map_embed_url;
    }
    
    // Default to showing the first location
    const location = locations[0];
    if (location) {
      const address = encodeURIComponent(location.address.replace('\n', ', '));
      return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${address}`;
    }
    
    return null;
  };

  return (
    <section id="map" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Visit Our Offices'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'Find us at one of our convenient locations or schedule a virtual meeting.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Location Cards */}
          <div className="lg:col-span-1 space-y-6">
            {locations.map((location, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{location.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <div className="text-gray-900 whitespace-pre-line">{location.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <a 
                        href={`tel:${location.phone}`} 
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <a 
                        href={`mailto:${location.email}`} 
                        className="text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Hours</div>
                      <div className="text-gray-900">{location.hours}</div>
                    </div>
                  </div>
                </div>

                {content.show_directions !== 'false' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href={getDirectionsUrl(location.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96 lg:h-full min-h-[400px]">
              {getMapEmbedUrl() ? (
                <iframe
                  src={getMapEmbedUrl()!}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location Map"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Interactive Map</h3>
                    <p className="text-gray-500">
                      Map integration requires API configuration
                    </p>
                    <div className="mt-4 space-y-2">
                      {locations.map((location, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <strong>{location.name}:</strong> {location.address.replace('\n', ', ')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Can&apos;t Visit in Person?</h3>
            <p className="text-blue-100 mb-6">
              No problem! We offer virtual consultations and meetings to accommodate your schedule.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact-form"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Schedule Virtual Meeting
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
