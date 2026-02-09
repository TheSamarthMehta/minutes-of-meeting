import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { staff: true, meetings: true },
        },
      },
      orderBy: { created: 'desc' },
    });
    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromHeaders(request);
    const body = await request.json();
    const { name, code, remarks } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    // Get user name from database
    let userName = 'Unknown';
    if (user) {
      const userRecord = await prisma.user.findUnique({
        where: { id: user.userId },
        select: { name: true }
      });
      userName = userRecord?.name || user.email;
    }

    const department = await prisma.department.create({
      data: {
        name,
        code,
        remarks,
        createdBy: userName,
        // Don't set modifiedBy on creation - it should only be set when actually modified
      },
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error: any) {
    console.error('Error creating department:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Department name or code already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
