import './globals.css';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@/lib/supabase/server';
import AuthProvider from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Ammo Guys | Veteran-Owned Ammunition',
  description: 'Premium ammunition from a veteran-owned business. Quality, reliability, and service you can trust.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
