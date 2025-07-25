import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient();
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { items, shippingAddress, notes } = await request.json();
    
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required for shipment' },
        { status: 400 }
      );
    }

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.street1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.postalCode || !shippingAddress.country) {
      return NextResponse.json(
        { error: 'Valid shipping address is required' },
        { status: 400 }
      );
    }

    // Start a transaction
    const { data: shipment, error: shipmentError } = await supabase.rpc('create_shipment_transaction', {
      p_user_id: session.user.id,
      p_shipping_address: shippingAddress,
      p_notes: notes || '',
      p_items: items.map((item: any) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price_per_unit: item.pricePerUnit
      }))
    });

    if (shipmentError) {
      console.error('Error creating shipment:', shipmentError);
      throw shipmentError;
    }

    // If we reach here, the transaction was successful
    return NextResponse.json({
      success: true,
      data: {
        shipmentId: shipment?.id,
        trackingNumber: shipment?.tracking_number,
        status: shipment?.status,
        estimatedDelivery: shipment?.estimated_delivery
      }
    });

  } catch (error) {
    console.error('Error triggering shipment:', error);
    return NextResponse.json(
      { 
        error: 'Failed to trigger shipment',
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
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
