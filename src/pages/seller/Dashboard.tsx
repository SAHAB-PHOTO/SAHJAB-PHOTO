import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Package, DollarSign, Star, Users, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/stores/locale";
import { formatDZD } from "@/lib/utils";
import { PRODUCTS, ORDERS } from "@/data/mock";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const revenueData = [
  { day: "السبت", value: 24500 },
  { day: "الأحد", value: 28900 },
  { day: "الإثنين", value: 19800 },
  { day: "الثلاثاء", value: 35200 },
  { day: "الأربعاء", value: 41600 },
  { day: "الخميس", value: 52800 },
  { day: "الجمعة", value: 47300 },
];

const ordersData = [
  { day: "س", value: 12 },
  { day: "ح", value: 18 },
  { day: "ن", value: 9 },
  { day: "ث", value: 24 },
  { day: "ر", value: 31 },
  { day: "خ", value: 38 },
  { day: "ج", value: 27 },
];

export default function SellerDashboard() {
  const { lang } = useLocale();
  const products = PRODUCTS.filter((p) => p.shopId === "shop-1");
  const orders = ORDERS;

  const stats = [
    { label: { ar: "إيرادات اليوم", fr: "Revenu du jour" }, value: formatDZD(47300), trend: 12.5, Icon: DollarSign },
    { label: { ar: "طلبات اليوم", fr: "Commandes" }, value: "27", trend: 8.2, Icon: ShoppingBag },
    { label: { ar: "المنتجات النشطة", fr: "Produits actifs" }, value: String(products.length), trend: 0, Icon: Package },
    { label: { ar: "متوسط التقييم", fr: "Note moyenne" }, value: "4.9", trend: 0.1, Icon: Star },
  ];

  return (
    <div className="container-editorial py-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
        <div>
          <Badge variant="verified" className="mb-3">
            ✓ {lang === "ar" ? "بائع معتمد" : "Vendeur certifié"}
          </Badge>
          <h1 className="font-display text-4xl text-cocoa-900">
            {lang === "ar" ? "مرحباً بعودتك" : "Bon retour"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {lang === "ar" ? "نظرة شاملة على أداء متجرك" : "Vue d'ensemble de votre boutique"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">{lang === "ar" ? "تقرير الأسبوع" : "Rapport hebdo"}</Button>
          <Button>{lang === "ar" ? "+ منتج جديد" : "+ Nouveau produit"}</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="bg-white rounded-[18px] p-5 lg:p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center">
                <s.Icon className="w-5 h-5 text-gold-700" strokeWidth={1.5} />
              </div>
              {s.trend !== 0 && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${s.trend > 0 ? "text-emerald" : "text-red-600"}`}>
                  {s.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(s.trend)}%
                </div>
              )}
            </div>
            <div className="font-display text-2xl lg:text-3xl text-cocoa-900">{s.value}</div>
            <div className="text-xs text-cocoa-400 mt-1">{s.label[lang]}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg">{lang === "ar" ? "الإيرادات الأسبوعية" : "Revenus de la semaine"}</h3>
              <p className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "آخر 7 أيام" : "7 derniers jours"}</p>
            </div>
            <div className="font-display text-2xl gold-text font-bold">{formatDZD(250100)}</div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A961" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" vertical={false} />
              <XAxis dataKey="day" stroke="#8A6555" fontSize={12} />
              <YAxis stroke="#8A6555" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
                formatter={(value) => formatDZD(value as number)}
              />
              <Area type="monotone" dataKey="value" stroke="#C9A961" strokeWidth={2.5} fill="url(#gold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-soft">
          <h3 className="font-display text-lg mb-1">{lang === "ar" ? "الطلبات" : "Commandes"}</h3>
          <p className="text-xs text-cocoa-400 mb-4">{lang === "ar" ? "أسبوع" : "Semaine"}</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" vertical={false} />
              <XAxis dataKey="day" stroke="#8A6555" fontSize={12} />
              <YAxis stroke="#8A6555" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
              />
              <Bar dataKey="value" fill="#C9A961" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + top products */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg">{lang === "ar" ? "آخر الطلبات" : "Dernières commandes"}</h3>
            <Button size="sm" variant="ghost">{lang === "ar" ? "عرض الكل" : "Tout voir"}</Button>
          </div>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-cream-200 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gold-500/15 flex items-center justify-center text-gold-700 font-display text-sm">
                  #{o.id.slice(-3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{o.items[0].nameAr}{o.items.length > 1 ? ` +${o.items.length - 1}` : ""}</div>
                  <div className="text-xs text-cocoa-400">{o.buyerPhone}</div>
                </div>
                <Badge variant={o.status === "delivered" ? "success" : o.status === "preparing" ? "default" : "warn"}>
                  {o.status === "delivered" ? (lang === "ar" ? "مكتمل" : "Livré") :
                   o.status === "preparing" ? (lang === "ar" ? "تحضير" : "En cours") :
                   (lang === "ar" ? "جديد" : "Nouveau")}
                </Badge>
                <div className="font-display font-bold text-sm">{formatDZD(o.total)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-soft">
          <h3 className="font-display text-lg mb-5">{lang === "ar" ? "أكثر منتج مبيعاً" : "Top produit"}</h3>
          <div className="space-y-4">
            {products.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 text-xs font-bold text-cocoa-300">#{i + 1}</span>
                <img src={p.photos[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">{p.nameAr}</div>
                  <div className="text-xs text-cocoa-400">{p.reviewCount} {lang === "ar" ? "بيع" : "ventes"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings summary */}
      <div className="mt-10 bg-cocoa-900 rounded-[20px] p-8 text-cream">
        <div className="grid lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-2">
            <Badge variant="default" className="bg-gold-500/20 border-gold-500/40 text-gold-200 mb-3">
              <DollarSign className="w-3 h-3" />
              {lang === "ar" ? "خلاصة الأرباح" : "Récap des gains"}
            </Badge>
            <h3 className="font-display text-3xl mb-2">{formatDZD(847500)}</h3>
            <p className="text-cream/60 text-sm">{lang === "ar" ? "إجمالي المبيعات هذا الشهر" : "Ventes totales du mois"}</p>
          </div>
          <div>
            <div className="text-xs text-cream/60 mb-1">{lang === "ar" ? "العمولة (10٪)" : "Commission (10%)"}</div>
            <div className="font-display text-xl">{formatDZD(84750)}</div>
          </div>
          <div>
            <div className="text-xs text-cream/60 mb-1">{lang === "ar" ? "صافي الدفعة" : "Net à recevoir"}</div>
            <div className="font-display text-xl gold-text">{formatDZD(762750)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
