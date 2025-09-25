import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const servicesPageContent = [
  // Transform Business Section (Blue CTA Section)
  { section: 'services_page_content', key: 'transform_header', value: 'Ready to Transform Your Business?', type: 'text', order: 1 },
  { section: 'services_page_content', key: 'transform_subheading', value: 'Schedule a free 30-minute consultation with our experts to discuss your goals and discover how our services can help you achieve them.', type: 'textarea', order: 2 },
  { section: 'services_page_content', key: 'transform_checkpoint_1', value: 'Free 30-minute consultation', type: 'text', order: 3 },
  { section: 'services_page_content', key: 'transform_checkpoint_2', value: 'Personalized strategy recommendations', type: 'text', order: 4 },
  { section: 'services_page_content', key: 'transform_checkpoint_3', value: 'No obligation or commitment required', type: 'text', order: 5 },
  { section: 'services_page_content', key: 'transform_checkpoint_4', value: 'Expert insights and industry best practices', type: 'text', order: 6 },
  { section: 'services_page_content', key: 'transform_scheduling_title', value: 'Quick & Easy Scheduling', type: 'text', order: 7 },
  { section: 'services_page_content', key: 'transform_scheduling_subtitle', value: 'Book your consultation in just a few clicks', type: 'text', order: 8 },
  { section: 'services_page_content', key: 'transform_step_1_title', value: 'Choose your preferred time', type: 'text', order: 9 },
  { section: 'services_page_content', key: 'transform_step_1_desc', value: 'Select from available slots', type: 'text', order: 10 },
  { section: 'services_page_content', key: 'transform_step_2_title', value: 'Share your goals', type: 'text', order: 11 },
  { section: 'services_page_content', key: 'transform_step_2_desc', value: 'Tell us about your business needs', type: 'text', order: 12 },
  { section: 'services_page_content', key: 'transform_step_3_title', value: 'Get expert advice', type: 'text', order: 13 },
  { section: 'services_page_content', key: 'transform_step_3_desc', value: 'Receive personalized recommendations', type: 'text', order: 14 },
  { section: 'services_page_content', key: 'transform_stat_1_value', value: '500+', type: 'text', order: 15 },
  { section: 'services_page_content', key: 'transform_stat_1_label', value: 'Consultations', type: 'text', order: 16 },
  { section: 'services_page_content', key: 'transform_stat_2_value', value: '98%', type: 'text', order: 17 },
  { section: 'services_page_content', key: 'transform_stat_2_label', value: 'Satisfaction', type: 'text', order: 18 },
  { section: 'services_page_content', key: 'transform_stat_3_value', value: '24/7', type: 'text', order: 19 },
  { section: 'services_page_content', key: 'transform_stat_3_label', value: 'Support', type: 'text', order: 20 },
  { section: 'services_page_content', key: 'transform_cta_primary_text', value: 'Schedule Free Consultation', type: 'text', order: 21 },
  { section: 'services_page_content', key: 'transform_cta_primary_link', value: 'https://calendly.com/silviasam91/30min', type: 'text', order: 22 },
  { section: 'services_page_content', key: 'transform_cta_secondary_text', value: 'Call Us Now', type: 'text', order: 23 },
  { section: 'services_page_content', key: 'transform_cta_secondary_link', value: 'tel:+1234567890', type: 'text', order: 24 },
  
  // Packages Section Content
  { section: 'services_page_content', key: 'packages_header_title', value: 'Flexible Plans', type: 'text', order: 25 },
  { section: 'services_page_content', key: 'packages_header_description', value: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever", type: 'textarea', order: 26 },
  { section: 'services_page_content', key: 'packages_info_line_1', value: 'All plans include 24/7 support and a 30-day money-back guarantee.', type: 'text', order: 27 },
  { section: 'services_page_content', key: 'packages_info_line_2', value: 'Need a custom solution?', type: 'text', order: 28 },
  { section: 'services_page_content', key: 'packages_info_link_text', value: 'Contact us', type: 'text', order: 29 },
  { section: 'services_page_content', key: 'packages_info_link_href', value: '#contact', type: 'text', order: 30 },
  { section: 'services_page_content', key: 'packages_info_link_suffix', value: 'for enterprise pricing.', type: 'text', order: 31 },
];

async function initServicesPageContent() {
  try {
    console.log('Initializing services page content...');

    // Process items in smaller batches to avoid timeout
    const batchSize = 5;
    for (let i = 0; i < servicesPageContent.length; i += batchSize) {
      const batch = servicesPageContent.slice(i, i + batchSize);

      await Promise.all(
        batch.map(item =>
          prisma.content.upsert({
            where: {
              section_key: {
                section: item.section,
                key: item.key
              }
            },
            update: {
              value: item.value,
              type: item.type
            },
            create: {
              section: item.section,
              key: item.key,
              value: item.value,
              type: item.type
            }
          })
        )
      );

      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(servicesPageContent.length / batchSize)}`);
    }

    console.log(`✅ Successfully initialized ${servicesPageContent.length} services page content items`);
  } catch (error) {
    console.error('❌ Error initializing services page content:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
initServicesPageContent()
  .then(() => {
    console.log('Services page content initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Services page content initialization failed:', error);
    process.exit(1);
  });
