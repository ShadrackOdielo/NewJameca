import type { Database } from "./database.types";

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductWithDetails = Product & {
  images: Database["public"]["Tables"]["product_images"]["Row"][];
  variants: Database["public"]["Tables"]["product_variants"]["Row"][];
  category: Database["public"]["Tables"]["categories"]["Row"];
  industry: Database["public"]["Tables"]["industries"]["Row"];
};
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductCategory = Database["public"]["Tables"]["categories"]["Row"];

export type ProductVariantWithDetails = ProductVariant & {
  product: ProductWithDetails;
};