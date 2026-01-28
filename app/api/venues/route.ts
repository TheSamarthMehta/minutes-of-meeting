import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        _count: {
          select: { meetings: true },
        },
      },
      orderBy: { created: 'desc' },
    });
    return NextResponse.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, capacity, remarks } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Venue name is required' },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        remarks,
      },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error: any) {
    console.error('Error creating venue:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Venue name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create venue' },
      { status: 500 }
    );
  }
}
