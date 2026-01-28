import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { staffName, mobileNo, emailAddress, departmentId, remarks } = body;

    const staff = await prisma.staff.update({
      where: { id: params.id },
      data: {
        staffName,
        mobileNo,
        emailAddress,
        departmentId,
        remarks,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    console.error('Error updating staff:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email address already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update staff' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.staff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Staff deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting staff:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete staff' },
      { status: 500 }
    );
  }
}
