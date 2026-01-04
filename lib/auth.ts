import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
// @ts-ignore
import db from '@/models';
import { Op } from 'sequelize';

const { Admin, AdminSession } = db;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createSession(adminId: number): Promise<string> {
  console.log('Generating session token for admin:', adminId);
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  try {
    const session = await AdminSession.create({
      admin_id: adminId,
      session_token: sessionToken,
      expires_at: expiresAt,
    });
    console.log('Session created in DB with ID:', session.id);
  } catch (err) {
    console.error('Failed to create session in DB:', err);
    throw err;
  }

  return sessionToken;
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) {
    console.log('No session token found in cookies');
    return null;
  }

  const session = await AdminSession.findOne({
    where: {
      session_token: sessionToken,
      expires_at: { [Op.gt]: new Date() },
    },
    include: [{
      model: Admin,
      as: 'Admin',
      attributes: ['id', 'email', 'name'],
    }],
  });

  console.log('Session lookup result:', session ? 'Found' : 'Not Found');
  if (session) {
    console.log('Admin in session:', session.Admin ? 'Present' : 'Missing');
  }

  if (!session || !session.Admin) return null;

  return {
    adminId: session.Admin.id,
    email: session.Admin.email,
    name: session.Admin.name,
  };
}

export async function deleteSession(sessionToken: string) {
  await AdminSession.destroy({
    where: { session_token: sessionToken },
  });
}
