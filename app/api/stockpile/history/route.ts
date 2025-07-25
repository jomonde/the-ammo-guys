import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { StockpileHistoryResponse } from '@/types/stockpile';

interface ProductData {
  id?: string;
  name?: string;
  caliber?: string;
  image_url?: string;
}

interface HistoryRecord {
  id: string;
  products: ProductData | null;
  quantity_change: number;
  change_type: string;
  reference_id: string | null;
  notes: string | null;
  created_at: string;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const productId = searchParams.get('productId');
    const changeType = searchParams.get('changeType') as 'allocation' | 'shipment' | 'adjustment' | null;
    
    const supabase = createRouteHandlerClient();
    
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

    // Process the data for the response with proper null checks
    const processedHistory = (history as HistoryRecord[] || []).map(record => {
      const product = record.products || {};
      return {
        id: record.id,
        productId: product.id || '',
        productName: product.name || null,
        caliber: product.caliber || null,
        imageUrl: product.image_url || null,
        quantityChange: record.quantity_change || 0,
        changeType: record.change_type || 'unknown',
        referenceId: record.reference_id || null,
        notes: record.notes || null,
        timestamp: record.created_at || new Date().toISOString()
      };
    });

    const response: StockpileHistoryResponse = {
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
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stockpile history:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch stockpile history',
        details: errorMessage 
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
