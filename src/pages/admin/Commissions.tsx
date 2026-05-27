import { useState } from "react";
import { motion } from "framer-motion";
import { Percent, Save, RotateCcw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/data/categories";
import { useLocale } from "@/stores/locale";
import { formatDZD } from "@/lib/utils";

const SAMPLE_VOLUME = 38200000;

export default function AdminCommissions() {
  const { lang } = useLocale();
  const [globalRate, setGlobalRate] = useState(10);
  const [overrides, setOverrides] = useState<Record<string, number>>({
    "cat-3": 8,
    "cat-4": 12,
  });

  const projectedRevenue = (rate: number) => (SAMPLE_VOLUME * rate) / 100;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
          {lang === "ar" ? "إعدادات العمولات" : "Taux de commission"}
        </h1>
        <p className="text-cocoa-400 mt-1">
          {lang === "ar"
            ? "حدّد النسبة الافتراضية لكل الطلبات، مع إمكانية التخصيص لكل فئة"
            : "Définissez le taux par défaut et personnalisez par catégorie"}
        </p>
      </div>

      {/* Global rate hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cocoa-900 rounded-[20px] p-8 lg:p-10 text-cream mb-8 relative overflow-hidden"
      >
        <div className="absolute -top-20 -end-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
        <Badge variant="default" className="bg-gold-500/20 border-gold-500/40 text-gold-200 mb-4">
          <Percent className="w-3 h-3" />
          {lang === "ar" ? "النسبة الافتراضية" : "Taux par défaut"}
        </Badge>

        <div className="grid lg:grid-cols-2 gap-8 items-center relative">
          <div>
            <div className="flex items-baseline gap-2 mb-3">
              <input
                type="number"
                min={0}
                max={50}
                value={globalRate}
                onChange={(e) => setGlobalRate(Number(e.target.value))}
                className="font-display text-7xl gold-text font-bold bg-transparent border-none outline-none w-32"
              />
              <span className="text-4xl text-cream/60">%</span>
            </div>
            <p className="text-cream/60 mb-6">
              {lang === "ar"
                ? "تُطبَّق على جميع الطلبات ما لم تكن الفئة تحت تخصيص"
                : "Appliqué à toutes les commandes sauf surcharge"}
            </p>

            <div className="space-y-3">
              <label className="text-xs text-cream/60 uppercase tracking-wider">
                {lang === "ar" ? "اضبط النسبة" : "Ajuster"}
              </label>
              <input
                type="range"
                min={0}
                max={25}
                step={0.5}
                value={globalRate}
                onChange={(e) => setGlobalRate(Number(e.target.value))}
                className="w-full accent-gold-500"
              />
              <div className="flex justify-between text-xs text-cream/40">
                <span>0%</span>
                <span>12.5%</span>
                <span>25%</span>
              </div>
            </div>
          </div>

          <div className="bg-cream/5 rounded-[16px] p-6 backdrop-blur-md">
            <div className="text-xs text-cream/60 mb-2">{lang === "ar" ? "إيرادات شهرية متوقّعة" : "Revenu mensuel projeté"}</div>
            <div className="font-display text-4xl gold-text font-bold mb-1">{formatDZD(projectedRevenue(globalRate))}</div>
            <div className="text-xs text-cream/50 mb-5">
              {lang === "ar" ? "على حجم مبيعات" : "Sur un GMV de"} {formatDZD(SAMPLE_VOLUME)}
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              {[8, 10, 12].map((r) => (
                <div key={r} className={`p-3 rounded-lg ${r === globalRate ? "bg-gold-500/20 ring-1 ring-gold-500/40" : "bg-cream/5"}`}>
                  <div className="text-cream/60 mb-1">{r}%</div>
                  <div className="font-display text-sm">{formatDZD(projectedRevenue(r))}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Per-category overrides */}
      <div className="bg-white rounded-[20px] shadow-soft overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-cocoa-900/8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl">{lang === "ar" ? "تخصيص حسب الفئة" : "Surcharges par catégorie"}</h2>
            <p className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "اترك فارغاً لاستعمال النسبة العامة" : "Laissez vide pour utiliser le taux global"}</p>
          </div>
        </div>

        <div className="divide-y divide-cocoa-900/5">
          {CATEGORIES.map((c, i) => {
            const override = overrides[c.id];
            const effectiveRate = override ?? globalRate;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="px-6 py-4 flex items-center gap-4 hover:bg-cream-200/30 transition-colors"
              >
                <div className="text-3xl">{c.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-base">{c.ar}</div>
                  <div className="text-xs text-cocoa-400">{c.fr}</div>
                </div>
                <div className="hidden sm:block text-xs text-cocoa-400 me-2">
                  {lang === "ar" ? "النسبة الفعلية" : "Taux effectif"}:
                  <span className="ms-1 font-display gold-text font-bold">{effectiveRate}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    placeholder={String(globalRate)}
                    value={override ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setOverrides((prev) => {
                        const next = { ...prev };
                        if (!v) delete next[c.id];
                        else next[c.id] = Number(v);
                        return next;
                      });
                    }}
                    className="w-24 h-10 rounded-[10px] border border-cocoa-900/10 px-3 text-center text-sm"
                  />
                  <span className="text-cocoa-400">%</span>
                  {override !== undefined && (
                    <button
                      onClick={() => setOverrides((prev) => {
                        const next = { ...prev };
                        delete next[c.id];
                        return next;
                      })}
                      className="text-cocoa-300 hover:text-cocoa-900"
                      aria-label="Reset"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-[14px] p-4 flex gap-3 mb-6 text-sm text-amber-900">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          {lang === "ar"
            ? "تطبَّق التعديلات على الطلبات الجديدة فقط. الطلبات المعلّقة تحتفظ بنسبتها الأصلية."
            : "Les modifications ne s'appliquent qu'aux nouvelles commandes. Les commandes en cours conservent leur taux."}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{lang === "ar" ? "إلغاء" : "Annuler"}</Button>
        <Button>
          <Save className="w-4 h-4" />
          {lang === "ar" ? "حفظ التغييرات" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
