import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  try {
    // Get the request body
    const requestBody = await request.json();
    const {
      userId,
      calibers,
      monthlyBudget,
      accessories = [],
      shippingAddress
    } = requestBody;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase URL or Service Role Key');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Verify the JWT from the Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }



    // Validate required fields
    if (!userId || !calibers || monthlyBudget === undefined || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify the authenticated user matches the userId
    if (user.id !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call the stored procedure to complete onboarding
    const { data, error } = await supabase.rpc('complete_onboarding', {
      p_user_id: userId,
      p_calibers: calibers,
      p_monthly_budget: monthlyBudget,
      p_accessories: accessories,
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

// Handle OPTIONS for CORS preflight
// This is required for CORS to work with API routes
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
