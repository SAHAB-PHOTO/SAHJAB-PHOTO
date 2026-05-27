import { motion } from "framer-motion";
import { Download, TrendingUp, ArrowDownToLine, Wallet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/stores/locale";
import { formatDZD, formatDate } from "@/lib/utils";

const monthlyData = [
  { month: "يناير", gross: 542000, net: 487800 },
  { month: "فبراير", gross: 612400, net: 551160 },
  { month: "مارس", gross: 718900, net: 647010 },
  { month: "أبريل", gross: 685200, net: 616680 },
  { month: "مايو", gross: 847500, net: 762750 },
];

const PAYOUTS = [
  { id: "PAY-2026-018", period: { start: "2026-05-19", end: "2026-05-25" }, gross: 215400, commission: 21540, net: 193860, status: "paid" },
  { id: "PAY-2026-017", period: { start: "2026-05-12", end: "2026-05-18" }, gross: 198300, commission: 19830, net: 178470, status: "paid" },
  { id: "PAY-2026-016", period: { start: "2026-05-05", end: "2026-05-11" }, gross: 224700, commission: 22470, net: 202230, status: "paid" },
  { id: "PAY-2026-019", period: { start: "2026-05-26", end: "2026-06-01" }, gross: 209100, commission: 20910, net: 188190, status: "pending" },
];

export default function SellerEarnings() {
  const { lang } = useLocale();
  const totalGross = monthlyData.reduce((s, m) => s + m.gross, 0);
  const totalCommission = totalGross * 0.1;
  const totalNet = totalGross - totalCommission;

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
            {lang === "ar" ? "أرباحي" : "Mes gains"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {lang === "ar" ? "تفاصيل الإيرادات والعمولات والدفعات" : "Détail des revenus, commissions et paiements"}
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4" />
          {lang === "ar" ? "تصدير CSV" : "Export CSV"}
        </Button>
      </div>

      {/* Hero earning cards */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-cocoa-900 rounded-[20px] p-8 text-cream relative overflow-hidden"
        >
          <div className="absolute -top-10 -end-10 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl" />
          <Badge variant="default" className="bg-gold-500/20 border-gold-500/40 text-gold-200 mb-4">
            <Wallet className="w-3 h-3" />
            {lang === "ar" ? "إجمالي الأرباح" : "Gains totaux"}
          </Badge>
          <div className="font-display text-5xl gold-text font-bold mb-2">{formatDZD(totalNet)}</div>
          <p className="text-cream/60 text-sm mb-6">
            {lang === "ar" ? "5 أشهر · بعد خصم العمولة" : "5 mois · net de commission"}
          </p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-cream/10">
            <div>
              <div className="text-xs text-cream/60 mb-1">{lang === "ar" ? "إجمالي" : "Brut"}</div>
              <div className="font-display text-xl">{formatDZD(totalGross)}</div>
            </div>
            <div>
              <div className="text-xs text-cream/60 mb-1">{lang === "ar" ? "العمولة (10٪)" : "Commission"}</div>
              <div className="font-display text-xl text-rose-light">−{formatDZD(totalCommission)}</div>
            </div>
            <div>
              <div className="text-xs text-cream/60 mb-1">{lang === "ar" ? "متوسط شهري" : "Moy./mois"}</div>
              <div className="font-display text-xl">{formatDZD(totalNet / monthlyData.length)}</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[20px] p-6 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base">{lang === "ar" ? "الدفعة القادمة" : "Prochain paiement"}</h3>
            <ArrowDownToLine className="w-5 h-5 text-gold-600" />
          </div>
          <div className="font-display text-3xl gold-text font-bold mb-1">{formatDZD(188190)}</div>
          <div className="text-xs text-cocoa-400 mb-5">
            {lang === "ar" ? "تتم في" : "Le"} {formatDate("2026-06-02", lang)}
          </div>
          <div className="bg-cream-200/50 rounded-[12px] p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-cocoa-400">{lang === "ar" ? "إجمالي الفترة" : "Brut période"}</span>
              <span className="font-semibold">{formatDZD(209100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cocoa-400">{lang === "ar" ? "العمولة" : "Commission"}</span>
              <span className="font-semibold text-rose-dark">−{formatDZD(20910)}</span>
            </div>
            <div className="h-px bg-cocoa-900/8" />
            <div className="flex justify-between font-semibold">
              <span>{lang === "ar" ? "صافي" : "Net"}</span>
              <span className="gold-text">{formatDZD(188190)}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-[20px] p-6 shadow-soft mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-lg">{lang === "ar" ? "نمو الإيرادات الشهرية" : "Évolution mensuelle"}</h3>
            <p className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "إجمالي و صافي" : "Brut & net"}</p>
          </div>
          <Badge variant="success">
            <TrendingUp className="w-3 h-3" />
            +24% {lang === "ar" ? "هذا الشهر" : "ce mois"}
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="gross" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A961" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="net" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F5132" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0F5132" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9C7" vertical={false} />
            <XAxis dataKey="month" stroke="#8A6555" fontSize={12} />
            <YAxis stroke="#8A6555" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #E5D9C7", borderRadius: 12, fontSize: 12 }}
              formatter={(value) => formatDZD(value as number)}
            />
            <Area type="monotone" dataKey="gross" stroke="#C9A961" strokeWidth={2.5} fill="url(#gross)" name={lang === "ar" ? "إجمالي" : "Brut"} />
            <Area type="monotone" dataKey="net" stroke="#0F5132" strokeWidth={2.5} fill="url(#net)" name={lang === "ar" ? "صافي" : "Net"} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Payouts history */}
      <div className="bg-white rounded-[20px] shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-cocoa-900/8 flex items-center justify-between">
          <h3 className="font-display text-lg">{lang === "ar" ? "سجل الدفعات" : "Historique des paiements"}</h3>
          <Badge variant="outline">{PAYOUTS.length} {lang === "ar" ? "دفعة" : "paiements"}</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-cocoa-300 border-b border-cocoa-900/8 bg-cream-200/40">
                <th className="text-start p-4">{lang === "ar" ? "المرجع" : "Référence"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الفترة" : "Période"}</th>
                <th className="text-start p-4">{lang === "ar" ? "إجمالي" : "Brut"}</th>
                <th className="text-start p-4">{lang === "ar" ? "العمولة" : "Commission"}</th>
                <th className="text-start p-4">{lang === "ar" ? "صافي" : "Net"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الحالة" : "Statut"}</th>
              </tr>
            </thead>
            <tbody>
              {PAYOUTS.map((p) => (
                <tr key={p.id} className="border-b border-cocoa-900/5 hover:bg-cream-200/30 transition-colors">
                  <td className="p-4 font-mono text-xs">{p.id}</td>
                  <td className="p-4 text-cocoa-400">
                    {formatDate(p.period.start, lang)} — {formatDate(p.period.end, lang)}
                  </td>
                  <td className="p-4 font-display font-semibold">{formatDZD(p.gross)}</td>
                  <td className="p-4 text-rose-dark">−{formatDZD(p.commission)}</td>
                  <td className="p-4 font-display font-bold gold-text">{formatDZD(p.net)}</td>
                  <td className="p-4">
                    {p.status === "paid"
                      ? <Badge variant="success">{lang === "ar" ? "مدفوع" : "Payé"}</Badge>
                      : <Badge variant="warn">{lang === "ar" ? "قيد المعالجة" : "En cours"}</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
