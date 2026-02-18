import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, task, dueDate } = body;

    const updateData: any = {};
    
    if (status !== undefined) updateData.status = status;
    if (task !== undefined) updateData.task = task;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const actionItem = await prisma.actionItem.update({
      where: { id },
      data: updateData,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.actionItem.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Action item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting action item:', error);
    return NextResponse.json(
      { error: 'Failed to delete action item' },
      { status: 500 }
    );
  }
}
