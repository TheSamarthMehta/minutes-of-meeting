import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { meetingTypeName, remarks } = body;

    const meetingType = await prisma.meetingType.update({
      where: { id: params.id },
      data: {
        meetingTypeName,
        remarks,
      },
    });

    return NextResponse.json(meetingType);
  } catch (error: any) {
    console.error('Error updating meeting type:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Meeting type not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Meeting type name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update meeting type' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.meetingType.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Meeting type deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting meeting type:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Meeting type not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete meeting type' },
      { status: 500 }
    );
  }
}
