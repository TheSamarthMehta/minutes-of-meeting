import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const meeting = await prisma.meeting.findUnique({
      where: { id },
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
        documents: true,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ meeting }, { status: 200 });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      isCancelled,
      cancellationDate,
      cancellationTime,
      cancellationReason,
    } = body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (status !== undefined) updateData.status = status;
    if (agenda !== undefined) updateData.agenda = agenda;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (meetingTypeId !== undefined) updateData.meetingTypeId = meetingTypeId;
    if (departmentId !== undefined) updateData.departmentId = departmentId;
    if (venueId !== undefined) updateData.venueId = venueId;
    if (isCancelled !== undefined) updateData.isCancelled = isCancelled;
    if (cancellationDate !== undefined) updateData.cancellationDate = new Date(cancellationDate);
    if (cancellationTime !== undefined) updateData.cancellationTime = cancellationTime;
    if (cancellationReason !== undefined) updateData.cancellationReason = cancellationReason;

    const meeting = await prisma.meeting.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ meeting }, { status: 200 });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.meeting.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Meeting deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}
