import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const meetingTypes = await prisma.meetingType.findMany({
      orderBy: { created: 'desc' },
    });
    return NextResponse.json(meetingTypes);
  } catch (error) {
    console.error('Error fetching meeting types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting types' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meetingTypeName, remarks } = body;

    if (!meetingTypeName) {
      return NextResponse.json(
        { error: 'Meeting type name is required' },
        { status: 400 }
      );
    }

    const meetingType = await prisma.meetingType.create({
      data: {
        meetingTypeName,
        remarks,
      },
    });

    return NextResponse.json(meetingType, { status: 201 });
  } catch (error: any) {
    console.error('Error creating meeting type:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Meeting type name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create meeting type' },
      { status: 500 }
    );
  }
}
