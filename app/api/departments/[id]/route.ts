import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserFromHeaders(request);
    const body = await request.json();
    const { name, code, remarks } = body;

    // Get user name from database
    let userName = 'Unknown';
    if (user) {
      const userRecord = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { name: true }
      });
      userName = userRecord?.name || user.email;
    }

    const department = await prisma.department.update({
      where: { id },
      data: {
        name,
        code,
        remarks,
        modifiedBy: userName,
        modified: new Date(),
      },
    });

    return NextResponse.json(department);
  } catch (error: any) {
    console.error('Error updating department:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Department name or code already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update department' },
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
    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting department:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}
