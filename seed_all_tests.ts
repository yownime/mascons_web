import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
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

  // 2. Create a test session
  let [session] = await db.insert(testSessions).values({
    title: "Sesi Uji Coba Laporan PDF",
    accessCode: "TESTPDF",
    isActive: true,
  }).onConflictDoNothing().returning();

  if (!session) {
    const existingSession = await db.select().from(testSessions).where(eq(testSessions.accessCode, "TESTPDF")).limit(1);
    session = existingSession[0];
  }
  console.log('✅ Found/Created test session.');

  const dummyNames = [
    "Ahmad Farizqi Ridwan", "Budi Santoso", "Citra Lestari", "Dewi Maharani", 
    "Eko Prasetyo", "Fajar Nugraha", "Gita Savitri", "Hadi Suwarno", 
    "Indah Permatasari", "Joko Susilo"
  ];

  for (let i = 0; i < 10; i++) {
    const mockUserId = `11111111-2222-3333-4444-55555555550${i}`;
    const userName = dummyNames[i];
    
    await db.insert(users).values({
      id: mockUserId,
      fullName: userName,
      email: `simulasi${i}.mobile@example.com`,
      role: "user"
    }).onConflictDoNothing();

    const [participant] = await db.insert(testParticipants).values({
      sessionId: session.id,
      userId: mockUserId,
      status: "completed",
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      finishedAt: new Date(),
    }).returning();

    // Randomize EPPS scores slightly
    const randomEppsData = {
      ...mockEPPS,
      normaResults: {
        ACH: Math.floor(Math.random() * 15) + 5,
        DEF: Math.floor(Math.random() * 15) + 5,
        ORD: Math.floor(Math.random() * 15) + 5,
        EXH: Math.floor(Math.random() * 15) + 5,
        AUT: Math.floor(Math.random() * 15) + 5,
        AFF: Math.floor(Math.random() * 15) + 5,
        INT: Math.floor(Math.random() * 15) + 5,
        SUC: Math.floor(Math.random() * 15) + 5,
        DOM: Math.floor(Math.random() * 15) + 5,
        ABA: Math.floor(Math.random() * 15) + 5,
        NUR: Math.floor(Math.random() * 15) + 5,
        CHG: Math.floor(Math.random() * 15) + 5,
        END: Math.floor(Math.random() * 15) + 5,
        HET: Math.floor(Math.random() * 15) + 5,
        AGG: Math.floor(Math.random() * 15) + 5,
      },
      consistencyCheck: { consistentPairs: Math.floor(Math.random() * 5) + 10, totalPairs: 15 }
    };

    await db.insert(testResults).values({
      participantId: participant.id,
      category: 'epps',
      reportData: randomEppsData,
      scoreSummary: `Konsisten: ${randomEppsData.consistencyCheck.consistentPairs}/15`
    });
    
    console.log(`✅ Generated dummy user: ${userName}`);
  }

  console.log('🎉 10 simulated EPPS tests inserted successfully!');
}

main().catch(console.error);
