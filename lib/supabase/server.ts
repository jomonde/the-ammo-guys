import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

type CookieOptions = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
};

// For Server Components
export function createServerComponentClient() {
  const cookieStore = cookies();
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Omit<CookieOptions, 'name' | 'value'>) {
          try {
            cookieStore.set({ name, value, ...options } as any);
          } catch (error) {
            console.error('Error setting cookie:', error);
          }
        },
        remove(name: string, options: Omit<CookieOptions, 'name' | 'value'>) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0 
            } as any);
          } catch (error) {
            console.error('Error removing cookie:', error);
          }
        },
      },
    }
  ) as any;
}

// For Route Handlers (API routes)
export function createRouteHandlerClient() {
  const cookieStore = cookies();
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options } as any);
            return Promise.resolve();
          } catch (error) {
            console.error('Error setting cookie in route handler:', error);
            return Promise.reject(error);
          }
        },
        remove(name: string, options: Omit<CookieOptions, 'name' | 'value'>) {
          try {
            cookieStore.set({ 
              name, 
              value: '', 
              ...options, 
              maxAge: 0 
            } as any);
            return Promise.resolve();
          } catch (error) {
            console.error('Error removing cookie in route handler:', error);
            return Promise.reject(error);
          }
        },
      },
    }
  ) as any;
}

// Alias for API routes for clarity
// Note: Using the dedicated createRouteHandlerClient function above

// For backward compatibility
export const supabaseServer = createServerComponentClient();
// Export the function directly to avoid naming conflicts
export { createServerComponentClient as createClient };
