import { NextResponse } from 'next/server';
import { adminsDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    // Check for hardcoded Superadmin credentials
    if (phone === 'abcsuperadmin123' && password === 'abc@superadmin@abc@123') {
      return NextResponse.json({ 
        message: 'Superadmin Login successful',
        admin: { 
          name: 'Global Superadmin', 
          phone: 'abcsuperadmin123', 
          adminID: 'SUP-GLOBAL-001', 
          role: 'superadmin' 
        }
      });
    }

    const admin = await adminsDb.findOne({ phone, password }).lean() as any;
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // In a real app, set a session cookie or JWT
    return NextResponse.json({ 
      message: 'Login successful',
      admin: { name: admin.name, phone: admin.phone, adminID: admin.adminID, role: admin.role || 'admin' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

