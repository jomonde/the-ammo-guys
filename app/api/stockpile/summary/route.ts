import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { 
  StockpileSummaryResponse, 
  StockpileSummaryItem, 
  StockpileSummaryTotals 
} from '@/types/stockpile';

interface Product {
  id: string;
  name: string;
  caliber: string;
  price: number;
  image_url: string | null;
}

interface VirtualStockpileRecord {
  id: string;
  quantity_allocated: number | null;
  target_quantity: number | null;
  last_allocation_date: string | null;
  last_shipment_date: string | null;
  products: Product[] | null;
}

interface ShipmentTrigger {
  id: string;
  [key: string]: any; // Add specific fields as needed
}

export async function GET() {
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

    // Get user's stockpile summary
    const { data: stockpile } = await supabase
      .from('virtual_stockpile')
      .select(`
        id,
        quantity_allocated,
        target_quantity,
        last_allocation_date,
        last_shipment_date,
        products (
          id,
          name,
          caliber,
          price,
          image_url
        )
      `)
      .eq('user_id', session.user.id);

    // Get user's shipment triggers
    const { data: triggers } = await supabase
      .from('shipment_triggers')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_active', true);

    // Initialize totals with proper types
    const totals: StockpileSummaryTotals = {
      totalValue: 0,
      totalRounds: 0,
      totalTarget: 0,
      valueProgress: 0,
      roundsProgress: 0,
      items: stockpile?.length || 0,
      lastUpdated: new Date().toISOString()
    };

    // Process stockpile data with type safety
    const processedStockpile: StockpileSummaryItem[] = (stockpile as unknown as VirtualStockpileRecord[] || []).map(item => {
      // Safely get the first product or use an empty object
      const product = item.products && item.products[0] ? item.products[0] : {
        id: null,
        name: null,
        caliber: null,
        price: 0,
        image_url: null
      };
      
      const quantity = item.quantity_allocated || 0;
      const target = item.target_quantity || 0;
      const price = product?.price || 0;
      const value = quantity * price;
      const progress = target > 0 ? Math.min(100, (quantity / target) * 100) : 0;
      
      // Update totals
      totals.totalValue += value;
      totals.totalRounds += quantity;
      totals.totalTarget += target;
      
      return {
id: item.id,
        productId: product?.id || null,
        name: product?.name || null,
        caliber: product?.caliber || null,
        quantity: quantity || null,
        target: target || null,
        price: price || null,
        imageUrl: product?.image_url || null,
        value,
        progress,
        lastAllocation: item.last_allocation_date,
        lastShipment: item.last_shipment_date
      } as StockpileSummaryItem;
    });

    // Calculate overall progress
    if (totals.totalTarget > 0) {
      totals.valueProgress = Math.min(100, (totals.totalValue / (totals.totalTarget * 0.5)) * 100);
      totals.roundsProgress = Math.min(100, (totals.totalRounds / totals.totalTarget) * 100);
    }

    const response: StockpileSummaryResponse = {
      success: true,
      data: {
        summary: totals,
        items: processedStockpile,
        triggers: (triggers as ShipmentTrigger[]) || []
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching stockpile summary:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch stockpile summary',
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
