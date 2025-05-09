import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('Login attempt started');
    await connectDB();
    console.log('Database connected');

    const { email, password } = await req.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('User found, comparing password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    console.log('Password matched, creating response');

    // Create response with user data
    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    // Set token cookie
    response.cookies.set('token', user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    console.log('Token cookie set, sending response');

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || JSON.stringify(error) || 'Internal server error' },
      { status: 500 }
    );
  }
} 