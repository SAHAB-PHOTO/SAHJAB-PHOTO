import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Grid3x3, List, Star } from "lucide-react";
import { PRODUCTS } from "@/data/mock";
import { CATEGORIES } from "@/data/categories";
import { WILAYAS } from "@/data/wilayas";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { cn, formatDZD } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const { lang } = useLocale();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const selectedCategory = params.get("category") || "";
  const selectedWilaya = params.get("wilaya") || "";
  const minPrice = Number(params.get("min") || 0);
  const maxPrice = Number(params.get("max") || 50000);
  const minRating = Number(params.get("rating") || 0);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (selectedCategory) {
        const cat = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (cat && p.categoryId !== cat.id) return false;
      }
      if (p.priceDzd < minPrice || p.priceDzd > maxPrice) return false;
      if (p.ratingAvg < minRating) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceDzd - b.priceDzd);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceDzd - a.priceDzd);
    if (sort === "rating") list = [...list].sort((a, b) => b.ratingAvg - a.ratingAvg);
    if (sort === "featured")
      list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

    return list;
  }, [selectedCategory, selectedWilaya, minPrice, maxPrice, minRating, sort]);

  const FiltersSidebar = () => (
    <div className="space-y-7">
      <div>
        <h3 className="font-display text-base mb-4 flex items-center justify-between">
          {lang === "ar" ? "الفئة" : "Catégorie"}
          {selectedCategory && (
            <button onClick={() => setParam("category", "")} className="text-xs text-gold-700">
              {lang === "ar" ? "إزالة" : "Effacer"}
            </button>
          )}
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="cat"
                checked={selectedCategory === c.slug}
                onChange={() => setParam("category", c.slug)}
                className="w-4 h-4 accent-gold-500"
              />
              <span className="text-sm text-cocoa-900 group-hover:text-gold-700 transition-colors">
                {lang === "ar" ? c.ar : c.fr}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-cocoa-900/8" />

      <div>
        <h3 className="font-display text-base mb-4">{lang === "ar" ? "الولاية" : "Wilaya"}</h3>
        <select
          value={selectedWilaya}
          onChange={(e) => setParam("wilaya", e.target.value)}
          className="w-full h-11 rounded-[12px] border border-cocoa-900/10 bg-white px-3 text-sm focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
        >
          <option value="">{lang === "ar" ? "كل الولايات" : "Toutes les wilayas"}</option>
          {WILAYAS.map((w) => (
            <option key={w.code} value={w.code}>
              {lang === "ar" ? w.ar : w.fr}
            </option>
          ))}
        </select>
      </div>

      <div className="h-px bg-cocoa-900/8" />

      <div>
        <h3 className="font-display text-base mb-4">{lang === "ar" ? "السعر" : "Prix"}</h3>
        <div className="flex items-center gap-3 mb-3">
          <input
            type="number"
            placeholder={lang === "ar" ? "من" : "Min"}
            value={minPrice || ""}
            onChange={(e) => setParam("min", e.target.value)}
            className="flex-1 h-11 rounded-[12px] border border-cocoa-900/10 px-3 text-sm"
          />
          <span className="text-cocoa-300">—</span>
          <input
            type="number"
            placeholder={lang === "ar" ? "إلى" : "Max"}
            value={maxPrice === 50000 ? "" : maxPrice}
            onChange={(e) => setParam("max", e.target.value)}
            className="flex-1 h-11 rounded-[12px] border border-cocoa-900/10 px-3 text-sm"
          />
        </div>
        <div className="text-xs text-cocoa-400">
          {formatDZD(minPrice)} – {maxPrice === 50000 ? "∞" : formatDZD(maxPrice)}
        </div>
      </div>

      <div className="h-px bg-cocoa-900/8" />

      <div>
        <h3 className="font-display text-base mb-4">{lang === "ar" ? "التقييم" : "Note"}</h3>
        <div className="space-y-2">
          {[5, 4, 3, 0].map((r) => (
            <label key={r} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setParam("rating", r ? String(r) : "")}
                className="w-4 h-4 accent-gold-500"
              />
              <span className="text-sm flex items-center gap-1">
                {r > 0 ? (
                  <>
                    {[...Array(r)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                    ))}
                    {lang === "ar" ? " وما فوق" : " et plus"}
                  </>
                ) : lang === "ar" ? "كل التقييمات" : "Toutes les notes"}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => setParams(new URLSearchParams())}
        className="w-full"
      >
        {lang === "ar" ? "إعادة تعيين الفلاتر" : "Réinitialiser"}
      </Button>
    </div>
  );

  return (
    <div className="container-editorial py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl lg:text-5xl text-cocoa-900 mb-3">
          {lang === "ar" ? "تصفّح المجموعة" : "Notre collection"}
        </h1>
        <p className="text-cocoa-400">
          {lang === "ar"
            ? `${products.length} منتج من أمهر بائعينا`
            : `${products.length} créations de nos artisans`}
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 bg-white rounded-[20px] p-6 shadow-soft border border-cocoa-900/5">
            <FiltersSidebar />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
            <button
              onClick={() => setMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 h-11 border border-cocoa-900/10 rounded-[12px] text-sm font-medium bg-white"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {lang === "ar" ? "تصفية" : "Filtres"}
            </button>

            <div className="flex items-center gap-2 me-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-11 px-4 rounded-[12px] border border-cocoa-900/10 text-sm bg-white"
              >
                <option value="featured">{lang === "ar" ? "الأكثر تميّزاً" : "Mis en avant"}</option>
                <option value="rating">{lang === "ar" ? "الأعلى تقييماً" : "Mieux notés"}</option>
                <option value="price-asc">{lang === "ar" ? "السعر: من الأقل" : "Prix: croissant"}</option>
                <option value="price-desc">{lang === "ar" ? "السعر: من الأعلى" : "Prix: décroissant"}</option>
                <option value="newest">{lang === "ar" ? "الأحدث" : "Nouveautés"}</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white border border-cocoa-900/10 rounded-[12px] p-1">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === "grid" ? "bg-cocoa-900 text-cream" : "text-cocoa-400"
                )}
                aria-label="Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === "list" ? "bg-cocoa-900 text-cream" : "text-cocoa-400"
                )}
                aria-label="List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedCategory || selectedWilaya || minRating > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <Badge variant="default" className="gap-1 cursor-pointer" onClick={() => setParam("category", "")}>
                  {CATEGORIES.find((c) => c.slug === selectedCategory)?.[lang]}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {selectedWilaya && (
                <Badge variant="default" className="gap-1 cursor-pointer" onClick={() => setParam("wilaya", "")}>
                  {WILAYAS.find((w) => w.code === Number(selectedWilaya))?.[lang]}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {minRating > 0 && (
                <Badge variant="default" className="gap-1 cursor-pointer" onClick={() => setParam("rating", "")}>
                  {minRating}★ {lang === "ar" ? "وما فوق" : "et plus"}
                  <X className="w-3 h-3" />
                </Badge>
              )}
            </div>
          )}

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[20px]">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-display text-xl mb-2">
                {lang === "ar" ? "لا توجد نتائج" : "Aucun résultat"}
              </h3>
              <p className="text-cocoa-400">
                {lang === "ar" ? "جرّب تعديل الفلاتر" : "Essayez d'ajuster vos filtres"}
              </p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((p, i) => (
                <motion.a
                  key={p.id}
                  href={`/product/${p.id}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex bg-white rounded-[14px] overflow-hidden shadow-soft hover:shadow-elevated transition-shadow"
                >
                  <img src={p.photos[0]} alt={p.nameAr} className="w-32 sm:w-48 aspect-square object-cover" />
                  <div className="flex-1 p-5 flex flex-col gap-2 justify-center">
                    <h3 className="font-display text-lg text-cocoa-900">{p.nameAr}</h3>
                    <p className="text-sm text-cocoa-400 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                        <span className="font-semibold">{p.ratingAvg}</span>
                        <span className="text-cocoa-300">({p.reviewCount})</span>
                      </div>
                      <span className="font-display gold-text text-lg font-bold">
                        {formatDZD(p.priceDzd)}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-cocoa-900/50 backdrop-blur-sm" onClick={() => setMobileFilters(false)}>
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            className="absolute inset-y-0 right-0 w-full max-w-sm bg-cream overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl">{lang === "ar" ? "تصفية" : "Filtres"}</h2>
              <button onClick={() => setMobileFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <FiltersSidebar />
          </motion.div>
        </div>
      )}
    </div>
  );
}
