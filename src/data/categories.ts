export interface Category {
  id: string;
  slug: string;
  ar: string;
  fr: string;
  icon: string;
  description: string;
  sortOrder: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    slug: "traditional",
    ar: "حلويات تقليدية",
    fr: "Pâtisseries Traditionnelles",
    icon: "🌙",
    description: "كل ما هو أصيل من المطبخ الجزائري العريق",
    sortOrder: 1,
  },
  {
    id: "cat-2",
    slug: "modern",
    ar: "حلويات عصرية",
    fr: "Pâtisseries Modernes",
    icon: "✨",
    description: "إبداعات معاصرة بلمسة جزائرية فاخرة",
    sortOrder: 2,
  },
  {
    id: "cat-3",
    slug: "cakes",
    ar: "كيك ومناسبات",
    fr: "Gâteaux & Événements",
    icon: "🎂",
    description: "كيك للأعراس والمناسبات والأعياد",
    sortOrder: 3,
  },
  {
    id: "cat-4",
    slug: "chocolate",
    ar: "شوكولاتة فاخرة",
    fr: "Chocolaterie Fine",
    icon: "🍫",
    description: "شوكولاتة مصنوعة يدوياً بأجود الأنواع",
    sortOrder: 4,
  },
  {
    id: "cat-5",
    slug: "gluten-free",
    ar: "خالية من الغلوتين",
    fr: "Sans Gluten",
    icon: "🌾",
    description: "حلويات صحية لكل الأذواق",
    sortOrder: 5,
  },
  {
    id: "cat-6",
    slug: "honey",
    ar: "حلويات بالعسل",
    fr: "Aux Miel",
    icon: "🍯",
    description: "ذهب أصفر من خيرات الجبال الجزائرية",
    sortOrder: 6,
  },
];

export const getCategoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);
