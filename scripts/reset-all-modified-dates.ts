import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetData() {
  try {
    console.log('Resetting modified dates for all entities...\n');
    
    // Reset departments
    const deptResult = await prisma.department.updateMany({
      data: {
        modified: null,
        modifiedBy: null,
      },
    });
    console.log(`✓ Updated ${deptResult.count} departments`);
    
    // Reset meeting types
    const typeResult = await prisma.meetingType.updateMany({
      data: {
        modified: null,
        modifiedBy: null,
      },
    });
    console.log(`✓ Updated ${typeResult.count} meeting types`);
    
    console.log('\n✓ All modified dates have been reset.');
    console.log('They will be set when entities are actually modified.');
  } catch (error) {
    console.error('Error resetting modified dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetData();
