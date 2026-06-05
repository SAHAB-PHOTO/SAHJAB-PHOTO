import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { ids } = useWishlist();
  const items = products.filter((p) => ids.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <Heart className="mx-auto text-muted-foreground" size={56} />
        <h1 className="mt-4 text-2xl font-black">قائمة المفضلة فارغة</h1>
        <p className="mt-2 text-muted-foreground">أضف المنتجات التي تعجبك بالضغط على ❤️</p>
        <Link to="/"><Button size="lg" className="mt-6">تصفّح المنتجات</Button></Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-5 text-2xl font-black">المفضلة ({items.length})</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
