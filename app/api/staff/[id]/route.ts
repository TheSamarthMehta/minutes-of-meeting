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
    const { 
      staffName, 
      employeeId,
      designation,
      emailAddress, 
      mobileNo, 
      dateOfBirth,
      gender,
      nationality,
      motherTongue,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactNumber,
      dateOfJoining,
      departmentId, 
      remarks 
    } = body;

    const userName = await getUserDisplayName(request);

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        staffName,
        employeeId: employeeId || undefined,
        designation: designation || undefined,
        emailAddress,
        mobileNo: mobileNo || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender: gender || undefined,
        nationality: nationality || undefined,
        motherTongue: motherTongue || undefined,
        bloodGroup: bloodGroup || undefined,
        address: address || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactNumber: emergencyContactNumber || undefined,
        dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
        departmentId: departmentId || undefined,
        remarks: remarks || undefined,
        modifiedBy: userName,
        modified: new Date(),
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.staff.delete({
      where: { id },
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
