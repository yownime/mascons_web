import { createClient } from '@supabase/supabase-js';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const dbUrl = process.env.DATABASE_URL;

const supabase = createClient(supabaseUrl, supabaseKey);
const sql = neon(dbUrl);

async function main() {
  const email = 'yownime@gmail.com';
  const password = 'AdminPassword123!';
  const fullName = 'Yownime Admin';

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error logging in:', error);
    process.exit(1);
  }

  const userId = data.user.id;
  await sql.query("INSERT INTO users (id, email, full_name, role) VALUES (, , , 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = ", [userId, email, fullName]);
  console.log('Admin account linked to database successfully!');
}
main();
