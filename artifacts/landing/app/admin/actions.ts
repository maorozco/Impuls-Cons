'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_session';

export async function adminLogin(password: string): Promise<{ ok: boolean }> {
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'biocycle2026';

  if (password !== adminPassword) {
    return { ok: false };
  }

  const token = Buffer.from(password).toString('base64');

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/admin');
}
