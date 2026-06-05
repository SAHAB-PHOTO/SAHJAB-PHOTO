import { useParams } from "react-router-dom";
import { byCategory } from "@/data/products";
import { categories } from "@/data/categories";
import { ProductListing } from "@/components/ProductListing";

export default function CategoryPage() {
  const { id } = useParams();
  const cat = categories.find((c) => c.id === id);
  const items = id ? byCategory(id) : [];
  return (
    <ProductListing
      title={cat ? `${cat.icon} ${cat.name}` : "الفئة"}
      subtitle="أفضل المنتجات بأسعار تنافسية مع توصيل لكل الولايات"
      items={items}
    />
  );
}
