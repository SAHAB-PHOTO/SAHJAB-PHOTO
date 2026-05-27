import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileBarChart2, FileSpreadsheet, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { formatDZD } from "@/lib/utils";
import { SHOPS } from "@/data/mock";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const wilayaData = [
  { name: "الجزائر", gmv: 14200000, orders: 4820 },
  { name: "وهران", gmv: 8900000, orders: 2410 },
  { name: "قسنطينة", gmv: 5400000, orders: 1640 },
  { name: "سطيف", gmv: 3200000, orders: 980 },
  { name: "تلمسان", gmv: 2800000, orders: 820 },
  { name: "عنابة", gmv: 1900000, orders: 540 },
];

const monthlyData = [
  { month: "ينا", gmv: 18200000, commission: 1820000 },
  { month: "فبر", gmv: 22400000, commission: 2240000 },
  { month: "مار", gmv: 28900000, commission: 2890000 },
  { month: "أبر", gmv: 31200000, commission: 3120000 },
  { month: "ماي", gmv: 38200000, commission: 3820000 },
];

function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export default function AdminReports() {
  const { lang } = useLocale();
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month");

  const exportFinancial = () => {
    const rows: (string | number)[][] = [
      ["Mois", "GMV (DZD)", "Commission (DZD)", "Vendeurs actifs", "Commandes"],
      ...monthlyData.map((m, i) => [m.month, m.gmv, m.commission, 220 + i * 6, 4800 + i * 700]),
    ];
    downloadCSV(`halawiyat-financial-${period}.csv`, rows);
  };

  const exportSellers = () => {
    const rows: (string | number)[][] = [
      ["Boutique", "Wilaya", "Ventes (DZD)", "Commission (DZD)", "Note", "Commandes"],
      ...SHOPS.map((s) => [s.nameFr, s.wilayaCode, s.totalSales * 1000, s.totalSales * 100, s.ratingAvg, s.totalSales]),
    ];
    downloadCSV(`halawiyat-sellers-${period}.csv`, rows);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
            {lang === "ar" ? "التقارير المالية" : "Rapports financiers"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {lang === "ar" ? "تحليل أداء المنصة وتصدير البيانات" : "Analyse de la performance et exports"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-[12px] p-1 shadow-soft">
          <Calendar className="w-4 h-4 text-cocoa-400 mx-2" />
          {[
            { key: "week", ar: "أسبوع", fr: "Semaine" },
            { key: "month", ar: "شهر", fr: "Mois" },
            { key: "quarter", ar: "ربع", fr: "Trimestre" },
            { key: "year", ar: "سنة", fr: "Année" },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key as any)}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                period === p.key ? "bg-cocoa-900 text-cream" : "text-cocoa-400 hover:bg-cream-200"
              }`}
            >
              {lang === "ar" ? p.ar : p.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Export quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          {
            titleAr: "تقرير مالي شامل",
            titleFr: "Rapport financier",
            descAr: "GMV، عمولات، صافي شهري",
            descFr: "GMV, commissions, net",
            onClick: exportFinancial,
            color: "from-gold-500 to-gold-700",
          },
          {
            titleAr: "أداء البائعين",
            titleFr: "Performance vendeurs",
            descAr: "مبيعات وتقييمات وعمولات",
            descFr: "Ventes, notes, commissions",
            onClick: exportSellers,
            color: "from-rose-gold to-rose-dark",
          },
          {
            titleAr: "أداء الفئات",
            titleFr: "Performance catégories",
            descAr: "حصة كل فئة من المبيعات",
            descFr: "Part de chaque catégorie",
            onClick: () => downloadCSV("categories.csv", [["Catégorie", "Part"], ["Traditionnel", "42%"], ["Moderne", "28%"]]),
            color: "from-emerald to-emerald-light",
          },
        ].map((card, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={card.onClick}
            className="text-start bg-white rounded-[16px] p-5 shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-md`}>
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div className="font-display text-base mb-1">{lang === "ar" ? card.titleAr : card.titleFr}</div>
            <div className="text-xs text-cocoa-400 mb-3">{lang === "ar" ? card.descAr : card.descFr}</div>
            <div className="flex items-center gap-1 text-xs font-medium text-gold-700 group-hover:gap-2 transition-all">
              <Download className="w-3.5 h-3.5" />
              {lang === "ar" ? "تنزيل CSV" : "Télécharger CSV"}
            </div>
          </motion.button>
        ))}
      </div>

      {/* GMV vs Commission */}
      <div className="bg-white rounded-[20px] p-6 shadow-soft mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg">{lang === "ar" ? "GMV مقابل العمولة" : "GMV vs Commission"}</h3>
            <p className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "آخر 5 أشهر" : "5 derniers mois"}</p>
          </div>
          <Badge variant="success">+18.4%</Badge>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" vertical={false} />
            <XAxis dataKey="month" stroke="#8A6555" fontSize={12} />
            <YAxis stroke="#8A6555" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => formatDZD(value as number)}
            />
            <Legend />
            <Line type="monotone" dataKey="gmv" stroke="#C9A961" strokeWidth={3} dot={{ r: 5 }} name={lang === "ar" ? "GMV" : "GMV"} />
            <Line type="monotone" dataKey="commission" stroke="#0F5132" strokeWidth={3} dot={{ r: 5 }} name={lang === "ar" ? "العمولة" : "Commission"} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Wilaya distribution */}
      <div className="bg-white rounded-[20px] p-6 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg">{lang === "ar" ? "التوزيع الجغرافي" : "Répartition par wilaya"}</h3>
            <p className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "أعلى 6 ولايات" : "Top 6 wilayas"}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={wilayaData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" horizontal={false} />
            <XAxis type="number" stroke="#8A6555" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
            <YAxis type="category" dataKey="name" stroke="#8A6555" fontSize={12} width={80} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => formatDZD(value as number)}
            />
            <Bar dataKey="gmv" fill="#C9A961" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
