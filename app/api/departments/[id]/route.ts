import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, code, remarks } = body;

    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        name,
        code,
        remarks,
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.department.delete({
      where: { id: params.id },
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
