import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

type TriggerType = 'budget' | 'quantity' | 'manual';

interface TriggerRequest {
  triggerType: TriggerType;
  thresholdValue: number;
  isActive: boolean;
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's shipment triggers
    const { data: triggers, error } = await supabase
      .from('shipment_triggers')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: triggers || []
    });

  } catch (error) {
    console.error('Error fetching shipment triggers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shipment triggers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { triggerType, thresholdValue, isActive = true }: TriggerRequest = await request.json();
    
    // Validate trigger type
    if (!['budget', 'quantity', 'manual'].includes(triggerType)) {
      return NextResponse.json(
        { error: 'Invalid trigger type. Must be one of: budget, quantity, manual' },
        { status: 400 }
      );
    }

    // For manual triggers, threshold should be 0
    const finalThreshold = triggerType === 'manual' ? 0 : Math.max(0, thresholdValue || 0);

    // Check if trigger already exists
    const { data: existingTrigger } = await supabase
      .from('shipment_triggers')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('trigger_type', triggerType)
      .maybeSingle();

    let result;
    
    if (existingTrigger) {
      // Update existing trigger
      const { data, error } = await supabase
        .from('shipment_triggers')
        .update({
          threshold_value: finalThreshold,
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTrigger.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new trigger
      const { data, error } = await supabase
        .from('shipment_triggers')
        .insert([{
          user_id: session.user.id,
          trigger_type: triggerType,
          threshold_value: finalThreshold,
          is_active: isActive,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error managing shipment trigger:', error);
    return NextResponse.json(
      { 
        error: 'Failed to manage shipment trigger',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// Handle DELETE request to remove a trigger
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const triggerId = searchParams.get('id');
    
    if (!triggerId) {
      return NextResponse.json(
        { error: 'Trigger ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the trigger belongs to the user
    const { data: trigger, error: fetchError } = await supabase
      .from('shipment_triggers')
      .select('id')
      .eq('id', triggerId)
      .eq('user_id', session.user.id)
      .single();

    if (fetchError || !trigger) {
      return NextResponse.json(
        { error: 'Trigger not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the trigger
    const { error: deleteError } = await supabase
      .from('shipment_triggers')
      .delete()
      .eq('id', triggerId);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Trigger deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting shipment trigger:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete shipment trigger',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// Add CORS headers for API routes
export function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
