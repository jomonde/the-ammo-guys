import { createServerComponentClient as createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

export function createServerComponentClient() {
  const cookieStore = cookies();
  
  return createServerClient<Database>({
    cookies: () => cookieStore
  });
}

export const supabaseServer = createServerComponentClient();
