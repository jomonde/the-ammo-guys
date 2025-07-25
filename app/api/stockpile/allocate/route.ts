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
    const { allocations } = await request.json();
    
    if (!Array.isArray(allocations)) {
      return NextResponse.json(
        { error: 'Invalid request format. Expected array of allocations.' },
        { status: 400 }
      );
    }

    // Get user's subscription to check budget
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('monthly_budget, next_allocation_date, allocation_frequency')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Calculate total allocation amount
    const totalAllocation = allocations.reduce(
      (sum: number, alloc: { amount: number }) => sum + (parseFloat(alloc.amount as any) || 0), 
      0
    );

    // Check if total allocation exceeds monthly budget
    if (totalAllocation > subscription.monthly_budget) {
      return NextResponse.json(
        { 
          error: 'Total allocation exceeds monthly budget',
          details: {
            totalAllocation,
            monthlyBudget: subscription.monthly_budget,
            remainingBudget: subscription.monthly_budget - totalAllocation
          }
        },
        { status: 400 }
      );
    }

    // Process each allocation
    const results = [];
    const errors = [];

    for (const alloc of allocations) {
      try {
        const { productId, amount } = alloc;
        
        if (!productId || amount === undefined || amount < 0) {
          errors.push({
            productId,
            error: 'Invalid allocation data',
            details: alloc
          });
          continue;
        }

        // Check if product exists
        const { data: product } = await supabase
          .from('products')
          .select('id, price')
          .eq('id', productId)
          .single();

        if (!product) {
          errors.push({
            productId,
            error: 'Product not found'
          });
          continue;
        }

        // Calculate quantity based on product price
        const quantity = amount / product.price;
        
        // Update or insert stockpile allocation
        const { data: existingAllocation, error: allocationError } = await supabase
          .from('stockpile_allocations')
          .select('id, monthly_amount')
          .eq('subscription_id', subscription.id)
          .eq('product_id', productId)
          .maybeSingle();

        if (allocationError) throw allocationError;

        if (existingAllocation) {
          // Update existing allocation
          const { error: updateError } = await supabase
            .from('stockpile_allocations')
            .update({
              monthly_amount: amount,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingAllocation.id);

          if (updateError) throw updateError;
        } else {
          // Create new allocation
          const { error: insertError } = await supabase
            .from('stockpile_allocations')
            .insert([{
              subscription_id: subscription.id,
              product_id: productId,
              monthly_amount: amount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }]);

          if (insertError) throw insertError;
        }

        // Update virtual stockpile
        const { error: upsertError } = await supabase
          .from('virtual_stockpile')
          .upsert({
            user_id: session.user.id,
            product_id: productId,
            quantity_allocated: quantity,
            last_allocation_date: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,product_id',
            ignoreDuplicates: false
          });

        if (upsertError) throw upsertError;

        results.push({
          productId,
          success: true,
          amount,
          quantity
        });

      } catch (error) {
        console.error(`Error processing allocation for product ${alloc.productId}:`, error);
        errors.push({
          productId: alloc.productId,
          error: 'Failed to process allocation',
          details: error
        });
      }
    }

    // Update next allocation date based on frequency
    const nextDate = new Date();
    switch (subscription.allocation_frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
      default:
        nextDate.setMonth(nextDate.getMonth() + 1);
    }

    await supabase
      .from('subscriptions')
      .update({
        next_allocation_date: nextDate.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      nextAllocationDate: nextDate.toISOString(),
      remainingBudget: subscription.monthly_budget - totalAllocation
    });

  } catch (error) {
    console.error('Error processing allocations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process allocations',
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
