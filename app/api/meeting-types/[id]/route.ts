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
    const { meetingTypeName, remarks } = body;

    const userName = await getUserDisplayName(request);

    const meetingType = await prisma.meetingType.update({
      where: { id },
      data: {
        meetingTypeName,
        remarks,
        modifiedBy: userName,
        modified: new Date(),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.meetingType.delete({
      where: { id },
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
