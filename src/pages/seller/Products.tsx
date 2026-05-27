import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit2, Eye, EyeOff, Trash2, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/data/mock";
import { CATEGORIES } from "@/data/categories";
import { useLocale } from "@/stores/locale";
import { formatDZD, cn } from "@/lib/utils";

export default function SellerProducts() {
  const { lang } = useLocale();
  const [search, setSearch] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "out">("all");

  const products = PRODUCTS.filter((p) => p.shopId === "shop-1");
  const filtered = products.filter((p) => {
    const matchesSearch = p.nameAr.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && p.active && p.stock > 0) ||
      (filter === "out" && p.stock === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
            {lang === "ar" ? "إدارة المنتجات" : "Mes produits"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {products.length} {lang === "ar" ? "منتج في كتالوجك" : "produits dans votre catalogue"}
          </p>
        </div>
        <Button onClick={() => setShowDrawer(true)}>
          <Plus className="w-4 h-4" />
          {lang === "ar" ? "أضف منتجاً" : "Nouveau produit"}
        </Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: { ar: "إجمالي المنتجات", fr: "Total" }, value: products.length },
          { label: { ar: "نشطة", fr: "Actifs" }, value: products.filter((p) => p.active && p.stock > 0).length },
          { label: { ar: "نفذت الكمية", fr: "Rupture" }, value: products.filter((p) => p.stock === 0).length },
          { label: { ar: "مميّزة", fr: "Mis en avant" }, value: products.filter((p) => p.featured).length },
        ].map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-[14px] shadow-soft">
            <div className="text-xs text-cocoa-400 mb-1">{s.label[lang]}</div>
            <div className="font-display text-2xl text-cocoa-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-[16px] shadow-soft mb-4 p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-cocoa-300" />
          <Input
            placeholder={lang === "ar" ? "ابحث عن منتج..." : "Rechercher un produit..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>
        <div className="flex gap-1 bg-cream-200 rounded-[12px] p-1">
          {[
            { key: "all", ar: "الكل", fr: "Tous" },
            { key: "active", ar: "نشطة", fr: "Actifs" },
            { key: "out", ar: "نفذت", fr: "Rupture" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                filter === f.key ? "bg-white shadow-sm text-cocoa-900" : "text-cocoa-400"
              )}
            >
              {lang === "ar" ? f.ar : f.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-[16px] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-cocoa-300 border-b border-cocoa-900/8 bg-cream-200/40">
                <th className="text-start p-4">{lang === "ar" ? "المنتج" : "Produit"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الفئة" : "Catégorie"}</th>
                <th className="text-start p-4">{lang === "ar" ? "السعر" : "Prix"}</th>
                <th className="text-start p-4">{lang === "ar" ? "المخزون" : "Stock"}</th>
                <th className="text-start p-4">{lang === "ar" ? "التقييم" : "Note"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الحالة" : "Statut"}</th>
                <th className="text-end p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const cat = CATEGORIES.find((c) => c.id === p.categoryId);
                return (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="border-b border-cocoa-900/5 hover:bg-cream-200/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.photos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{p.nameAr}</div>
                          {p.featured && (
                            <Badge variant="default" className="mt-1 text-[10px] py-0">✦ مميّز</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-cocoa-400">
                      <span className="me-1">{cat?.icon}</span>
                      {cat?.[lang]}
                    </td>
                    <td className="p-4 font-display font-bold gold-text">{formatDZD(p.priceDzd)}</td>
                    <td className="p-4">
                      <span className={cn("font-medium", p.stock === 0 && "text-red-600", p.stock > 0 && p.stock < 5 && "text-amber-600")}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                        <span className="font-semibold">{p.ratingAvg}</span>
                        <span className="text-cocoa-300">({p.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {p.stock === 0
                        ? <Badge variant="warn">{lang === "ar" ? "نفذت" : "Rupture"}</Badge>
                        : p.active
                        ? <Badge variant="success">{lang === "ar" ? "نشط" : "Actif"}</Badge>
                        : <Badge variant="outline">{lang === "ar" ? "مخفي" : "Masqué"}</Badge>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button className="p-2 rounded-lg hover:bg-cream-200" aria-label="Edit">
                          <Edit2 className="w-4 h-4 text-cocoa-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-cream-200" aria-label="Toggle">
                          {p.active ? <Eye className="w-4 h-4 text-cocoa-400" /> : <EyeOff className="w-4 h-4 text-cocoa-400" />}
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50" aria-label="Delete">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-cocoa-300 mx-auto mb-3" strokeWidth={1.2} />
            <p className="text-cocoa-400">{lang === "ar" ? "لا توجد منتجات مطابقة" : "Aucun produit correspondant"}</p>
          </div>
        )}
      </div>

      {/* Side drawer for add product */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-cocoa-900/50 backdrop-blur-sm" onClick={() => setShowDrawer(false)}>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute inset-y-0 start-0 w-full max-w-xl bg-cream overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-cream border-b border-cocoa-900/8 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="font-display text-xl">{lang === "ar" ? "منتج جديد" : "Nouveau produit"}</h2>
              <button onClick={() => setShowDrawer(false)} className="text-cocoa-400 hover:text-cocoa-900">✕</button>
            </div>
            <form className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium block mb-2">{lang === "ar" ? "اسم المنتج (عربي)" : "Nom (AR)"}</label>
                <Input placeholder="بقلاوة قسنطينية" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{lang === "ar" ? "اسم المنتج (فرنسي)" : "Nom (FR)"}</label>
                <Input placeholder="Baklawa Constantine" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{lang === "ar" ? "الوصف" : "Description"}</label>
                <textarea rows={4} className="w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 py-3 text-base" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">{lang === "ar" ? "السعر (دج)" : "Prix (DZD)"}</label>
                  <Input type="number" placeholder="4200" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">{lang === "ar" ? "المخزون" : "Stock"}</label>
                  <Input type="number" placeholder="20" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{lang === "ar" ? "الفئة" : "Catégorie"}</label>
                <select className="flex h-12 w-full rounded-[14px] border border-cocoa-900/10 px-4">
                  {CATEGORIES.map((c) => <option key={c.id}>{lang === "ar" ? c.ar : c.fr}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{lang === "ar" ? "الصور" : "Photos"}</label>
                <div className="border-2 border-dashed border-cocoa-900/15 rounded-[14px] p-8 text-center cursor-pointer hover:border-gold-500 transition-colors">
                  <Plus className="w-8 h-8 text-cocoa-300 mx-auto mb-2" />
                  <div className="text-sm text-cocoa-400">
                    {lang === "ar" ? "اسحب الصور أو اضغط للاختيار" : "Glissez ou cliquez"}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">{lang === "ar" ? "وقت التحضير (ساعة)" : "Préparation (h)"}</label>
                  <Input type="number" placeholder="12" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">{lang === "ar" ? "نشر فوراً" : "Publier"}</label>
                  <label className="flex items-center gap-2 h-12">
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-gold-500" />
                    <span className="text-sm">{lang === "ar" ? "نعم" : "Oui"}</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-cocoa-900/8">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowDrawer(false)}>
                  {lang === "ar" ? "إلغاء" : "Annuler"}
                </Button>
                <Button type="submit" className="flex-1">
                  {lang === "ar" ? "حفظ المنتج" : "Enregistrer"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
