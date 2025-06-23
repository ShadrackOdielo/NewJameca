import type { Database } from "./database.types";

export type Customer = {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  created_at?: string | null;
};

export type CustomerProfile = {
  user_id: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  role?: string | null;
  created_at?: string | null;
};

export type CustomerOrder = {
  id: number;
  customer_id: number;
  total: number | null;
  currency: string | null;
  status: Database["public"]["Enums"]["order_status"];
  created_at: string | null;
};

export type CustomerReview = {
  review_id: number;
  product_id: number | null;
  customer_id: number | null;
  rating: number | null;
  title?: string | null;
  body?: string | null;
  created_at?: string | null;
};

export type CustomerWithDetails = Customer & {
  profile?: CustomerProfile;
  orders?: CustomerOrder[];
  reviews?: CustomerReview[];
};