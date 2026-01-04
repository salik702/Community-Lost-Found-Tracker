import { type NextRequest, NextResponse } from 'next/server';
import { hashPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';
// @ts-ignore
import db from '@/models';

const { Admin } = db;

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existing = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create admin
    const passwordHash = await hashPassword(password);

    const admin = await Admin.create({
      email: email,
      password_hash: passwordHash,
      name: name || null,
    });

    // Create session
    const sessionToken = await createSession(admin.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
