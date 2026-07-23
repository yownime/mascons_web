import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';
import { users, testSessions, testParticipants, testResults } from './db/schema';
import { 
  mockCFIT, mockKraepelin, mockMinatJabatan, mockInteligensiUmum, mockCPM, mockEPPS, mockBakum 
} from './app/lib/reports/mockData';

dotenv.config({ path: '.env.local' });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL not found');

const sql = neon(dbUrl);
const db = drizzle(sql);

async function main() {
  console.log('Starting automated testing simulation...');

  // 1. Create a simulated mobile user
  const mockUserId = '11111111-2222-3333-4444-555555555555';
  await db.insert(users).values({
    id: mockUserId,
    fullName: "Simulasi Mobile User",
    email: "simulasi.mobile@example.com",
    role: "user"
  }).onConflictDoNothing();
  console.log('? Created mock user.');

  // 2. Create a test session
  const [session] = await db.insert(testSessions).values({
    title: "Sesi Uji Coba Laporan PDF",
    accessCode: "TESTPDF",
    isActive: true,
  }).returning();
  console.log('? Created test session.');

  // Define test cases with their mock data
  const testCases = [
    { category: 'cfit', data: mockCFIT, summary: 'IQ: 115 (Di atas Rata-rata)' },
    { category: 'kraepelin', data: mockKraepelin, summary: 'Total: 200, Puncak: 29, Dasar: 20' },
    { category: 'minat_jabatan', data: mockMinatJabatan, summary: 'Tertinggi: E (90), Terendah: K (20)' },
    { category: 'inteligensi_umum', data: mockInteligensiUmum, summary: 'Benar: 82/100 (82.0%)' },
    { category: 'cpm', data: mockCPM, summary: 'Benar: 28/36 (77%)' },
    { category: 'epps', data: mockEPPS, summary: 'Konsisten: 12/15, DOM: 19, ABA: 7' },
    { category: 'bakum', data: mockBakum, summary: 'Skor Total: 285.5' },
  ];

  for (const test of testCases) {
    // 3. Create a participant for each test
    const [participant] = await db.insert(testParticipants).values({
      sessionId: session.id,
      userId: mockUserId,
      status: "completed",
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      finishedAt: new Date(),
    }).returning();

    // 4. Create the test result
    await db.insert(testResults).values({
      participantId: participant.id,
      category: test.category,
      reportData: test.data,
      scoreSummary: test.summary
    });
    console.log(`? Generated test result for: ${test.category.toUpperCase()}`);
  }

  console.log('?? All simulated tests inserted successfully!');
}

main().catch(console.error);
