import { useSearchParams } from "react-router-dom";
import { searchProducts } from "@/data/products";
import { ProductListing } from "@/components/ProductListing";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const items = searchProducts(q);
  return (
    <ProductListing
      title={q ? `نتائج البحث عن: «${q}»` : "كل المنتجات"}
      subtitle={`${items.length} منتج`}
      items={items}
    />
  );
}
