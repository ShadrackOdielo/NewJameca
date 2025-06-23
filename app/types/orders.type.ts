import type { Database } from "./database.types";
export type Order = {
  id: number;
  customer_id: number | null;
  created_at: string | null;
  updated_at: string | null;
  total: number | null;
  currency: string | null;
  status: Database["public"]["Enums"]["order_status"];
};

export type OrderItem = {
  order_item_id: number;
  order_id: number | null;
  variant_id: number | null;
  quantity: number;
  unit_price: number;
  created_at: string | null;
  updated_at: string | null;
};

export type OrderWithDetails = Order & {
  customer: Database["public"]["Tables"]["customers"]["Row"] | null;
  items: OrderItem[];
};

export type OrderSummary = {
  order: Order;
  total_items: number;
  total_amount: number;
};