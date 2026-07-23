'use server';

import { createClient } from '@/app/lib/supabase';
import { db } from '@/app/lib/db';
import { users } from '@/db/schema';
import { redirect } from 'next/navigation';

export async function registerAdmin(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const secretCode = formData.get('secretCode') as string;

  // 1. Verify Secret Code
  if (secretCode !== process.env.ADMIN_SETUP_SECRET) {
    return { error: 'Invalid Setup Secret Code. You are not authorized to register as an admin.' };
  }

  const supabase = await createClient();

  try {
    // 2. Sign up user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      console.error('❌ Supabase SignUp Error:', error.message);
      return { error: error.message };
    }

    if (!data.user) {
      return { error: 'Failed to create user account.' };
    }

    // 3. Insert or Update User in Neon Database with 'admin' role
    await db.insert(users).values({
      id: data.user.id,
      email: data.user.email!,
      fullName: fullName,
      role: 'admin',
    }).onConflictDoUpdate({
      target: users.id,
      set: { role: 'admin', fullName: fullName }
    });

    console.log('✅ Admin registered and saved to database successfully.');

  } catch (err: any) {
    console.error('🔥 Critical Registration Error:', err);
    return { error: err.message || 'An unexpected error occurred during registration.' };
  }

  // Redirect to admin dashboard (Supabase signUp usually logs the user in automatically)
  redirect('/admin');
}
