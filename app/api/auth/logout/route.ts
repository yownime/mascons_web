import { createClient } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  return NextResponse.redirect(new URL('/login', request.url), 303);
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  return NextResponse.redirect(new URL('/login', request.url), 303);
}
