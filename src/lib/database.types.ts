// Generated to match supabase/migrations/20260527000001_initial_schema.sql
// Regenerate with `supabase gen types typescript --local`

export type UserRole = "buyer" | "seller" | "admin";
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
export type PaymentMethod = "cib" | "edahabia" | "baridimob" | "cod";
export type PayoutStatus = "pending" | "processing" | "paid" | "failed";
export type ShopStatus = "pending" | "active" | "suspended";
export type DisputeStatus = "open" | "investigating" | "resolved" | "refunded" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          phone: string | null;
          wilaya_code: number | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_fr: string;
          icon: string | null;
          sort_order: number;
          active: boolean;
          commission_rate_bps: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["categories"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
      };
      shops: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          name_ar: string;
          name_fr: string;
          description: string | null;
          story: string | null;
          logo_url: string | null;
          banner_url: string | null;
          wilaya_code: number;
          verified: boolean;
          rating_avg: number;
          review_count: number;
          total_sales: number;
          working_hours: string | null;
          delivery_zones: number[];
          status: ShopStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["shops"]["Row"], "id" | "created_at" | "verified" | "rating_avg" | "review_count" | "total_sales" | "status"> & {
          verified?: boolean;
          status?: ShopStatus;
        };
        Update: Partial<Database["public"]["Tables"]["shops"]["Row"]>;
      };
      products: {
        Row: {
          id: string;
          shop_id: string;
          category_id: string;
          name_ar: string;
          name_fr: string;
          description: string | null;
          price_dzd: number;
          photos: string[];
          stock: number;
          allergens: string[];
          ingredients: string[];
          prep_time_hours: number;
          active: boolean;
          featured: boolean;
          rating_avg: number;
          review_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "id" | "created_at" | "rating_avg" | "review_count">;
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          buyer_id: string;
          shop_id: string;
          items_json: OrderItem[];
          subtotal: number;
          delivery_fee: number;
          commission_rate_bps: number;
          commission_amount: number;
          total: number;
          payment_method: PaymentMethod;
          status: OrderStatus;
          delivery_address: string;
          delivery_wilaya_code: number;
          buyer_phone: string;
          notes: string | null;
          created_at: string;
          estimated_delivery: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["orders"]["Row"], "id" | "order_number" | "created_at"> & {
          order_number?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
      };
      reviews: {
        Row: {
          id: string;
          order_id: string;
          buyer_id: string;
          shop_id: string;
          product_id: string | null;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
      };
      payouts: {
        Row: {
          id: string;
          reference: string;
          shop_id: string;
          gross_amount: number;
          commission_amount: number;
          net_amount: number;
          period_start: string;
          period_end: string;
          status: PayoutStatus;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["payouts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["payouts"]["Row"]>;
      };
      disputes: {
        Row: {
          id: string;
          reference: string;
          order_id: string;
          opened_by: string;
          shop_id: string;
          reason: string;
          description: string;
          amount: number;
          status: DisputeStatus;
          priority: "low" | "medium" | "high";
          resolved_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["disputes"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["disputes"]["Row"]>;
      };
      platform_settings: {
        Row: {
          id: number;
          default_commission_bps: number;
          updated_at: string;
        };
        Insert: never;
        Update: Partial<Database["public"]["Tables"]["platform_settings"]["Row"]>;
      };
    };
  };
}

export interface OrderItem {
  product_id: string;
  name_ar: string;
  price_dzd: number;
  quantity: number;
  photo: string;
}
