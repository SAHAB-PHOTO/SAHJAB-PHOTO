export interface Courier {
  id: string;
  name: string; // الاسم بالعربية
  latin: string; // الاسم اللاتيني
  emoji: string; // أيقونة خفيفة خالية من حقوق الملكية
  eta: string; // مدة التوصيل التقديرية
  wilayas: number; // عدد الولايات المغطّاة
  homeFee: number; // سعر التوصيل إلى المنزل (دج)
  deskFee: number; // سعر التوصيل إلى المكتب / Stop Desk (دج)
  cod: boolean; // يدعم الدفع عند الاستلام
  stopDesk: boolean; // يدعم التوصيل إلى المكتب
  rating: number;
  note?: string;
}

/**
 * شركات التوصيل الجزائرية المتعاملة مع المتجر.
 * الأسعار والمدد تقديرية لأغراض العرض، وتُضبط لاحقاً عبر لوحة الإدارة / API الشركة.
 */
export const couriers: Courier[] = [
  {
    id: "yalidine",
    name: "ياليدين",
    latin: "Yalidine",
    emoji: "🚚",
    eta: "24 – 72 ساعة",
    wilayas: 58,
    homeFee: 600,
    deskFee: 350,
    cod: true,
    stopDesk: true,
    rating: 4.8,
    note: "الأوسع تغطيةً في الجزائر",
  },
  {
    id: "zrexpress",
    name: "زد آر إكسبريس",
    latin: "ZR Express",
    emoji: "📦",
    eta: "48 – 72 ساعة",
    wilayas: 58,
    homeFee: 550,
    deskFee: 300,
    cod: true,
    stopDesk: true,
    rating: 4.6,
  },
  {
    id: "maystro",
    name: "مايسترو ديليفري",
    latin: "Maystro Delivery",
    emoji: "🛵",
    eta: "24 – 48 ساعة",
    wilayas: 48,
    homeFee: 650,
    deskFee: 400,
    cod: true,
    stopDesk: true,
    rating: 4.7,
    note: "تتبّع لحظي للطرود",
  },
  {
    id: "noest",
    name: "نوست إكسبريس",
    latin: "Noest Express",
    emoji: "⚡",
    eta: "24 – 72 ساعة",
    wilayas: 58,
    homeFee: 580,
    deskFee: 320,
    cod: true,
    stopDesk: true,
    rating: 4.5,
  },
  {
    id: "guepex",
    name: "غيبكس إكسبريس",
    latin: "Guepex Express",
    emoji: "🐆",
    eta: "48 – 96 ساعة",
    wilayas: 48,
    homeFee: 600,
    deskFee: 350,
    cod: true,
    stopDesk: true,
    rating: 4.4,
  },
  {
    id: "ems",
    name: "بريد الجزائر — EMS",
    latin: "Algérie Poste EMS",
    emoji: "🏤",
    eta: "3 – 6 أيام",
    wilayas: 58,
    homeFee: 500,
    deskFee: 250,
    cod: false,
    stopDesk: true,
    rating: 4.1,
    note: "تغطية كل المكاتب البريدية",
  },
];

export function getCourier(id: string): Courier | undefined {
  return couriers.find((c) => c.id === id);
}
