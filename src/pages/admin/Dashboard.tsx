import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, Users, DollarSign, AlertCircle, Check, X, Download, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/stores/locale";
import { formatDZD } from "@/lib/utils";
import { SHOPS } from "@/data/mock";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const gmvData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  value: 800000 + Math.random() * 500000 + i * 30000,
}));

const categoryShare = [
  { name: "تقليدية", value: 42, color: "#C9A961" },
  { name: "عصرية", value: 28, color: "#B76E79" },
  { name: "كيك", value: 18, color: "#0F5132" },
  { name: "شوكولاتة", value: 12, color: "#2B1810" },
];

export default function AdminDashboard() {
  const { lang } = useLocale();

  const stats = [
    { label: { ar: "إجمالي المبيعات (GMV)", fr: "GMV mensuel" }, value: formatDZD(38200000), trend: 18.4, Icon: TrendingUp },
    { label: { ar: "العمولة المحققة", fr: "Commissions" }, value: formatDZD(3820000), trend: 18.4, Icon: DollarSign },
    { label: { ar: "بائعون نشطون", fr: "Vendeurs actifs" }, value: "247", trend: 6.2, Icon: Users },
    { label: { ar: "طلبات اليوم", fr: "Commandes" }, value: "1,284", trend: 12.7, Icon: ShoppingBag },
  ];

  const pendingShops = [
    { id: "s-new-1", name: "حلويات الذواقة", wilaya: "وهران", date: "اليوم" },
    { id: "s-new-2", name: "بيت الحلوى التلمساني", wilaya: "تلمسان", date: "أمس" },
    { id: "s-new-3", name: "أتيليه نسرين", wilaya: "الجزائر", date: "منذ يومين" },
  ];

  return (
    <div className="container-editorial py-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-4">
        <div>
          <Badge variant="cocoa" className="mb-3">
            <Shield className="w-3 h-3" />
            {lang === "ar" ? "لوحة الإدارة" : "Administration"}
          </Badge>
          <h1 className="font-display text-4xl text-cocoa-900">
            {lang === "ar" ? "نظرة شاملة" : "Vue d'ensemble"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {lang === "ar" ? "أرقام المنصة لشهر مايو 2026" : "Indicateurs · Mai 2026"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4" />
            {lang === "ar" ? "تصدير CSV" : "Export CSV"}
          </Button>
          <Button>{lang === "ar" ? "تقرير شهري" : "Rapport mensuel"}</Button>
        </div>
      </div>

      {/* KPIs */}
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
              <Badge variant="success">+{s.trend}%</Badge>
            </div>
            <div className="font-display text-xl lg:text-2xl text-cocoa-900">{s.value}</div>
            <div className="text-xs text-cocoa-400 mt-1">{s.label[lang]}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white rounded-[20px] p-6 shadow-soft">
          <h3 className="font-display text-lg mb-1">{lang === "ar" ? "GMV اليومي" : "GMV quotidien"}</h3>
          <p className="text-xs text-cocoa-400 mb-4">{lang === "ar" ? "آخر 30 يوماً" : "30 derniers jours"}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={gmvData}>
              <defs>
                <linearGradient id="goldarea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A961" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" vertical={false} />
              <XAxis dataKey="day" stroke="#8A6555" fontSize={11} />
              <YAxis stroke="#8A6555" fontSize={11} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
                formatter={(value) => formatDZD(value as number)}
              />
              <Area type="monotone" dataKey="value" stroke="#C9A961" strokeWidth={2} fill="url(#goldarea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[20px] p-6 shadow-soft">
          <h3 className="font-display text-lg mb-4">{lang === "ar" ? "نسبة المبيعات بالفئة" : "Ventes par catégorie"}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryShare} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={80} paddingAngle={3}>
                {categoryShare.map((c) => <Cell key={c.name} fill={c.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryShare.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm" style={{ background: c.color }} />
                  <span>{c.name}</span>
                </div>
                <span className="font-semibold">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending sellers + commission rate */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-[20px] p-6 shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-lg">{lang === "ar" ? "بائعون في انتظار الموافقة" : "Vendeurs en attente"}</h3>
              <p className="text-xs text-cocoa-400 mt-1">{pendingShops.length} {lang === "ar" ? "طلب" : "demandes"}</p>
            </div>
            <Badge variant="warn">{pendingShops.length}</Badge>
          </div>
          <div className="space-y-3">
            {pendingShops.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-[12px] bg-cream-200">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-display text-gold-700">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-cocoa-400">{s.wilaya} · {s.date}</div>
                </div>
                <button className="w-9 h-9 rounded-full bg-emerald text-white flex items-center justify-center hover:scale-105 transition-transform">
                  <Check className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-full bg-red-600/10 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cocoa-900 rounded-[20px] p-6 text-cream">
          <h3 className="font-display text-lg mb-1">{lang === "ar" ? "إعدادات العمولة" : "Taux de commission"}</h3>
          <p className="text-xs text-cream/60 mb-6">{lang === "ar" ? "النسبة المُطبقة على كل الطلبات" : "Appliqué à toutes les commandes"}</p>

          <div className="bg-cream/5 rounded-[16px] p-6 mb-5">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-5xl gold-text font-bold">10</span>
              <span className="text-2xl text-cream/60">%</span>
            </div>
            <p className="text-xs text-cream/50">{lang === "ar" ? "النسبة الافتراضية" : "Taux par défaut"}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cream/60">{lang === "ar" ? "تقليدية" : "Traditionnel"}</span><span>10%</span></div>
            <div className="flex justify-between"><span className="text-cream/60">{lang === "ar" ? "كيك مناسبات" : "Gâteaux"}</span><span>8%</span></div>
            <div className="flex justify-between"><span className="text-cream/60">{lang === "ar" ? "شوكولاتة" : "Chocolat"}</span><span>12%</span></div>
          </div>

          <Button variant="default" className="w-full mt-6 bg-gold-gradient">
            {lang === "ar" ? "تعديل النسب" : "Modifier"}
          </Button>
        </div>
      </div>

      {/* Top sellers */}
      <div className="bg-white rounded-[20px] p-6 shadow-soft">
        <h3 className="font-display text-lg mb-5">{lang === "ar" ? "أفضل البائعين هذا الشهر" : "Top vendeurs du mois"}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-cocoa-300 border-b border-cocoa-900/8">
                <th className="text-start py-3">#</th>
                <th className="text-start py-3">{lang === "ar" ? "المتجر" : "Boutique"}</th>
                <th className="text-start py-3">{lang === "ar" ? "الولاية" : "Wilaya"}</th>
                <th className="text-start py-3">{lang === "ar" ? "المبيعات" : "Ventes"}</th>
                <th className="text-start py-3">{lang === "ar" ? "العمولة" : "Commission"}</th>
                <th className="text-start py-3">{lang === "ar" ? "التقييم" : "Note"}</th>
              </tr>
            </thead>
            <tbody>
              {SHOPS.slice(0, 5).map((shop, i) => (
                <tr key={shop.id} className="border-b border-cocoa-900/5 hover:bg-cream-200/50 transition-colors">
                  <td className="py-4 text-cocoa-300 font-bold">{i + 1}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img src={shop.logoUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-medium">{shop.nameAr}</span>
                      {shop.verified && <Check className="w-3.5 h-3.5 text-emerald" />}
                    </div>
                  </td>
                  <td className="py-4 text-cocoa-400">{shop.wilayaCode}</td>
                  <td className="py-4 font-display font-bold">{formatDZD(shop.totalSales * 1000)}</td>
                  <td className="py-4 text-gold-700">{formatDZD(shop.totalSales * 100)}</td>
                  <td className="py-4">{shop.ratingAvg}★</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
