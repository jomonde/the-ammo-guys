import { createServerComponentClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingWizard } from './components/onboarding-wizard';

export default async function OnboardingPage() {
  const supabase = createServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login if not authenticated
    redirect('/login?redirectTo=/onboarding');
  }

  // Check if user has already completed onboarding
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', session.user.id)
    .single();

  if (profile?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to The Ammo Guys</h1>
          <p className="mt-2 text-lg text-gray-600">Let's set up your ammo stockpile in a few easy steps</p>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <OnboardingWizard userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
