export interface Category {
  id: string;
  name: string;
  icon: string; // emoji used as lightweight, license-free imagery
  color: string; // tailwind gradient classes
}

export const categories: Category[] = [
  { id: "electronics", name: "إلكترونيات", icon: "📱", color: "from-sky-500 to-blue-600" },
  { id: "fashion", name: "أزياء وملابس", icon: "👗", color: "from-pink-500 to-rose-600" },
  { id: "home", name: "منزل ومطبخ", icon: "🏠", color: "from-amber-500 to-orange-600" },
  { id: "beauty", name: "جمال وعناية", icon: "💄", color: "from-fuchsia-500 to-pink-600" },
  { id: "phones", name: "هواتف وملحقات", icon: "🎧", color: "from-violet-500 to-purple-600" },
  { id: "computers", name: "كمبيوتر ومعدات", icon: "💻", color: "from-slate-600 to-slate-800" },
  { id: "toys", name: "ألعاب وأطفال", icon: "🧸", color: "from-yellow-400 to-amber-500" },
  { id: "sports", name: "رياضة ولياقة", icon: "⚽", color: "from-emerald-500 to-green-600" },
  { id: "cars", name: "سيارات وملحقات", icon: "🚗", color: "from-red-500 to-rose-600" },
  { id: "tools", name: "أدوات وعتاد", icon: "🔧", color: "from-zinc-600 to-zinc-800" },
  { id: "groceries", name: "مواد غذائية", icon: "🛒", color: "from-lime-500 to-green-600" },
  { id: "watches", name: "ساعات ومجوهرات", icon: "⌚", color: "from-cyan-500 to-teal-600" },
];
