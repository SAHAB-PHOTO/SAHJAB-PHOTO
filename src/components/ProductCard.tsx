import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import { cn, discountPct, formatDZD, arDigits } from "@/lib/utils";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/toast";

export function ProductImage({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        product.gradient,
        className,
      )}
    >
      <span className="select-none text-[5rem] drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
        {product.emoji}
      </span>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();
  const off = discountPct(product.oldPrice ?? 0, product.price);
  const liked = has(product.id);

  return (
    <div className="group animate-fade-in relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-hover">
      <Link to={`/product/${product.id}`} className="relative block">
        <ProductImage product={product} className="aspect-square" />
        <div className="absolute right-2 top-2 flex flex-col gap-1">
          {off > 0 && <Badge tone="dark">-{arDigits(off)}%</Badge>}
          {product.choice && <Badge tone="primary">اختيار سهجاب</Badge>}
        </div>
      </Link>

      <button
        onClick={() => {
          toggle(product.id);
          toast(liked ? "أُزيل من المفضلة" : "أُضيف إلى المفضلة ❤️");
        }}
        aria-label="المفضلة"
        className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-card/90 shadow-card backdrop-blur transition hover:scale-110"
      >
        <Heart size={16} className={liked ? "fill-primary text-primary" : "text-muted-foreground"} />
      </button>

      <div className="flex flex-1 flex-col p-3">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-1.5">
          <Rating value={product.rating} />
          <span className="text-xs text-muted-foreground">
            ({arDigits(product.reviews)}) · بيع {arDigits(product.sold)}
          </span>
        </div>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-extrabold text-primary">{formatDZD(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatDZD(product.oldPrice)}
            </span>
          )}
        </div>

        {product.freeShipping && (
          <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-success">
            <Truck size={13} /> توصيل مجاني
          </div>
        )}

        <button
          onClick={() => {
            add(product);
            toast("أُضيف إلى السلة 🛒");
          }}
          className="mt-3 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg gradient-brand text-xs font-bold text-primary-foreground opacity-0 transition-all group-hover:opacity-100"
        >
          <ShoppingCart size={15} /> أضف إلى السلة
        </button>
      </div>
    </div>
  );
}
