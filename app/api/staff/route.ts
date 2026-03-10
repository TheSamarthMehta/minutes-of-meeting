import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserDisplayName } from '@/lib/utils/apiHelpers';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        department: true,
      },
      orderBy: { created: 'desc' },
    });
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    if (!staffName || !emailAddress) {
      return NextResponse.json(
        { error: 'Staff name and email are required' },
        { status: 400 }
      );
    }

    const userName = await getUserDisplayName(request);

    const staff = await prisma.staff.create({
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
        createdBy: userName,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email address already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}
