import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// List all registries
export async function GET() {
  try {
    const registries = await db.whoisRegistry.findMany({
      orderBy: { tld: 'asc' },
    });

    return NextResponse.json({
      code: 2000,
      data: registries,
    });
  } catch (error) {
    console.error('Failed to fetch WHOIS registries:', error);
    return NextResponse.json({
      code: 5001,
      message: 'Failed to fetch WHOIS registries',
    });
  }
}

// Create new registry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tld, whoisServer, rdapServer } = body;

    const registry = await db.whoisRegistry.create({
      data: {
        tld,
        whoisServer,
        rdapServer,
      },
    });

    return NextResponse.json({
      code: 2000,
      data: registry,
    });
  } catch (error) {
    console.error('Failed to create WHOIS registry:', error);
    return NextResponse.json({
      code: 5001,
      message: 'Failed to create WHOIS registry',
    });
  }
}

// Update registry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tld, whoisServer, rdapServer } = body;

    const registry = await db.whoisRegistry.update({
      where: { id },
      data: {
        tld,
        whoisServer,
        rdapServer,
      },
    });

    return NextResponse.json({
      code: 2000,
      data: registry,
    });
  } catch (error) {
    console.error('Failed to update WHOIS registry:', error);
    return NextResponse.json({
      code: 5001,
      message: 'Failed to update WHOIS registry',
    });
  }
}

// Delete registry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        code: 4001,
        message: 'Registry ID is required',
      });
    }

    await db.whoisRegistry.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      code: 2000,
    });
  } catch (error) {
    console.error('Failed to delete WHOIS registry:', error);
    return NextResponse.json({
      code: 5001,
      message: 'Failed to delete WHOIS registry',
    });
  }
}
