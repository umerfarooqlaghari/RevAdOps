'use client';

import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Building, Target, DollarSign, MessageCircle, CheckCircle } from 'lucide-react';

interface ConsultationFormProps {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
    form_title?: string;
    form_description?: string;
    // Form fields
    name_placeholder?: string;
    email_placeholder?: string;
    phone_placeholder?: string;
    company_placeholder?: string;
    website_placeholder?: string;
    // Options
    service_options?: string;
    budget_options?: string;
    timeline_options?: string;
    time_slot_options?: string;
    // Messages
    submit_button_text?: string;
    success_message?: string;
    // Additional info
    consultation_duration?: string;
    availability?: string;
    timezone?: string;
  };
}

export default function DynamicConsultationFormSection({ content }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    service: '',
    budget: '',
    timeline: '',
    timeSlot: '',
    goals: '',
    challenges: '',
    additionalInfo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = content.service_options ? 
    content.service_options.split(',').map(s => s.trim()) : 
    ['SEO Optimization', 'PPC Advertising', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Full Marketing Strategy'];

  const budgetOptions = content.budget_options ? 
    content.budget_options.split(',').map(b => b.trim()) : 
    ['Under $5,000/month', '$5,000 - $10,000/month', '$10,000 - $25,000/month', '$25,000 - $50,000/month', '$50,000+/month', 'Not sure yet'];

  const timelineOptions = content.timeline_options ? 
    content.timeline_options.split(',').map(t => t.trim()) : 
    ['ASAP', 'Within 1 month', '1-3 months', '3-6 months', '6+ months'];

  const timeSlotOptions = content.time_slot_options ? 
    content.time_slot_options.split(',').map(t => t.trim()) : 
    ['Morning (9AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-8PM)', 'Flexible'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Consultation form submitted:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        service: '',
        budget: '',
        timeline: '',
        timeSlot: '',
        goals: '',
        challenges: '',
        additionalInfo: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="consultation-form" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-xl">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Consultation Booked!</h2>
            <p className="text-xl text-gray-600 mb-8">
              {content.success_message || 'Thank you for booking your free consultation. We\'ll contact you within 24 hours to confirm your appointment and send you the meeting details.'}
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
              <ul className="text-blue-800 space-y-2">
                <li>• You'll receive a confirmation email within 5 minutes</li>
                <li>• Our team will call you within 24 hours to schedule</li>
                <li>• We'll send you a calendar invite with meeting details</li>
                <li>• Prepare any questions you'd like to discuss</li>
              </ul>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Book Another Consultation
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation-form" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {content.subtitle && (
            <p className="text-blue-600 font-semibold text-lg mb-4">
              {content.subtitle}
            </p>
          )}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.title || 'Book Your Free Consultation'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.description || 'Fill out the form below to schedule your free marketing consultation with our experts.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {content.form_title || 'Schedule Your Consultation'}
              </h3>
              <p className="text-gray-600 mb-8">
                {content.form_description || 'Tell us about your business and marketing goals so we can prepare for our call.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={content.name_placeholder || 'Your full name'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={content.email_placeholder || 'your@email.com'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={content.phone_placeholder || '+1 (555) 123-4567'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder={content.company_placeholder || 'Your company name'}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder={content.website_placeholder || 'https://yourwebsite.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Project Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Interest *
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Budget Range
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        {budgetOptions.map((budget, index) => (
                          <option key={index} value={budget}>{budget}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Timeline
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select timeline</option>
                        {timelineOptions.map((timeline, index) => (
                          <option key={index} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        id="timeSlot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select preferred time</option>
                        {timeSlotOptions.map((slot, index) => (
                          <option key={index} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Goals and Challenges */}
                <div>
                  <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                    What are your main marketing goals? *
                  </label>
                  <textarea
                    id="goals"
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Increase website traffic, generate more leads, improve conversion rates..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-2">
                    What marketing challenges are you facing?
                  </label>
                  <textarea
                    id="challenges"
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Low website traffic, poor conversion rates, limited budget..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Anything else you'd like us to know before our consultation..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking Consultation...
                    </>
                  ) : (
                    <>
                      {content.submit_button_text || 'Book Free Consultation'}
                      <Calendar className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-blue-600 text-white rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Consultation Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Duration</div>
                    <div className="text-blue-100">{content.consultation_duration || '30 minutes'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Availability</div>
                    <div className="text-blue-100">{content.availability || 'Monday - Friday'}</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Format</div>
                    <div className="text-blue-100">Video call or phone</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Business and goals assessment</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Current marketing review</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Opportunity identification</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Strategic recommendations</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Next steps planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
