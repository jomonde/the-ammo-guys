import { createRouteHandlerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

    // Calculate totals
    const totals = {
      totalValue: 0,
      totalRounds: 0,
      totalTarget: 0,
      valueProgress: 0,
      roundsProgress: 0,
      items: stockpile?.length || 0,
      lastUpdated: new Date().toISOString()
    };

    // Process stockpile data
    const processedStockpile = stockpile?.map(item => {
      const value = (item.quantity_allocated || 0) * (item.products?.price || 0);
      const progress = item.target_quantity 
        ? Math.min(100, ((item.quantity_allocated || 0) / item.target_quantity) * 100)
        : 0;
      
      // Update totals
      totals.totalValue += value;
      totals.totalRounds += item.quantity_allocated || 0;
      totals.totalTarget += item.target_quantity || 0;
      
      return {
        id: item.id,
        productId: item.products?.id,
        name: item.products?.name,
        caliber: item.products?.caliber,
        quantity: item.quantity_allocated,
        target: item.target_quantity,
        price: item.products?.price,
        imageUrl: item.products?.image_url,
        value: value,
        progress: progress,
        lastAllocation: item.last_allocation_date,
        lastShipment: item.last_shipment_date
      };
    });

    // Calculate overall progress
    if (totals.totalTarget > 0) {
      totals.valueProgress = Math.min(100, (totals.totalValue / (totals.totalTarget * 0.5)) * 100); // Assuming average price of $0.5 per round for progress
      totals.roundsProgress = Math.min(100, (totals.totalRounds / totals.totalTarget) * 100);
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: totals,
        items: processedStockpile || [],
        triggers: triggers || []
      }
    });

  } catch (error) {
    console.error('Error fetching stockpile summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stockpile summary' },
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
