import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'Database connection successful' });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error.message },
      { status: 500 }
    );
  }
} 