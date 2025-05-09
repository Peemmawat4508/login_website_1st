import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/portfolio
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get user ID from session (you'll need to implement session handling)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.portfolio || {});
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/portfolio
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get user ID from session (you'll need to implement session handling)
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const portfolioData = await req.json();

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { portfolio: portfolioData } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.portfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 