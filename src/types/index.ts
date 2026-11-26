export type AgeGroup = 'All Ages' | '0-2 yrs' | '3-5 yrs' | '6-8 yrs' | '9+ yrs';

export type Category =
  | 'All Categories'
  | 'Building & Blocks'
  | 'STEM & Science'
  | 'Plush Pals'
  | 'Art & Craft'
  | 'Puzzles & Games';

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  ageGroup: AgeGroup;
  ageBadge: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  tag?: string;
  tagColor?: 'marigold' | 'blue' | 'coral' | 'mint' | 'neutral';
  images: string[];
  description: string;
  inStock: boolean;
  material: string;
  safetyCertification: string;
  insideTheBox: string[];
  developmentBenefits: {
    title: string;
    description: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  isGift: boolean;
  giftMessage?: string;
  paymentPreference: 'whatsapp_cod' | 'whatsapp_upi' | 'card_online';
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  whatsappUrl?: string;
}
