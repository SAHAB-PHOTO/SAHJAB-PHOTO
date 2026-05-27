import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Check, X, ShieldCheck, FileText, Download, Eye, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SHOPS } from "@/data/mock";
import { useLocale } from "@/stores/locale";
import { getWilayaByCode } from "@/data/wilayas";
import { formatDate, formatDZD, cn } from "@/lib/utils";

interface PendingShop {
  id: string;
  nameAr: string;
  ownerName: string;
  type: "shop" | "home";
  wilayaCode: number;
  submittedAt: string;
  phone: string;
  email: string;
  documents: { label: string; url: string }[];
}

const PENDING: PendingShop[] = [
  {
    id: "ps-1",
    nameAr: "حلويات الذواقة",
    ownerName: "ربيعة قاسمي",
    type: "shop",
    wilayaCode: 31,
    submittedAt: "2026-05-26",
    phone: "+213 555 78 90 12",
    email: "rabia.kasmi@example.dz",
    documents: [
      { label: "السجل التجاري", url: "#" },
      { label: "بطاقة الهوية (أمامي)", url: "#" },
      { label: "بطاقة الهوية (خلفي)", url: "#" },
    ],
  },
  {
    id: "ps-2",
    nameAr: "بيت الحلوى التلمساني",
    ownerName: "محمد بن عمر",
    type: "shop",
    wilayaCode: 13,
    submittedAt: "2026-05-25",
    phone: "+213 661 23 45 67",
    email: "mbenamar@example.dz",
    documents: [
      { label: "السجل التجاري", url: "#" },
      { label: "بطاقة الهوية", url: "#" },
    ],
  },
  {
    id: "ps-3",
    nameAr: "أتيليه نسرين",
    ownerName: "نسرين بوزيد",
    type: "home",
    wilayaCode: 16,
    submittedAt: "2026-05-24",
    phone: "+213 770 11 22 33",
    email: "nesrine.b@example.dz",
    documents: [
      { label: "بطاقة الهوية", url: "#" },
      { label: "إثبات الإقامة", url: "#" },
    ],
  },
];

