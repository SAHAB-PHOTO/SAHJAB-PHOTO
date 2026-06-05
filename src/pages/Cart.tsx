import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ProductImage } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { arDigits, formatDZD } from "@/lib/utils";

const FREE_SHIP_THRESHOLD = 5000;

export default function CartPage() {
  const { items, subtotal, setQty, remove, count } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(false);

  const discount = applied ? 1000 : 0;
  const shipping = subtotal >= FREE_SHIP_THRESHOLD || subtotal === 0 ? 0 : 400;
  const total = Math.max(0, subtotal - discount) + shipping;

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-4 text-2xl font-black">سلتك فارغة</h1>
        <p className="mt-2 text-muted-foreground">ابدأ التسوّق واكتشف آلاف العروض!</p>
        <Link to="/">
          <Button size="lg" className="mt-6">
            <ShoppingBag size={18} /> تصفّح المنتجات
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="mb-5 text-2xl font-black">سلة التسوّق ({arDigits(count)})</h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_350px]">
        <div className="space-y-3">
          {/* free shipping progress */}
          <div className="rounded-xl border border-border bg-card p-4">
            {shipping === 0 ? (
              <p className="text-sm font-bold text-success">🎉 رائع! حصلت على توصيل مجاني</p>
            ) : (
              <p className="text-sm">
                أضف <b className="text-primary">{formatDZD(FREE_SHIP_THRESHOLD - subtotal)}</b> أخرى
                للحصول على <b>توصيل مجاني</b>
              </p>
            )}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full gradient-brand transition-all"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>

          {items.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              <Link to={`/product/${product.id}`}>
                <ProductImage product={product} className="h-24 w-24 shrink-0 rounded-lg" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">
                  {product.name}
                </Link>
                <span className="mt-1 text-xs text-muted-foreground">{product.store}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-border">
                    <button onClick={() => setQty(product.id, qty - 1)} className="grid h-8 w-8 place-items-center hover:bg-muted" aria-label="نقص">
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{arDigits(qty)}</span>
                    <button onClick={() => setQty(product.id, qty + 1)} className="grid h-8 w-8 place-items-center hover:bg-muted" aria-label="زيادة">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-primary">{formatDZD(product.price * qty)}</span>
                    <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="حذف">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* summary */}
        <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28">
          <h2 className="text-lg font-black">ملخص الطلب</h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="رمز القسيمة (سهجاب)"
                className="h-10 w-full rounded-lg border border-border bg-background pr-9 pl-3 text-sm outline-none"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setApplied(coupon.trim().toLowerCase() === "سهجاب" || coupon.trim().toLowerCase() === "sahjab")}
            >
              تطبيق
            </Button>
          </div>
          {applied && <p className="text-xs font-bold text-success">✓ تم تطبيق خصم 1000 دج</p>}

          <dl className="space-y-2 border-t border-border pt-3 text-sm">
            <Row label="المجموع الفرعي" value={formatDZD(subtotal)} />
            {discount > 0 && <Row label="الخصم" value={`- ${formatDZD(discount)}`} accent />}
            <Row label="التوصيل" value={shipping === 0 ? "مجاني" : formatDZD(shipping)} />
          </dl>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="text-2xl font-black text-primary">{formatDZD(total)}</span>
          </div>

          <Link to="/checkout">
            <Button size="full" className="mt-1">متابعة الدفع ←</Button>
          </Link>
          <Link to="/" className="block text-center text-sm text-primary hover:underline">
            مواصلة التسوّق
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-bold text-success" : "font-semibold"}>{value}</dd>
    </div>
  );
}
