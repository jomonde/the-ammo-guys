import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const supabase = createRouteHandlerClient();
    
    // Get the session using the auth helpers
    const { 
      data: { session }, 
      error: sessionError 
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      userId,
      calibers,
      monthlyBudget,
      accessories,
      shippingAddress
    } = requestBody;

    // Validate required fields
    if (!userId || !calibers || monthlyBudget === undefined || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the authenticated user matches the userId
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Start a transaction
    const { data, error } = await supabase.rpc('complete_onboarding', {
      p_user_id: userId,
      p_calibers: calibers,
      p_monthly_budget: monthlyBudget,
      p_accessories: accessories || [],
      p_shipping_address: shippingAddress
    });

    if (error) {
      console.error('Database error during onboarding:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true,
      data 
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { 
        error: 'Failed to complete onboarding',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
