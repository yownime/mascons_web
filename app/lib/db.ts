import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema';

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is missing in .env.local');
  throw new Error('DATABASE_URL is not defined');
}

console.log('🔌 Attempting to connect to Neon Database...');
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
console.log('✅ Drizzle instance initialized');
