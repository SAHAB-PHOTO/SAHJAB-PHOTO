export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  sold: number;
  emoji: string;
  gradient: string;
  freeShipping: boolean;
  choice?: boolean; // "اختيار سهجاب" badge
  flash?: boolean;
  store: string;
  description: string;
  specs: { label: string; value: string }[];
}

const g = {
  blue: "from-sky-400 via-blue-500 to-indigo-600",
  rose: "from-pink-400 via-rose-500 to-red-500",
  amber: "from-amber-300 via-orange-400 to-orange-600",
  violet: "from-violet-400 via-purple-500 to-fuchsia-600",
  emerald: "from-emerald-400 via-green-500 to-teal-600",
  slate: "from-slate-500 via-slate-700 to-zinc-900",
  cyan: "from-cyan-400 via-teal-500 to-emerald-600",
  yellow: "from-yellow-300 via-amber-400 to-orange-500",
};

export const products: Product[] = [
  {
    id: "p1",
    name: "سماعات بلوتوث لاسلكية TWS Pro عزل ضجيج",
    category: "phones",
    price: 2900,
    oldPrice: 5400,
    rating: 4.8,
    reviews: 1280,
    sold: 9400,
    emoji: "🎧",
    gradient: g.violet,
    freeShipping: true,
    choice: true,
    flash: true,
    store: "متجر التقنية الجزائر",
    description:
      "سماعات لاسلكية بتقنية بلوتوث 5.3، عزل ضجيج نشط، بطارية تدوم حتى 30 ساعة مع علبة الشحن، مقاومة للماء IPX5. مثالية للرياضة والمكالمات.",
    specs: [
      { label: "بلوتوث", value: "5.3" },
      { label: "البطارية", value: "30 ساعة" },
      { label: "مقاومة الماء", value: "IPX5" },
      { label: "الضمان", value: "12 شهر" },
    ],
  },
  {
    id: "p2",
    name: "ساعة ذكية Smart Watch شاشة AMOLED قياس النبض",
    category: "watches",
    price: 4500,
    oldPrice: 8900,
    rating: 4.7,
    reviews: 2310,
    sold: 15200,
    emoji: "⌚",
    gradient: g.cyan,
    freeShipping: true,
    choice: true,
    flash: true,
    store: "Gadgets DZ",
    description:
      "ساعة ذكية بشاشة AMOLED عالية الدقة، قياس معدل ضربات القلب والأكسجين، إشعارات المكالمات والرسائل، أكثر من 100 وضع رياضي.",
    specs: [
      { label: "الشاشة", value: "1.43 AMOLED" },
      { label: "البطارية", value: "7 أيام" },
      { label: "مقاومة الماء", value: "IP68" },
      { label: "التوافق", value: "Android / iOS" },
    ],
  },
  {
    id: "p3",
    name: "هاتف ذكي 256GB رام 8GB كاميرا 108MP",
    category: "electronics",
    price: 38900,
    oldPrice: 49900,
    rating: 4.6,
    reviews: 540,
    sold: 3200,
    emoji: "📱",
    gradient: g.blue,
    freeShipping: true,
    choice: true,
    store: "Smart Phone Store",
    description:
      "هاتف ذكي بمعالج ثماني النواة، شاشة 6.7 بوصة، كاميرا رئيسية 108 ميغابكسل، بطارية 5000 mAh مع شحن سريع 67W.",
    specs: [
      { label: "الذاكرة", value: "256GB / 8GB" },
      { label: "الشاشة", value: "6.7\" 120Hz" },
      { label: "الكاميرا", value: "108MP" },
      { label: "البطارية", value: "5000mAh" },
    ],
  },
  {
    id: "p4",
    name: "جاكيت شتوي رجالي مقاوم للماء بقبعة",
    category: "fashion",
    price: 3600,
    oldPrice: 6200,
    rating: 4.5,
    reviews: 870,
    sold: 5600,
    emoji: "🧥",
    gradient: g.slate,
    freeShipping: false,
    flash: true,
    store: "Fashion Algérie",
    description:
      "جاكيت شتوي أنيق ودافئ، قماش مقاوم للماء والرياح، بطانة فرو ناعمة، متوفر بعدة مقاسات وألوان.",
    specs: [
      { label: "الخامة", value: "بوليستر مقاوم" },
      { label: "المقاسات", value: "M – 3XL" },
      { label: "الموسم", value: "شتاء" },
    ],
  },
  {
    id: "p5",
    name: "حذاء رياضي خفيف للجري مريح",
    category: "sports",
    price: 2400,
    oldPrice: 4100,
    rating: 4.6,
    reviews: 1490,
    sold: 8800,
    emoji: "👟",
    gradient: g.emerald,
    freeShipping: true,
    store: "Sport Center DZ",
    description:
      "حذاء رياضي بنعل مرن خفيف الوزن، تهوية ممتازة، مناسب للجري والمشي اليومي.",
    specs: [
      { label: "النعل", value: "EVA مرن" },
      { label: "المقاسات", value: "39 – 45" },
      { label: "الوزن", value: "خفيف" },
    ],
  },
  {
    id: "p6",
    name: "خلاط كهربائي متعدد الوظائف 1200W",
    category: "home",
    price: 5200,
    oldPrice: 7800,
    rating: 4.7,
    reviews: 640,
    sold: 4100,
    emoji: "🍹",
    gradient: g.amber,
    freeShipping: false,
    choice: true,
    store: "Maison & Cuisine",
    description:
      "خلاط قوي بمحرك 1200 واط، شفرات ستانلس ستيل، وعاء زجاجي 1.5 لتر، عدة سرعات لطحن وخلط كل المكونات.",
    specs: [
      { label: "القدرة", value: "1200W" },
      { label: "السعة", value: "1.5 لتر" },
      { label: "السرعات", value: "5 + نبض" },
    ],
  },
  {
    id: "p7",
    name: "طقم مكياج احترافي 48 قطعة",
    category: "beauty",
    price: 3100,
    oldPrice: 5900,
    rating: 4.8,
    reviews: 2050,
    sold: 12300,
    emoji: "💄",
    gradient: g.rose,
    freeShipping: true,
    flash: true,
    store: "Beauty Box DZ",
    description:
      "طقم مكياج كامل احترافي يحتوي على ظلال، أحمر شفاه، فرش وكل ما تحتاجينه لإطلالة متكاملة.",
    specs: [
      { label: "القطع", value: "48 قطعة" },
      { label: "النوع", value: "متعدد الاستخدام" },
    ],
  },
  {
    id: "p8",
    name: "لوحة مفاتيح ميكانيكية RGB للألعاب",
    category: "computers",
    price: 4800,
    oldPrice: 7200,
    rating: 4.7,
    reviews: 980,
    sold: 6400,
    emoji: "⌨️",
    gradient: g.slate,
    freeShipping: true,
    choice: true,
    store: "Gaming Zone DZ",
    description:
      "لوحة مفاتيح ميكانيكية بإضاءة RGB قابلة للتخصيص، مفاتيح زرقاء، هيكل معدني متين، مثالية للاعبين.",
    specs: [
      { label: "النوع", value: "ميكانيكية" },
      { label: "الإضاءة", value: "RGB" },
      { label: "التوصيل", value: "USB" },
    ],
  },
  {
    id: "p9",
    name: "دمية تعليمية تفاعلية للأطفال",
    category: "toys",
    price: 1900,
    oldPrice: 3200,
    rating: 4.6,
    reviews: 420,
    sold: 2800,
    emoji: "🧸",
    gradient: g.yellow,
    freeShipping: false,
    store: "Toys Land",
    description:
      "لعبة تعليمية تفاعلية تساعد الأطفال على تعلم الأرقام والحروف بطريقة ممتعة وآمنة.",
    specs: [
      { label: "العمر", value: "+3 سنوات" },
      { label: "المواد", value: "آمنة ABS" },
    ],
  },
  {
    id: "p10",
    name: "شاحن سيارة سريع مزدوج USB-C 65W",
    category: "cars",
    price: 1400,
    oldPrice: 2600,
    rating: 4.5,
    reviews: 760,
    sold: 5100,
    emoji: "🔌",
    gradient: g.blue,
    freeShipping: false,
    flash: true,
    store: "Auto Parts DZ",
    description:
      "شاحن سيارة بمنفذين، شحن سريع PD 65W، حماية من الحرارة الزائدة، متوافق مع جميع الهواتف.",
    specs: [
      { label: "القدرة", value: "65W" },
      { label: "المنافذ", value: "USB-C + USB-A" },
    ],
  },
  {
    id: "p11",
    name: "مجموعة عدّة أدوات منزلية 46 قطعة",
    category: "tools",
    price: 2700,
    oldPrice: 4500,
    rating: 4.7,
    reviews: 510,
    sold: 3300,
    emoji: "🧰",
    gradient: g.amber,
    freeShipping: false,
    store: "Bricolage DZ",
    description:
      "حقيبة عدّة كاملة بـ46 قطعة من مفكات ومفاتيح وكماشات عالية الجودة لكل أعمال الصيانة المنزلية.",
    specs: [
      { label: "القطع", value: "46 قطعة" },
      { label: "الخامة", value: "كروم فاناديوم" },
    ],
  },
  {
    id: "p12",
    name: "علبة عسل سدر طبيعي 1 كغ",
    category: "groceries",
    price: 3500,
    oldPrice: 4200,
    rating: 4.9,
    reviews: 1320,
    sold: 7700,
    emoji: "🍯",
    gradient: g.yellow,
    freeShipping: false,
    choice: true,
    store: "منتجات طبيعية الجنوب",
    description:
      "عسل سدر طبيعي 100%، مصدر محلي موثوق، غني بالفوائد، معبأ بعناية في الجزائر.",
    specs: [
      { label: "الوزن", value: "1 كغ" },
      { label: "النوع", value: "طبيعي 100%" },
    ],
  },
  {
    id: "p13",
    name: "كاميرا مراقبة WiFi ذكية رؤية ليلية",
    category: "electronics",
    price: 3300,
    oldPrice: 5600,
    rating: 4.6,
    reviews: 690,
    sold: 4500,
    emoji: "📷",
    gradient: g.slate,
    freeShipping: true,
    flash: true,
    store: "Smart Home DZ",
    description:
      "كاميرا مراقبة لاسلكية بدقة عالية، رؤية ليلية، تنبيه حركة، تحكم كامل عبر تطبيق الهاتف.",
    specs: [
      { label: "الدقة", value: "1080p" },
      { label: "الرؤية الليلية", value: "نعم" },
      { label: "التخزين", value: "بطاقة SD" },
    ],
  },
  {
    id: "p14",
    name: "حقيبة ظهر مقاومة للماء بمنفذ USB",
    category: "fashion",
    price: 2200,
    oldPrice: 3900,
    rating: 4.6,
    reviews: 1140,
    sold: 6900,
    emoji: "🎒",
    gradient: g.cyan,
    freeShipping: true,
    store: "Bag Store DZ",
    description:
      "حقيبة ظهر عصرية بسعة كبيرة، حماية للابتوب، منفذ شحن USB، قماش مقاوم للماء.",
    specs: [
      { label: "السعة", value: "للابتوب 15.6\"" },
      { label: "USB", value: "نعم" },
    ],
  },
  {
    id: "p15",
    name: "مكنسة كهربائية لاسلكية قوية 2 في 1",
    category: "home",
    price: 8900,
    oldPrice: 13500,
    rating: 4.7,
    reviews: 380,
    sold: 1900,
    emoji: "🧹",
    gradient: g.emerald,
    freeShipping: true,
    choice: true,
    store: "Maison & Cuisine",
    description:
      "مكنسة لاسلكية خفيفة بقوة شفط عالية، بطارية تدوم 45 دقيقة، تتحول لمكنسة يدوية بسهولة.",
    specs: [
      { label: "البطارية", value: "45 دقيقة" },
      { label: "النوع", value: "لاسلكية 2 في 1" },
    ],
  },
  {
    id: "p16",
    name: "عطر رجالي فاخر 100ml ثبات عالي",
    category: "beauty",
    price: 2800,
    oldPrice: 4900,
    rating: 4.8,
    reviews: 1670,
    sold: 9200,
    emoji: "🧴",
    gradient: g.violet,
    freeShipping: false,
    flash: true,
    store: "Parfums DZ",
    description:
      "عطر رجالي شرقي فاخر بثبات يدوم طويلاً، تركيبة راقية مناسبة لكل المناسبات.",
    specs: [
      { label: "الحجم", value: "100ml" },
      { label: "الثبات", value: "8+ ساعات" },
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function byCategory(catId: string): Product[] {
  return products.filter((p) => p.category === catId);
}

export function flashDeals(): Product[] {
  return products.filter((p) => p.flash);
}

export function searchProducts(q: string): Product[] {
  const t = q.trim().toLowerCase();
  if (!t) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(t) ||
      p.store.toLowerCase().includes(t) ||
      p.description.toLowerCase().includes(t),
  );
}
