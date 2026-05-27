import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, GripVertical, Edit2, Trash2, Eye, EyeOff, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/mock";
import { useLocale } from "@/stores/locale";

const BANNERS = [
  { id: "b-1", titleAr: "رمضان كريم", titleFr: "Ramadan", img: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&h=300&fit=crop", active: true, ctr: "4.8%" },
  { id: "b-2", titleAr: "حلويات الأعراس", titleFr: "Mariages", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800&h=300&fit=crop", active: true, ctr: "3.2%" },
  { id: "b-3", titleAr: "تشكيلة جديدة", titleFr: "Nouveautés", img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&h=300&fit=crop", active: false, ctr: "—" },
];

export default function AdminCategories() {
  const { lang } = useLocale();
  const [tab, setTab] = useState<"categories" | "banners">("categories");

  const productCounts = CATEGORIES.reduce(
    (acc, c) => ({ ...acc, [c.id]: PRODUCTS.filter((p) => p.categoryId === c.id).length }),
    {} as Record<string, number>
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
            {lang === "ar" ? "الفئات والبانرات" : "Catégories & bannières"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {lang === "ar" ? "نظّم بنية المتجر وحملات الترويج" : "Organisez la taxonomie et les promotions"}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          {tab === "categories"
            ? (lang === "ar" ? "إضافة فئة" : "Nouvelle catégorie")
            : (lang === "ar" ? "إضافة بانر" : "Nouvelle bannière")}
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[16px] shadow-soft p-1 mb-6 inline-flex gap-1">
        <button
          onClick={() => setTab("categories")}
          className={`px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${tab === "categories" ? "bg-cocoa-900 text-cream" : "text-cocoa-400"}`}
        >
          {lang === "ar" ? "الفئات" : "Catégories"}
          <span className={`ms-2 px-1.5 py-0.5 rounded-full text-xs ${tab === "categories" ? "bg-gold-500" : "bg-cream-200 text-cocoa-400"}`}>
            {CATEGORIES.length}
          </span>
        </button>
        <button
          onClick={() => setTab("banners")}
          className={`px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${tab === "banners" ? "bg-cocoa-900 text-cream" : "text-cocoa-400"}`}
        >
          {lang === "ar" ? "البانرات" : "Bannières"}
          <span className={`ms-2 px-1.5 py-0.5 rounded-full text-xs ${tab === "banners" ? "bg-gold-500" : "bg-cream-200 text-cocoa-400"}`}>
            {BANNERS.length}
          </span>
        </button>
      </div>

      {/* Categories */}
      {tab === "categories" && (
        <div className="bg-white rounded-[16px] shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-cocoa-900/8 text-xs text-cocoa-400">
            {lang === "ar" ? "اسحب لإعادة الترتيب" : "Glissez pour réordonner"}
          </div>
          <div className="divide-y divide-cocoa-900/5">
            {CATEGORIES.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-4 py-4 flex items-center gap-4 hover:bg-cream-200/30 transition-colors"
              >
                <button className="text-cocoa-300 cursor-grab hover:text-cocoa-900" aria-label="Drag">
                  <GripVertical className="w-5 h-5" />
                </button>
                <div className="text-3xl">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base">{c.ar}</div>
                  <div className="text-xs text-cocoa-400">{c.fr} · /{c.slug}</div>
                </div>
                <div className="text-xs text-cocoa-400 hidden sm:block max-w-xs truncate">
                  {c.description}
                </div>
                <Badge variant="outline">
                  {productCounts[c.id] || 0} {lang === "ar" ? "منتج" : "produits"}
                </Badge>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-cream-200" aria-label="Edit">
                    <Edit2 className="w-4 h-4 text-cocoa-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-red-50" aria-label="Delete">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Banners */}
      {tab === "banners" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BANNERS.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-[16px] shadow-soft overflow-hidden"
            >
              <div className="relative aspect-[3/1] bg-cream-200">
                <img src={b.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute top-3 end-3">
                  {b.active
                    ? <Badge variant="success">{lang === "ar" ? "نشط" : "Actif"}</Badge>
                    : <Badge variant="outline">{lang === "ar" ? "متوقّف" : "Inactif"}</Badge>}
                </div>
              </div>
              <div className="p-5">
                <div className="font-display text-lg mb-1">{b.titleAr}</div>
                <div className="text-xs text-cocoa-400 mb-4">{b.titleFr}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-cocoa-400">
                    {lang === "ar" ? "نسبة النقر" : "CTR"}: <span className="font-semibold text-cocoa-900">{b.ctr}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-cream-200" aria-label="Toggle">
                      {b.active ? <Eye className="w-4 h-4 text-cocoa-400" /> : <EyeOff className="w-4 h-4 text-cocoa-400" />}
                    </button>
                    <button className="p-2 rounded-lg hover:bg-cream-200" aria-label="Edit">
                      <Edit2 className="w-4 h-4 text-cocoa-400" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-red-50" aria-label="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add new card */}
          <button className="bg-white/50 border-2 border-dashed border-cocoa-900/15 rounded-[16px] aspect-[3/2] flex flex-col items-center justify-center gap-2 text-cocoa-400 hover:border-gold-500 hover:text-gold-700 transition-colors">
            <Image className="w-8 h-8" strokeWidth={1.2} />
            <span className="font-medium text-sm">{lang === "ar" ? "أضف بانراً جديداً" : "Nouvelle bannière"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
