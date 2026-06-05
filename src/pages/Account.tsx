import { useState } from "react";
import { User, Package, MapPin, Heart, CreditCard, LogOut, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDZD } from "@/lib/utils";

const demoOrders = [
  { id: "DZ284194", date: "2026-06-02", status: "في الطريق", total: 7400, items: 3, tone: "primary" as const },
  { id: "DZ281077", date: "2026-05-28", status: "تم التسليم", total: 2900, items: 1, tone: "success" as const },
  { id: "DZ279540", date: "2026-05-19", status: "تم التسليم", total: 12800, items: 2, tone: "success" as const },
];

const tabs = [
  { id: "orders", name: "طلباتي", Icon: Package },
  { id: "addresses", name: "عناويني", Icon: MapPin },
  { id: "wishlist", name: "المفضلة", Icon: Heart },
  { id: "payments", name: "وسائل الدفع", Icon: CreditCard },
];

export default function Account() {
  const [tab, setTab] = useState("orders");
  const [loggedIn, setLoggedIn] = useState(true);

  if (!loggedIn) {
    return (
      <div className="container-app py-14">
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-7 shadow-card">
          <h1 className="mb-1 text-center text-2xl font-black">مرحباً بعودتك</h1>
          <p className="mb-5 text-center text-sm text-muted-foreground">سجّل الدخول لمتابعة طلباتك</p>
          <input className="mb-3 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" placeholder="رقم الهاتف أو البريد" />
          <input type="password" className="mb-4 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary" placeholder="كلمة المرور" />
          <Button size="full" onClick={() => setLoggedIn(true)}>تسجيل الدخول</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            ليس لديك حساب؟ <button className="font-bold text-primary">أنشئ حساباً</button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        {/* sidebar */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <span className="grid h-12 w-12 place-items-center rounded-full gradient-brand text-white">
              <User size={22} />
            </span>
            <div>
              <p className="font-bold">أهلاً، زبوننا العزيز</p>
              <p className="text-xs text-muted-foreground">عضو ذهبي · ⭐ مشترٍ موثوق</p>
            </div>
          </div>
          <nav className="mt-3 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === t.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
              >
                <t.Icon size={17} /> {t.name}
              </button>
            ))}
            <button onClick={() => setLoggedIn(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10">
              <LogOut size={17} /> تسجيل الخروج
            </button>
          </nav>
        </aside>

        {/* content */}
        <div className="space-y-3">
          {tab === "orders" && (
            <>
              <h1 className="text-xl font-black">طلباتي</h1>
              {demoOrders.map((o) => (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
                  <div>
                    <p className="font-bold">طلب #{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.date} · {o.items} منتج</p>
                  </div>
                  <Badge tone={o.tone}>{o.status}</Badge>
                  <span className="font-black text-primary">{formatDZD(o.total)}</span>
                  <Button variant="outline" size="sm">تفاصيل الطلب</Button>
                </div>
              ))}
            </>
          )}

          {tab === "addresses" && (
            <>
              <h1 className="text-xl font-black">عناويني</h1>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 text-primary" size={20} />
                  <div className="flex-1">
                    <p className="font-bold">المنزل · الجزائر العاصمة</p>
                    <p className="text-sm text-muted-foreground">حي النصر، شارع ديدوش مراد · 0770 00 00 00</p>
                  </div>
                  <Badge tone="success">افتراضي</Badge>
                </div>
              </div>
              <Button variant="outline">+ إضافة عنوان جديد</Button>
            </>
          )}

          {tab === "wishlist" && (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Heart className="mx-auto text-primary" size={40} />
              <p className="mt-3 font-bold">منتجاتك المفضلة</p>
              <Link to="/wishlist"><Button className="mt-3">عرض قائمة المفضلة</Button></Link>
            </div>
          )}

          {tab === "payments" && (
            <>
              <h1 className="text-xl font-black">وسائل الدفع المحفوظة</h1>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div className="flex-1">
                    <p className="font-bold">بطاقة CIB •••• 4242</p>
                    <p className="text-xs text-muted-foreground">عبر بوابة SATIM المؤمّنة</p>
                  </div>
                  <Star size={16} className="fill-accent text-accent" />
                </div>
              </div>
              <Button variant="outline">+ إضافة وسيلة دفع</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
