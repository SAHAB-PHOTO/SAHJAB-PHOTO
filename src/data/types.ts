export type UserRole = "buyer" | "seller" | "admin";

export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";

export type PaymentMethod = "cib" | "edahabia" | "baridimob" | "cod";

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  phone: string;
  email: string;
  wilayaCode: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  description: string;
  story: string;
  logoUrl: string;
  bannerUrl: string;
  wilayaCode: number;
  verified: boolean;
  ratingAvg: number;
  reviewCount: number;
  totalSales: number;
  workingHours: string;
  deliveryZones: number[];
  joinedAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  nameAr: string;
  nameFr: string;
  description: string;
  priceDzd: number;
  categoryId: string;
  photos: string[];
  stock: number;
  allergens: string[];
  ingredients: string[];
  prepTimeHours: number;
  active: boolean;
  ratingAvg: number;
  reviewCount: number;
  featured?: boolean;
}

export interface OrderItem {
  productId: string;
  nameAr: string;
  priceDzd: number;
  quantity: number;
  photo: string;
}

export interface Order {
  id: string;
  buyerId: string;
  shopId: string;
  shopNameAr: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  commissionRate: number;
  commissionAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryWilayaCode: number;
  buyerPhone: string;
  createdAt: string;
  estimatedDelivery: string;
}

export interface Review {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  shopId: string;
  productId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  shopId: string;
  nameAr: string;
  priceDzd: number;
  photo: string;
  quantity: number;
}
