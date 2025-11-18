import prisma from '../src/config/database.js';

async function migrate() {
  try {
    console.log('Starting lead migration...');

    const leads = await prisma.lead.findMany();
    let updated = 0;

    for (const lead of leads) {
      const updates = {};

      // If websiteUrl is missing but message starts with 'Website: '
      if (!lead.websiteUrl && lead.message && lead.message.startsWith('Website:')) {
        updates.websiteUrl = lead.message.replace(/^Website:\s*/i, '').trim() || null;
        // clear message if it only contained website
        updates.message = null;
      }

      // If firstName/lastName missing, try to split name
      if ((!lead.firstName || !lead.lastName) && lead.name) {
        const parts = lead.name.split(' ').filter(Boolean);
        if (parts.length === 1) {
          updates.firstName = parts[0];
        } else if (parts.length > 1) {
          updates.firstName = parts[0];
          updates.lastName = parts.slice(1).join(' ');
        }
      }

      if (Object.keys(updates).length > 0) {
        await prisma.lead.update({ where: { id: lead.id }, data: updates });
        updated++;
      }
    }

    console.log(`Migration complete. Updated ${updated} leads.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
