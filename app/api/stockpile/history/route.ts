import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const productId = searchParams.get('productId');
    const changeType = searchParams.get('changeType') as 'allocation' | 'shipment' | 'adjustment' | null;
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Build the query
    let query = supabase
      .from('stockpile_history')
      .select(`
        id,
        product_id,
        quantity_change,
        change_type,
        reference_id,
        notes,
        created_at,
        products (
          id,
          name,
          caliber,
          image_url
        )
      `, { count: 'exact' })
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add filters if provided
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    if (changeType) {
      query = query.eq('change_type', changeType);
    }

    // Execute the query
    const { data: history, count, error } = await query;

    if (error) throw error;

    // Process the data for the response
    const processedHistory = (history || []).map(record => ({
      id: record.id,
      productId: record.products?.id,
      productName: record.products?.name,
      caliber: record.products?.caliber,
      imageUrl: record.products?.image_url,
      quantityChange: record.quantity_change,
      changeType: record.change_type,
      referenceId: record.reference_id,
      notes: record.notes,
      timestamp: record.created_at
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: processedHistory,
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasMore: (count || 0) > offset + limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching stockpile history:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch stockpile history',
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
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
