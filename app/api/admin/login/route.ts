import { type NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import { cookies } from 'next/headers';
// @ts-ignore
import db from '@/models';

const { Admin } = db;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Login attempt for:', email);
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      console.log('Admin not found:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Admin found, verifying password...');
    const isValid = await verifyPassword(password, admin.password_hash);

    if (!isValid) {
      console.log('Password invalid for:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('Password valid, creating session for admin ID:', admin.id);
    const sessionToken = await createSession(admin.id);
    const cookieStore = await cookies();

    console.log('Setting session cookie...');
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: false, // Changed to false for local debugging
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    console.log('Login successful');
    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error detail:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
