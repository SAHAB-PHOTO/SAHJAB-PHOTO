export interface PaymentMethod {
  id: string;
  name: string;
  desc: string;
  icon: string; // emoji glyph (license-free)
  group: "local" | "card" | "wallet" | "cod";
  badge?: string;
}

/**
 * كامل وسائل الدفع الإلكتروني المدعومة في الجزائر + الوسائل الدولية.
 * الواجهة جاهزة، ويتم ربط المفاتيح الحقيقية لاحقاً (SATIM / Stripe / PayPal ...).
 */
export const paymentMethods: PaymentMethod[] = [
  // --- وسائل الدفع الجزائرية المحلية ---
  {
    id: "cib",
    name: "بطاقة CIB",
    desc: "الدفع ببطاقة CIB عبر بوابة SATIM المؤمّنة",
    icon: "💳",
    group: "local",
    badge: "الأكثر استخداماً",
  },
  {
    id: "edahabia",
    name: "بطاقة الذهبية (Edahabia)",
    desc: "بطاقة بريد الجزائر — الدفع الإلكتروني عبر SATIM",
    icon: "🟡",
    group: "local",
  },
  {
    id: "baridimob",
    name: "BaridiMob",
    desc: "الدفع الفوري من تطبيق بريدي موب",
    icon: "📲",
    group: "local",
  },
  {
    id: "ccp",
    name: "تحويل CCP / BaridiMob",
    desc: "تحويل بريدي على حساب ССР ثم إرسال الإيصال",
    icon: "🏤",
    group: "local",
  },
  // --- محافظ ودفع دولي ---
  {
    id: "visa",
    name: "Visa / MasterCard",
    desc: "بطاقات بنكية دولية (Stripe)",
    icon: "🌐",
    group: "card",
  },
  {
    id: "paypal",
    name: "PayPal",
    desc: "الدفع الآمن عبر حساب PayPal",
    icon: "🅿️",
    group: "wallet",
  },
  {
    id: "googlepay",
    name: "Google Pay / Apple Pay",
    desc: "دفع سريع بنقرة واحدة من المحفظة الرقمية",
    icon: "📱",
    group: "wallet",
  },
  {
    id: "crypto",
    name: "العملات الرقمية",
    desc: "USDT / BTC عبر مزوّد خارجي",
    icon: "₿",
    group: "wallet",
  },
  // --- الدفع عند الاستلام ---
  {
    id: "cod",
    name: "الدفع عند الاستلام",
    desc: "ادفع نقداً للموزّع عند وصول الطلب — متاح في 58 ولاية",
    icon: "🚚",
    group: "cod",
    badge: "موصى به",
  },
];
