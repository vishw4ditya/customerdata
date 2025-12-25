import { NextResponse } from 'next/server';
import { adminsDb } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { adminID, newPassword } = await request.json();

    if (!adminID || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const admin = await adminsDb.findOne({ adminID });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid Admin ID' }, { status: 404 });
    }

    await adminsDb.update({ adminID }, { $set: { password: newPassword } });

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

