'use server';

import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase Auth Error:', error.message);
      return { error: error.message };
    }

    console.log('✅ Admin login successful:', data.user?.email);
    revalidatePath('/', 'layout');
  } catch (err: any) {
    console.error('🔥 Critical Login Error:', err);
    return { error: err.message || 'An unexpected error occurred during login.' };
  }

  // Redirect must be outside the try-catch block
  redirect('/admin');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
