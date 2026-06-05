import { TrendingUp, Package, DollarSign, Users, Plus, Eye } from "lucide-react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/ProductCard";
import { formatDZD, arDigits } from "@/lib/utils";

const stats = [
  { Icon: DollarSign, label: "مبيعات الشهر", value: formatDZD(842500), trend: "+18%", color: "from-primary to-orange-500" },
  { Icon: Package, label: "الطلبات", value: arDigits(312), trend: "+9%", color: "from-secondary to-teal-600" },
  { Icon: Users, label: "الزوّار", value: arDigits(15800), trend: "+24%", color: "from-violet-500 to-fuchsia-600" },
  { Icon: TrendingUp, label: "معدل التحويل", value: "3.4%", trend: "+0.6%", color: "from-sky-500 to-blue-600" },
];

export default function Seller() {
  return (
    <div className="container-app py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">لوحة تحكم البائع 🏪</h1>
          <p className="text-sm text-muted-foreground">أهلاً بك في مركز إدارة متجرك على RafikExpress</p>
        </div>
        <Button><Plus size={18} /> أضف منتجاً جديداً</Button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-card`}>
            <div className="flex items-center justify-between">
              <s.Icon size={22} className="opacity-90" />
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold">{s.trend}</span>
            </div>
            <p className="mt-3 text-2xl font-black">{s.value}</p>
            <p className="text-sm text-white/90">{s.label}</p>
          </div>
        ))}
      </div>

      {/* mini chart */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-black">مبيعات آخر 7 أيام</h2>
        <div className="flex h-40 items-end gap-3">
          {[45, 60, 38, 72, 55, 88, 67].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t-lg gradient-brand transition-all hover:opacity-80" style={{ height: `${h}%` }} />
              <span className="text-xs text-muted-foreground">{["سبت", "أحد", "إثن", "ثلا", "أرب", "خمي", "جمع"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* products table */}
      <div className="mt-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-black">منتجاتي</h2>
        <div className="space-y-2">
          {products.slice(0, 6).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <ProductImage product={p} className="h-12 w-12 rounded-lg" />
              <span className="line-clamp-1 flex-1 text-sm font-semibold">{p.name}</span>
              <span className="hidden text-sm font-bold text-primary sm:block">{formatDZD(p.price)}</span>
              <Badge tone="success">متوفر</Badge>
              <span className="hidden text-xs text-muted-foreground md:block">بيع {arDigits(p.sold)}</span>
              <Button variant="ghost" size="icon" aria-label="عرض"><Eye size={16} /></Button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 rounded-2xl gradient-brand p-6 text-center text-white">
        <h3 className="text-xl font-black">ابدأ البيع على RafikExpress اليوم</h3>
        <p className="mt-1 text-sm text-white/90">انضم لآلاف التجار الجزائريين · عمولة منخفضة · دفع أسبوعي · دعم كامل</p>
        <Button variant="accent" size="lg" className="mt-4">سجّل متجرك مجاناً</Button>
      </div>
    </div>
  );
}
