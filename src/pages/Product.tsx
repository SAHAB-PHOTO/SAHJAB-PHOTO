import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Store,
  ChevronLeft,
} from "lucide-react";
import { getProduct, byCategory } from "@/data/products";
import { categories } from "@/data/categories";
import { paymentMethods } from "@/data/payments";
import { ProductImage, ProductCard } from "@/components/ProductCard";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/ui/toast";
import { arDigits, discountPct, formatDZD } from "@/lib/utils";

export default function ProductPage() {
  const { id } = useParams();
  const product = id ? getProduct(id) : undefined;
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const toast = useToast();

  if (!product) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-2xl font-black">المنتج غير موجود</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const off = discountPct(product.oldPrice ?? 0, product.price);
  const cat = categories.find((c) => c.id === product.category);
  const related = byCategory(product.category).filter((p) => p.id !== product.id);
  const liked = has(product.id);

  return (
    <div className="container-app py-5">
      {/* breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-primary">الرئيسية</Link>
        <ChevronLeft size={12} />
        {cat && (
          <>
            <Link to={`/category/${cat.id}`} className="hover:text-primary">{cat.name}</Link>
            <ChevronLeft size={12} />
          </>
        )}
        <span className="line-clamp-1 text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        {/* gallery */}
        <div>
          <ProductImage product={product} className="aspect-square rounded-2xl shadow-card" />
          <div className="mt-3 flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className={`aspect-square w-16 cursor-pointer overflow-hidden rounded-lg border-2 ${
                  n === 1 ? "border-primary" : "border-border"
                }`}
              >
                <ProductImage product={product} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.choice && <Badge tone="primary">⭐ اختيار رفيق</Badge>}
            {product.freeShipping && <Badge tone="success">توصيل مجاني</Badge>}
            {off > 0 && <Badge tone="dark">-{arDigits(off)}%</Badge>}
          </div>

          <h1 className="mt-2 text-xl font-bold leading-snug md:text-2xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <Rating value={product.rating} size={16} />
            <span className="font-bold">{product.rating}</span>
            <span className="text-muted-foreground">
              · {arDigits(product.reviews)} تقييم · تم بيع {arDigits(product.sold)}
            </span>
          </div>

          {/* price */}
          <div className="mt-4 rounded-xl bg-primary/5 p-4">
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-primary">{formatDZD(product.price)}</span>
              {product.oldPrice && (
                <span className="mb-1 text-base text-muted-foreground line-through">
                  {formatDZD(product.oldPrice)}
                </span>
              )}
              {off > 0 && (
                <span className="mb-1 rounded-md bg-primary px-2 py-0.5 text-xs font-bold text-white">
                  وفّر {formatDZD((product.oldPrice ?? 0) - product.price)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">السعر شامل الرسوم · بالدينار الجزائري</p>
          </div>

          {/* qty */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-bold">الكمية:</span>
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center hover:bg-muted" aria-label="نقص">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{arDigits(qty)}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center hover:bg-muted" aria-label="زيادة">
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              variant="solid"
              size="lg"
              className="flex-1"
              onClick={() => {
                add(product, qty);
                toast(`أُضيف ${arDigits(qty)} إلى السلة 🛒`);
              }}
            >
              <ShoppingCart size={18} /> أضف إلى السلة
            </Button>
            <Link to="/checkout" className="flex-1" onClick={() => add(product, qty)}>
              <Button size="lg" className="w-full">اشترِ الآن</Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="h-13 w-13"
              onClick={() => {
                toggle(product.id);
                toast(liked ? "أُزيل من المفضلة" : "أُضيف إلى المفضلة ❤️");
              }}
              aria-label="المفضلة"
            >
              <Heart className={liked ? "fill-primary text-primary" : ""} />
            </Button>
          </div>

          {/* guarantees */}
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { Icon: Truck, t: "توصيل 48–72 سا" },
              { Icon: RotateCcw, t: "إرجاع خلال 7 أيام" },
              { Icon: ShieldCheck, t: "دفع آمن مضمون" },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-1 rounded-lg border border-border p-2">
                <Icon size={18} className="text-secondary" /> {t}
              </div>
            ))}
          </div>

          {/* seller */}
          <Link
            to="/seller"
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition hover:shadow-card"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-muted">
              <Store size={20} className="text-primary" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">{product.store}</p>
              <p className="text-xs text-muted-foreground">بائع موثّق · ⭐ 4.8 · يرد بسرعة</p>
            </div>
            <span className="text-sm font-bold text-primary">زيارة المتجر</span>
          </Link>

          {/* payments accepted */}
          <div className="mt-4 rounded-xl border border-border p-3">
            <p className="mb-2 text-xs font-bold text-muted-foreground">طرق الدفع المتاحة لهذا المنتج</p>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethods.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* description + specs */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-lg font-black">وصف المنتج</h3>
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-lg font-black">المواصفات</h3>
          <dl className="divide-y divide-border">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between py-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-bold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-8">
          <h3 className="mb-4 text-lg font-black">منتجات مشابهة</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
