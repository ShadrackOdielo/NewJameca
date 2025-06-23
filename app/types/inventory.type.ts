export type InventoryItem = {
  id: number;
  product_id: number;
  quantity: number;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type InventoryWithProductDetails = InventoryItem & {
  product: {
    id: number;
    name: string;
    category_id: number | null;
    base_price: number;
    images: {
      id: number;
      url: string;
      is_primary: boolean | null;
    }[];
    variants: {
      id: number;
      sku: string | null;
      price: number | null;
      stock_quantity: number | null;
    }[];
  };
};

export type StockLevel = {
  product_id: number;
  current_stock: number;
  minimum_required: number;
  maximum_allowed: number;
};