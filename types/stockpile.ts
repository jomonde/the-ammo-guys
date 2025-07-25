export interface Product {
  id: string;
  name: string;
  description: string;
  caliber: string;
  price: number;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface StockpileItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  value: number;
  is_shipped: boolean;
  added_date: string;
  products?: Product;
  created_at: string;
  updated_at: string;
}

export interface ShippingHistory {
  id: string;
  user_id: string;
  tracking_number: string;
  carrier: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_date: string;
  delivered_date?: string;
  total_value: number;
  total_rounds: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAllocation {
  id: string;
  user_id: string;
  caliber: string;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  shipping_threshold: number;
  round_threshold: number;
  default_shipping_address_id?: string;
  default_payment_method_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  is_default: boolean;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  is_default: boolean;
  card_brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  created_at: string;
  updated_at: string;
}

export interface ShipmentItem {
  id: string;
  shipment_id: string;
  stockpile_item_id: string;
  quantity: number;
  value: number;
  created_at: string;
  updated_at: string;
  stockpile_item: StockpileItem;
}

export interface ShipmentWithItems extends ShippingHistory {
  items: ShipmentItem[];
  shipping_address: ShippingAddress;
}

export interface StockpileStats {
  total_rounds: number;
  total_value: number;
  by_caliber: Array<{
    caliber: string;
    rounds: number;
    value: number;
    percentage: number;
  }>;
  progress_to_threshold: {
    value: number;
    rounds: number;
  };
}

export interface StockpileHistoryItem {
  id: string;
  productId: string;
  productName: string | null;
  caliber: string | null;
  imageUrl: string | null;
  quantityChange: number;
  changeType: string;
  referenceId: string | null;
  notes: string | null;
  timestamp: string;
}

export interface StockpileSummaryItem {
  id: string;
  productId: string | null;
  name: string | null;
  caliber: string | null;
  quantity: number | null;
  target: number | null;
  price: number | null;
  imageUrl: string | null;
  value: number;
  progress: number;
  lastAllocation: string | null;
  lastShipment: string | null;
}

export interface StockpileSummaryTotals {
  totalValue: number;
  totalRounds: number;
  totalTarget: number;
  valueProgress: number;
  roundsProgress: number;
  items: number;
  lastUpdated: string;
}

export interface StockpileSummaryResponse {
  success: boolean;
  data: {
    summary: StockpileSummaryTotals;
    items: StockpileSummaryItem[];
    triggers: any[]; 
  };
}

export interface StockpileHistoryResponse {
  success: boolean;
  data: {
    items: StockpileHistoryItem[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}
