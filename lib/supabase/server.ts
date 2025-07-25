import { createServerComponentClient as createServerClient } from '@supabase/auth-helpers-nextjs';
import { createRouteHandlerClient as createSupabaseRouteHandler } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

// For Server Components
export function createServerComponentClient() {
  const cookieStore = cookies();
  
  return createServerClient<Database>({
    cookies: () => cookieStore
  });
}

// For Route Handlers (API routes)
export function createRouteHandlerClient() {
  const cookieStore = cookies();
  
  return createSupabaseRouteHandler<Database>({
    cookies: () => cookieStore
  });
}

// For backward compatibility
export const supabaseServer = createServerComponentClient();
export const createClient = createServerComponentClient;
