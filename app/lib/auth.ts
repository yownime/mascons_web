import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function validateSupabaseToken(token: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables');
    return { userId: null, email: null, fullName: null, isValid: false };
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // getUser uses the provided JWT to fetch the user from Supabase Auth server directly.
    // This perfectly validates the token without needing to deal with JWT secrets or the 'jose' library.
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.error('Supabase Auth Error:', error?.message);
      return {
        userId: null,
        email: null,
        fullName: null,
        isValid: false,
      };
    }

    return {
      userId: user.id,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || 'User',
      isValid: true,
    };
  } catch (error) {
    console.error('Token Validation Exception:', error);
    return {
      userId: null,
      email: null,
      fullName: null,
      isValid: false,
    };
  }
}

export function extractTokenFromHeader(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