export default function AdminSellers() {
  const { lang } = useLocale();
  const [tab, setTab] = useState<"pending" | "active" | "suspended">("pending");
  const [search, setSearch] = useState("");
  const [reviewing, setReviewing] = useState<PendingShop | null>(null);

  const activeShops = SHOPS.filter((s) => s.verified);
  const filtered = activeShops.filter((s) =>
    s.nameAr.toLowerCase().includes(search.toLowerCase()) ||
    s.nameFr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
          {lang === "ar" ? "إدارة البائعين" : "Gestion des vendeurs"}
        </h1>
        <p className="text-cocoa-400 mt-1">
          {lang === "ar" ? "موافقات، تفعيل، تعليق، وحظر" : "Validation, activation, suspension"}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "في الانتظار" : "En attente"}</div>
          <div className="font-display text-3xl text-amber-600">{PENDING.length}</div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "نشطون" : "Actifs"}</div>
          <div className="font-display text-3xl text-emerald">{activeShops.length}</div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "معلّقون" : "Suspendus"}</div>
          <div className="font-display text-3xl text-cocoa-400">2</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[16px] shadow-soft p-1 mb-6 inline-flex gap-1">
        {[
          { key: "pending", ar: "في الانتظار", fr: "En attente", count: PENDING.length },
          { key: "active", ar: "نشطون", fr: "Actifs", count: activeShops.length },
          { key: "suspended", ar: "معلّقون", fr: "Suspendus", count: 2 },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={cn(
              "px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors",
              tab === t.key ? "bg-cocoa-900 text-cream" : "text-cocoa-400"
            )}
          >
            {lang === "ar" ? t.ar : t.fr}
            <span className={cn("ms-2 px-1.5 py-0.5 rounded-full text-xs", tab === t.key ? "bg-gold-500" : "bg-cream-200 text-cocoa-400")}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Pending list */}
      {tab === "pending" && (
        <div className="space-y-4">
          {PENDING.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-[16px] p-5 shadow-soft flex flex-col lg:flex-row items-stretch lg:items-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center font-display text-xl text-gold-700 shrink-0">
                {s.nameAr.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-display text-lg text-cocoa-900">{s.nameAr}</div>
                  <Badge variant={s.type === "shop" ? "default" : "rose"}>
                    {s.type === "shop"
                      ? (lang === "ar" ? "محل تجاري" : "Boutique")
                      : (lang === "ar" ? "منزلي" : "À domicile")}
                  </Badge>
                </div>
                <div className="text-sm text-cocoa-400 mt-1">
                  {s.ownerName} · {getWilayaByCode(s.wilayaCode)?.[lang]} · {s.documents.length} {lang === "ar" ? "وثائق" : "documents"}
                </div>
                <div className="text-xs text-cocoa-300 mt-1">
                  {lang === "ar" ? "قُدِّم في" : "Soumis le"} {formatDate(s.submittedAt, lang)}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setReviewing(s)}>
                  <Eye className="w-4 h-4" />
                  {lang === "ar" ? "مراجعة" : "Examiner"}
                </Button>
                <button className="w-10 h-10 rounded-full bg-emerald text-white flex items-center justify-center hover:scale-105 transition-transform" aria-label="Approve">
                  <Check className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors" aria-label="Reject">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active sellers */}
      {tab === "active" && (
        <>
          <div className="bg-white rounded-[16px] shadow-soft p-4 mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-cocoa-300" />
              <Input
                placeholder={lang === "ar" ? "ابحث عن متجر..." : "Rechercher..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-10"
              />
            </div>
            <Button variant="outline"><Download className="w-4 h-4" />{lang === "ar" ? "تصدير" : "Export"}</Button>
          </div>
          <div className="bg-white rounded-[16px] shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-cocoa-300 border-b border-cocoa-900/8 bg-cream-200/40">
                    <th className="text-start p-4">{lang === "ar" ? "المتجر" : "Boutique"}</th>
                    <th className="text-start p-4">{lang === "ar" ? "الولاية" : "Wilaya"}</th>
                    <th className="text-start p-4">{lang === "ar" ? "المبيعات" : "Ventes"}</th>
                    <th className="text-start p-4">{lang === "ar" ? "التقييم" : "Note"}</th>
                    <th className="text-end p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((shop) => (
                    <tr key={shop.id} className="border-b border-cocoa-900/5 hover:bg-cream-200/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={shop.logoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                          <div>
                            <div className="font-medium">{shop.nameAr}</div>
                            <div className="text-xs text-cocoa-400">{shop.totalSales} {lang === "ar" ? "طلب" : "commandes"}</div>
                          </div>
                          {shop.verified && <ShieldCheck className="w-4 h-4 text-emerald" />}
                        </div>
                      </td>
                      <td className="p-4 text-cocoa-400">{getWilayaByCode(shop.wilayaCode)?.[lang]}</td>
                      <td className="p-4 font-display font-bold gold-text">{formatDZD(shop.totalSales * 1000)}</td>
                      <td className="p-4">{shop.ratingAvg}★ <span className="text-cocoa-300 text-xs">({shop.reviewCount})</span></td>
                      <td className="p-4 text-end">
                        <button className="p-2 rounded-lg hover:bg-red-50" aria-label="Suspend">
                          <Ban className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "suspended" && (
        <div className="bg-white rounded-[16px] shadow-soft p-16 text-center">
          <Ban className="w-12 h-12 text-cocoa-300 mx-auto mb-3" strokeWidth={1.2} />
          <p className="text-cocoa-400">{lang === "ar" ? "لا يوجد بائعون معلّقون حالياً" : "Aucun vendeur suspendu"}</p>
        </div>
      )}

      {/* Review drawer */}
      <AnimatePresence>
        {reviewing && (
          <div className="fixed inset-0 z-50 bg-cocoa-900/60 backdrop-blur-sm" onClick={() => setReviewing(null)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute inset-y-0 start-0 w-full max-w-xl bg-cream overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-cream/95 backdrop-blur-md border-b border-cocoa-900/8 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="font-display text-xl">{lang === "ar" ? "مراجعة الطلب" : "Examen du dossier"}</h2>
                <button onClick={() => setReviewing(null)} className="text-cocoa-400 hover:text-cocoa-900">✕</button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-white rounded-[16px] p-5 shadow-soft">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gold-500/15 flex items-center justify-center font-display text-2xl text-gold-700">
                      {reviewing.nameAr.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display text-xl">{reviewing.nameAr}</div>
                      <Badge variant="warn" className="mt-1">{lang === "ar" ? "بانتظار الموافقة" : "En attente"}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-cocoa-400">{lang === "ar" ? "صاحب المتجر" : "Propriétaire"}</div>
                      <div className="font-medium">{reviewing.ownerName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-cocoa-400">{lang === "ar" ? "الولاية" : "Wilaya"}</div>
                      <div className="font-medium">{getWilayaByCode(reviewing.wilayaCode)?.[lang]}</div>
                    </div>
                    <div>
                      <div className="text-xs text-cocoa-400">{lang === "ar" ? "الهاتف" : "Téléphone"}</div>
                      <div className="font-medium" dir="ltr">{reviewing.phone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-cocoa-400">{lang === "ar" ? "البريد" : "Email"}</div>
                      <div className="font-medium truncate">{reviewing.email}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gold-600" />
                    {lang === "ar" ? "الوثائق المرفوعة" : "Documents soumis"}
                  </h3>
                  <div className="space-y-2">
                    {reviewing.documents.map((d, i) => (
                      <div key={i} className="bg-white rounded-[12px] p-4 flex items-center justify-between shadow-soft">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cream-200 flex items-center justify-center text-cocoa-400 text-xs font-bold">PDF</div>
                          <div>
                            <div className="text-sm font-medium">{d.label}</div>
                            <div className="text-xs text-cocoa-400">1.2 MB · {formatDate(reviewing.submittedAt, lang)}</div>
                          </div>
                        </div>
                        <button className="text-gold-700 text-sm font-medium hover:underline">
                          {lang === "ar" ? "عرض" : "Voir"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-base mb-3">{lang === "ar" ? "ملاحظات (اختياري)" : "Notes (facultatif)"}</h3>
                  <textarea
                    rows={3}
                    placeholder={lang === "ar" ? "ملاحظات داخلية لفريق المراجعة..." : "Notes internes..."}
                    className="w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 py-3 text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-cocoa-900/8 sticky bottom-0 bg-cream pb-2">
                  <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50" onClick={() => setReviewing(null)}>
                    <X className="w-4 h-4" />
                    {lang === "ar" ? "رفض" : "Rejeter"}
                  </Button>
                  <Button className="flex-1 bg-emerald hover:bg-emerald-light" onClick={() => setReviewing(null)}>
                    <Check className="w-4 h-4" />
                    {lang === "ar" ? "موافقة" : "Approuver"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
