import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    const actionItems = await prisma.actionItem.findMany({
      where: whereClause,
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ actionItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching action items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch action items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, status, dueDate, meetingId } = body;

    if (!task || !meetingId) {
      return NextResponse.json(
        { error: 'Missing required fields: task, meetingId' },
        { status: 400 }
      );
    }

    const actionItem = await prisma.actionItem.create({
      data: {
        task,
        status: status || 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null,
        meetingId,
      },
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json({ actionItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating action item:', error);
    return NextResponse.json(
      { error: 'Failed to create action item' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const actionItem = await prisma.actionItem.update({
      where: { id },
      data: { 
        status: status || 'COMPLETED' 
      },
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json({ actionItem }, { status: 200 });
  } catch (error) {
    console.error('Error updating action item:', error);
    return NextResponse.json(
      { error: 'Failed to update action item' },
      { status: 500 }
    );
  }
}
