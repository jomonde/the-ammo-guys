import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient();
    // Get the session using the auth helpers
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      userId,
      calibers,
      monthlyBudget,
      accessories,
      shippingAddress
    } = await request.json();

    // Verify the authenticated user matches the userId
    if (session.user.id !== userId) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Start a transaction
    const { data, error } = await supabase.rpc('complete_onboarding', {
      p_user_id: userId,
      p_calibers: calibers,
      p_monthly_budget: monthlyBudget,
      p_accessories: accessories,
      p_shipping_address: shippingAddress
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
