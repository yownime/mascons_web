'use server';

import { db } from '@/app/lib/db';
import { testSessions } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function createSession(formData: FormData) {
  const title = formData.get('title') as string;
  const accessCode = (formData.get('accessCode') as string) || 
    Math.random().toString(36).substring(2, 8).toUpperCase();
  const testType = (formData.get('testType') as string) || 'cfit';

  await db.insert(testSessions).values({
    title,
    accessCode,
    testType,
    isActive: true,
  });

  revalidatePath('/admin/sessions');
}

export async function toggleSessionStatus(id: number, currentStatus: boolean) {
  await db.update(testSessions)
    .set({ isActive: !currentStatus })
    .where(eq(testSessions.id, id));
  
  revalidatePath('/admin/sessions');
}
