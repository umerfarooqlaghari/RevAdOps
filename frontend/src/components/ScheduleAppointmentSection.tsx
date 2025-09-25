'use client';

import { Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface ScheduleContent {
  transform_header?: string;
  transform_subheading?: string;
  transform_checkpoint_1?: string;
  transform_checkpoint_2?: string;
  transform_checkpoint_3?: string;
  transform_checkpoint_4?: string;
  transform_cta_primary_text?: string;
  transform_cta_primary_link?: string;
  transform_cta_secondary_text?: string;
  transform_cta_secondary_link?: string;
  transform_scheduling_title?: string;
  transform_scheduling_subtitle?: string;
  transform_step_1_title?: string;
  transform_step_1_desc?: string;
  transform_step_2_title?: string;
  transform_step_2_desc?: string;
  transform_step_3_title?: string;
  transform_step_3_desc?: string;
  transform_stat_1_value?: string;
  transform_stat_1_label?: string;
  transform_stat_2_value?: string;
  transform_stat_2_label?: string;
  transform_stat_3_value?: string;
  transform_stat_3_label?: string;
}

export default function ScheduleAppointmentSection({ content = {} as ScheduleContent }: { content?: ScheduleContent }) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {content.transform_header || 'Ready to Transform Your Business?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {content.transform_subheading || 'Schedule a free 30-minute consultation with our experts to discuss your goals and discover how our services can help you achieve them.'}
            </p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[content.transform_checkpoint_1 || 'Free 30-minute consultation', content.transform_checkpoint_2 || 'Personalized strategy recommendations', content.transform_checkpoint_3 || 'No obligation or commitment required', content.transform_checkpoint_4 || 'Expert insights and industry best practices']
                .map((text, idx) => (
                  <div key={idx} className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-blue-100">{text}</span>
                  </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={content.transform_cta_primary_link || 'https://calendly.com/silviasam91/30min'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
              >
                <Calendar className="mr-3 h-5 w-5" />
                {content.transform_cta_primary_text || 'Schedule Free Consultation'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              <a
                href={content.transform_cta_secondary_link || 'tel:+1234567890'}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200"
              >
                {content.transform_cta_secondary_text || 'Call Us Now'}
              </a>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {content.transform_scheduling_title || 'Quick & Easy Scheduling'}
                </h3>
                <p className="text-blue-100">
                  {content.transform_scheduling_subtitle || 'Book your consultation in just a few clicks'}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {[
                  { n: '1', t: content.transform_step_1_title || 'Choose your preferred time', d: content.transform_step_1_desc || 'Select from available slots' },
                  { n: '2', t: content.transform_step_2_title || 'Share your goals', d: content.transform_step_2_desc || 'Tell us about your business needs' },
                  { n: '3', t: content.transform_step_3_title || 'Get expert advice', d: content.transform_step_3_desc || 'Receive personalized recommendations' },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {s.n}
                    </div>
                    <div className="ml-4">
                      <p className="text-white font-medium">{s.t}</p>
                      <p className="text-blue-200 text-sm">{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">{content.transform_stat_1_value || '500+'}</div>
                    <div className="text-blue-200 text-sm">{content.transform_stat_1_label || 'Consultations'}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{content.transform_stat_2_value || '98%'}</div>
                    <div className="text-blue-200 text-sm">{content.transform_stat_2_label || 'Satisfaction'}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{content.transform_stat_3_value || '24/7'}</div>
                    <div className="text-blue-200 text-sm">{content.transform_stat_3_label || 'Support'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
