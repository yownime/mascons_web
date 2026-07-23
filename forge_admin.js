const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

function createServiceRoleJWT(secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ role: 'service_role', iss: 'supabase', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url');
  
  const signature = crypto.createHmac('sha256', secret)
                          .update(header + '.' + payload)
                          .digest('base64url');
                          
  return header + '.' + payload + '.' + signature;
}

async function main() {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) throw new Error("No JWT secret");
  
  const token = createServiceRoleJWT(secret);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: 'Bearer ' + token } },
    auth: { autoRefreshToken: false, persistSession: false }
  });
  
  const email = 'admin@mascons.com';
  const password = 'AdminPassword123!';
  const fullName = 'Yownime Admin';

  let { data: { user }, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName }
  });

  if (error) {
    if (error.code === 'email_exists' || error.message.includes('already been registered')) {
        console.log('User exists, fetching...');
        const { data: usersData } = await supabase.auth.admin.listUsers();
        user = usersData.users.find(u => u.email === email);
        if(user) {
           await supabase.auth.admin.updateUserById(user.id, { email_confirm: true, password });
        }
    } else {
        console.error('Supabase Error:', error);
        process.exit(1);
    }
  }

  if (!user) {
    console.error('Failed to get or create user');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  await sql`INSERT INTO users (id, email, full_name, role) VALUES (${user.id}, ${email}, ${fullName}, 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = ${fullName}`;
  
  console.log('SUCCESS! Admin account created/updated.');
  console.log('Email: ' + email);
  console.log('Password: ' + password);
}

main().catch(console.error);
