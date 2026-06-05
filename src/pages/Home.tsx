import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ChevronLeft, ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";
import { categories } from "@/data/categories";
import { products, flashDeals } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Countdown } from "@/components/Countdown";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "تخفيضات الجمعة الكبرى",
    sub: "حتى -70% على آلاف المنتجات + توصيل مجاني",
    cta: "تسوّق الآن",
    bg: "from-primary via-orange-500 to-accent",
    emoji: "🔥",
  },
  {
    title: "كل وسائل الدفع الجزائرية",
    sub: "CIB · الذهبية · BaridiMob · دفع عند الاستلام",
    cta: "اكتشف",
    bg: "from-secondary via-emerald-600 to-teal-600",
    emoji: "💳",
  },
  {
    title: "توصيل سريع لكل 58 ولاية",
    sub: "اطلب اليوم، يوصلك خلال 48 إلى 72 ساعة",
    cta: "ابدأ التسوّق",
    bg: "from-indigo-600 via-violet-600 to-fuchsia-600",
    emoji: "🚚",
  },
];

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <div className="container-app pt-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.bg} p-8 text-white transition-all duration-700 md:p-12`}
        >
          <div className="relative z-10 max-w-lg">
            <span className="mb-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
              عروض حصرية اليوم
            </span>
            <h1 className="text-3xl font-black leading-tight md:text-5xl">{s.title}</h1>
            <p className="mt-3 text-base text-white/90 md:text-lg">{s.sub}</p>
            <Link to="/category/electronics">
              <Button variant="accent" size="lg" className="mt-6">
                {s.cta} <ChevronLeft size={18} />
              </Button>
            </Link>
          </div>
          <span className="pointer-events-none absolute -left-6 bottom-0 select-none text-[12rem] opacity-30 md:text-[16rem]">
            {s.emoji}
          </span>
          <div className="absolute bottom-4 right-8 flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`شريحة ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-6 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="hidden grid-rows-2 gap-3 lg:grid">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white">
            <span className="text-4xl">🎁</span>
            <div>
              <p className="text-lg font-black">قسيمة 1000 دج</p>
              <p className="text-sm text-white/90">لأول طلب — استخدم: سهجاب</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-secondary to-teal-600 p-5 text-white">
            <span className="text-4xl">📦</span>
            <div>
              <p className="text-lg font-black">دفع عند الاستلام</p>
              <p className="text-sm text-white/90">ادفع بعد ما يوصلك الطلب</p>
            </div>
          </div>
        </div>
      </div>

      {/* feature row */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { Icon: Truck, t: "توصيل لكل الولايات" },
          { Icon: CreditCard, t: "دفع آمن متعدد" },
          { Icon: ShieldCheck, t: "حماية المشتري" },
          { Icon: Headphones, t: "دعم 24/7 بالعربية" },
        ].map(({ Icon, t }) => (
          <div
            key={t}
            className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-semibold shadow-card"
          >
            <Icon size={18} className="text-primary" /> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryGrid() {
  return (
    <section className="container-app mt-8">
      <h2 className="mb-4 text-xl font-black">تسوّق حسب الفئة</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/category/${c.id}`}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-card transition hover:-translate-y-1 hover:shadow-hover"
          >
            <span
              className={`grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br ${c.color} text-2xl shadow-card transition group-hover:scale-110`}
            >
              {c.icon}
            </span>
            <span className="text-xs font-semibold leading-tight">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FlashSection() {
  const deals = flashDeals();
  return (
    <section className="container-app mt-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 gradient-brand p-4 text-white">
          <div className="flex items-center gap-2">
            <Zap className="fill-white" size={22} />
            <h2 className="text-xl font-black">عروض البرق ⚡</h2>
            <span className="text-sm text-white/90">ينتهي خلال</span>
            <Countdown />
          </div>
          <Link to="/category/electronics" className="text-sm font-bold underline-offset-4 hover:underline">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
          {deals.slice(0, 5).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="pb-8">
      <Hero />
      <CategoryGrid />
      <FlashSection />

      <section className="container-app mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">مختارة لك ✨</h2>
          <span className="text-sm text-muted-foreground">بناءً على الأكثر رواجاً في الجزائر</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
