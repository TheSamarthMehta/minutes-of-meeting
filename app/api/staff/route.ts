import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    const { staffName, mobileNo, emailAddress, departmentId, remarks } = body;

    if (!staffName || !emailAddress) {
      return NextResponse.json(
        { error: 'Staff name and email are required' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.create({
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
