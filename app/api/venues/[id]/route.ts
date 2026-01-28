import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, location, capacity, remarks } = body;

    const venue = await prisma.venue.update({
      where: { id: params.id },
      data: {
        name,
        location,
        capacity: capacity ? parseInt(capacity) : null,
        remarks,
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.venue.delete({
      where: { id: params.id },
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
