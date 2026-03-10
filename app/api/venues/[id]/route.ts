import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserDisplayName } from '@/lib/utils/apiHelpers';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, capacity, remarks } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Venue name is required' },
        { status: 400 }
      );
    }

    const userName = await getUserDisplayName(request);

    const venue = await prisma.venue.update({
      where: { id },
      data: {
        name,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        remarks,
        modifiedBy: userName,
        modified: new Date(),
      },
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    console.error('Error updating venue:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Venue name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update venue' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if venue is being used in any meetings
    const venueWithMeetings = await prisma.venue.findUnique({
      where: { id },
      include: { _count: { select: { meetings: true } } },
    });

    if (!venueWithMeetings) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }

    if (venueWithMeetings._count.meetings > 0) {
      return NextResponse.json(
        { error: `Cannot delete venue. It is being used in ${venueWithMeetings._count.meetings} meeting(s)` },
        { status: 400 }
      );
    }

    await prisma.venue.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Venue deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting venue:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete venue' },
      { status: 500 }
    );
  }
}
