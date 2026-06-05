import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

type Sort = "relevance" | "price-asc" | "price-desc" | "rating" | "sold";

const sortLabels: Record<Sort, string> = {
  relevance: "الأكثر صلة",
  "price-asc": "السعر: الأقل أولاً",
  "price-desc": "السعر: الأعلى أولاً",
  rating: "الأعلى تقييماً",
  sold: "الأكثر مبيعاً",
};

export function ProductListing({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: Product[];
}) {
  const [sort, setSort] = useState<Sort>("relevance");
  const [freeOnly, setFreeOnly] = useState(false);

  const list = useMemo(() => {
    let r = freeOnly ? items.filter((p) => p.freeShipping) : [...items];
    switch (sort) {
      case "price-asc":
        r.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        r.sort((a, b) => b.rating - a.rating);
        break;
      case "sold":
        r.sort((a, b) => b.sold - a.sold);
        break;
    }
    return r;
  }, [items, sort, freeOnly]);

  return (
    <div className="container-app py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-black">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        <span className="inline-flex items-center gap-1 text-sm font-bold">
          <SlidersHorizontal size={16} /> الترتيب
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none"
        >
          {Object.entries(sortLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={(e) => setFreeOnly(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          توصيل مجاني فقط
        </label>
        <span className="mr-auto text-sm text-muted-foreground">{list.length} منتج</span>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-3 text-lg font-bold">لا توجد منتجات مطابقة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
