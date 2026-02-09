import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetModifiedDates() {
  try {
    console.log('Resetting modified dates for all departments...');
    
    const result = await prisma.department.updateMany({
      data: {
        modified: null,
        modifiedBy: null,
      },
    });

    console.log(`✓ Updated ${result.count} departments`);
    console.log('Modified dates have been reset. They will be set when departments are actually modified.');
  } catch (error) {
    console.error('Error resetting modified dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetModifiedDates();
