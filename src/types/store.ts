export interface Product {
  id: string;
  name: string;
  category_id: string;
  price: number;
  original_price?: number;
  stock: number;
  rating?: number;
  reviews_count?: number;
  image_url: string;
  description?: string;
  is_featured?: boolean;
  is_trending?: boolean;
  is_limited_deal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  image_url: string;
  subtitle?: string;
  display_order?: number;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  image_url: string;
  badge_text?: string;
  button_text: string;
  link_url: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}