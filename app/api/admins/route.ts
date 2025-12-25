import { NextResponse } from 'next/server';
import { adminsDb, customersDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admins = await adminsDb.find({ role: { $ne: 'superadmin' } }).sort({ createdAt: -1 }) as any[];
    
    // Enrich each admin with their customer count
    const enrichedAdmins = await Promise.all(admins.map(async (admin) => {
      const customerCount = await customersDb.count({ addedBy: admin.adminID });
      return {
        ...admin,
        customerCount
      };
    }));

    return NextResponse.json(enrichedAdmins);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

