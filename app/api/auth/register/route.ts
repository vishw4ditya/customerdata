import { NextResponse } from 'next/server';
import { adminsDb } from '@/lib/db';
import { validateIndianPhone, generateAdminID } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { name, phone, password } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    if (!validateIndianPhone(phone)) {
      return NextResponse.json({ error: 'Invalid Indian phone number' }, { status: 400 });
    }

    const existingAdmin = await adminsDb.findOne({ phone });
    if (existingAdmin) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }

    const adminCount = await adminsDb.countDocuments({});
    const role = adminCount === 0 ? 'superadmin' : 'admin';

    const adminID = generateAdminID();
    const newAdmin = await adminsDb.create({
      name,
      phone,
      password, // In a real app, hash this!
      adminID,
      role,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      message: `${role === 'superadmin' ? 'Superadmin' : 'Admin'} registered successfully`, 
      adminID: newAdmin.adminID,
      role: newAdmin.role
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

