import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get counts for different meeting statuses
    const [upcoming, completed, cancelled, totalActionItems] = await Promise.all([
      prisma.meeting.count({
        where: { status: 'UPCOMING', isCancelled: false },
      }),
      prisma.meeting.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.meeting.count({
        where: { 
          OR: [
            { status: 'CANCELLED' },
            { isCancelled: true }
          ]
        },
      }),
      prisma.actionItem.count({
        where: { 
          status: { 
            in: ['PENDING', 'IN_PROGRESS'] 
          } 
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        upcoming,
        completed,
        cancelled,
        pendingActions: totalActionItems,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
