import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (status) {
      whereClause.status = status;
    }

    const meetings = await prisma.meeting.findMany({
      where: whereClause,
      include: {
        meetingType: true,
        venue: true,
        department: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            staff: true,
          },
        },
        actionItems: true,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      date,
      time,
      status,
      agenda,
      description,
      content,
      meetingTypeId,
      departmentId,
      venueId,
      userId,
    } = body;

    // Validate required fields
    if (!title || !date || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, userId' },
        { status: 400 }
      );
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        date: new Date(date),
        time,
        status: status || 'UPCOMING',
        agenda,
        description,
        content,
        meetingTypeId,
        departmentId,
        venueId,
        userId,
      },
      include: {
        meetingType: true,
        venue: true,
        department: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}
