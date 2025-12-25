import { NextResponse } from 'next/server';
import { customersDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminID = searchParams.get('adminID');
    const role = searchParams.get('role');

    let query = {};
    if (role !== 'superadmin' && adminID) {
      query = { addedBy: adminID };
    }

    const customers = await customersDb.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, phone, address, addedBy, followUpDate } = await request.json();

    if (!name || !phone || !address || !addedBy) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Check for duplicate (name and phone)
    const existingCustomer = await customersDb.findOne({ name, phone }) as any;

    if (existingCustomer) {
      const updated = await customersDb.findOneAndUpdate(
        { _id: existingCustomer._id },
        { $set: { 
            count: (existingCustomer.count || 1) + 1, 
            address, 
            followUpDate: followUpDate || existingCustomer.followUpDate,
            updatedAt: new Date(),
            lastUpdatedBy: addedBy // Track who updated it last
          } 
        },
        { new: true }
      );
      return NextResponse.json({ message: 'Customer updated', customer: updated });
    } else {
      const newCustomer = await customersDb.create({
        name,
        phone,
        address,
        addedBy, // Track who added it
        count: 1,
        followUpDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return NextResponse.json({ message: 'Customer added', customer: newCustomer });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name, phone, address, action, followUpDate } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    const customer = await customersDb.findOne({ _id: id }) as any;
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (action === 'decrement') {
      if (customer.count > 1) {
        await customersDb.updateOne({ _id: id }, { $set: { count: customer.count - 1, updatedAt: new Date() } });
        return NextResponse.json({ message: 'Visit removed' });
      } else {
        // If count is 1, maybe keep it at 1 or handle as delete? 
        // User asked for "removal of single visit", so if it's 1, we stay at 1 or inform they should delete.
        return NextResponse.json({ error: 'Cannot remove the last visit. Delete the customer instead.' }, { status: 400 });
      }
    }

    // Default: Edit details
    await customersDb.updateOne(
      { _id: id }, 
      { $set: { 
          name: name || customer.name, 
          phone: phone || customer.phone, 
          address: address || customer.address,
          followUpDate: followUpDate || customer.followUpDate,
          updatedAt: new Date() 
        } 
      }
    );
    return NextResponse.json({ message: 'Customer updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await customersDb.deleteOne({ _id: id });
    return NextResponse.json({ message: 'Customer removed' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

