import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MessageSquare, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { formatDate, formatDZD, cn } from "@/lib/utils";

interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  shopName: string;
  reason: { ar: string; fr: string };
  description: string;
  amount: number;
  openedAt: string;
  status: "open" | "investigating" | "resolved" | "refunded";
  priority: "high" | "medium" | "low";
}

const DISPUTES: Dispute[] = [
  {
    id: "DIS-2026-024",
    orderId: "ORD-2026-0138",
    buyerName: "ليلى حداد",
    shopName: "بيت البقلاوة",
    reason: { ar: "منتج تالف", fr: "Produit endommagé" },
    description: "وصل البقلاوة مكسور والتغليف ممزّق. أطلب استرداد كامل المبلغ.",
    amount: 6800,
    openedAt: "2026-05-25",
    status: "open",
    priority: "high",
  },
  {
    id: "DIS-2026-023",
    orderId: "ORD-2026-0135",
    buyerName: "سامي بلحاج",
    shopName: "أتيليه الذوق الرفيع",
    reason: { ar: "تأخر في التوصيل", fr: "Retard de livraison" },
    description: "الطلب كان لمناسبة عائلية ووصل بعدها بثلاث ساعات.",
    amount: 5200,
    openedAt: "2026-05-23",
    status: "investigating",
    priority: "medium",
  },
];

const STATUS_LABEL = {
  ar: { open: "مفتوح", investigating: "قيد البحث", resolved: "محلول", refunded: "تم الاسترداد" },
  fr: { open: "Ouvert", investigating: "En examen", resolved: "Résolu", refunded: "Remboursé" },
} as const;

const PRIORITY_COLORS = {
  high: "warn",
  medium: "default",
  low: "outline",
} as const;

export default function AdminDisputes() {
  const { lang } = useLocale();
  const [selected, setSelected] = useState<Dispute | null>(null);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
          {lang === "ar" ? "النزاعات والاسترداد" : "Litiges & remboursements"}
        </h1>
        <p className="text-cocoa-400 mt-1">
          {lang === "ar" ? "حلّ مشكلات المشترين والبائعين بإنصاف" : "Résolvez les différends équitablement"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "مفتوحة" : "Ouverts"}</div>
          <div className="font-display text-3xl text-amber-600">2</div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "هذا الشهر" : "Ce mois"}</div>
          <div className="font-display text-3xl text-cocoa-900">14</div>
        </div>
        <div className="bg-white p-5 rounded-[14px] shadow-soft">
          <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "متوسط الحل" : "Délai moyen"}</div>
          <div className="font-display text-3xl text-emerald">1.8j</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className={cn("space-y-3", selected ? "lg:col-span-2" : "lg:col-span-5")}>
          {DISPUTES.map((d, i) => (
            <motion.button
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => setSelected(d)}
              className={cn(
                "w-full bg-white rounded-[16px] p-5 shadow-soft text-start transition-all hover:shadow-elevated",
                selected?.id === d.id && "ring-2 ring-gold-500"
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={PRIORITY_COLORS[d.priority]}>
                    <AlertTriangle className="w-3 h-3" />
                    {d.priority === "high" ? (lang === "ar" ? "عاجل" : "Urgent") : (lang === "ar" ? "عادي" : "Normal")}
                  </Badge>
                  <Badge variant="outline">{STATUS_LABEL[lang][d.status]}</Badge>
                </div>
                <span className="text-xs text-cocoa-300">{formatDate(d.openedAt, lang)}</span>
              </div>
              <div className="font-display text-base text-cocoa-900 mb-1">{d.reason[lang]}</div>
              <div className="text-xs text-cocoa-400 mb-3 line-clamp-2">{d.description}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-cocoa-400">{d.buyerName} ← {d.shopName}</span>
                <span className="font-display gold-text font-bold">{formatDZD(d.amount)}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white rounded-[20px] shadow-soft p-6 lg:p-8"
          >
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-cocoa-300">{selected.id}</div>
                <h2 className="font-display text-2xl mt-1">{selected.reason[lang]}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="text-cocoa-400 hover:text-cocoa-900">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "المشتري" : "Acheteur"}</div>
                <div className="font-medium">{selected.buyerName}</div>
              </div>
              <div>
                <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "البائع" : "Vendeur"}</div>
                <div className="font-medium">{selected.shopName}</div>
              </div>
              <div>
                <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "الطلب" : "Commande"}</div>
                <div className="font-mono text-xs">{selected.orderId}</div>
              </div>
              <div>
                <div className="text-xs text-cocoa-400 mb-1">{lang === "ar" ? "المبلغ المتنازع عليه" : "Montant en litige"}</div>
                <div className="font-display gold-text font-bold">{formatDZD(selected.amount)}</div>
              </div>
            </div>

            <div className="bg-cream-200/50 rounded-[14px] p-4 mb-6">
              <div className="text-xs uppercase tracking-wider text-cocoa-400 mb-2">{lang === "ar" ? "وصف المشكلة" : "Description"}</div>
              <p className="text-sm leading-relaxed">{selected.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="text-xs uppercase tracking-wider text-cocoa-400">{lang === "ar" ? "المحادثة" : "Conversation"}</div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-gold/20 flex items-center justify-center font-display text-rose-dark text-sm shrink-0">
                  {selected.buyerName.charAt(0)}
                </div>
                <div className="flex-1 bg-rose-gold/10 rounded-2xl rounded-ts-md p-3 text-sm">
                  {selected.description}
                  <div className="text-xs text-cocoa-400 mt-1">{formatDate(selected.openedAt, lang)}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center font-display text-gold-700 text-sm shrink-0">
                  {selected.shopName.charAt(0)}
                </div>
                <div className="flex-1 bg-gold-500/10 rounded-2xl rounded-ts-md p-3 text-sm">
                  {lang === "ar"
                    ? "نعتذر بشدّة، سنُعالج الموضوع فوراً."
                    : "Nous sommes désolés, nous traitons immédiatement."}
                  <div className="text-xs text-cocoa-400 mt-1">{formatDate("2026-05-26", lang)}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <textarea
                rows={2}
                placeholder={lang === "ar" ? "اكتب ردّاً للطرفين..." : "Répondre aux deux parties..."}
                className="flex-1 rounded-[12px] border border-cocoa-900/10 p-3 text-sm resize-none"
              />
              <Button>
                <MessageSquare className="w-4 h-4" />
                {lang === "ar" ? "إرسال" : "Envoyer"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cocoa-900/8">
              <Button variant="outline" className="flex-1">
                <Clock className="w-4 h-4" />
                {lang === "ar" ? "اطلب مزيداً من المعلومات" : "Demander plus d'info"}
              </Button>
              <Button variant="outline" className="flex-1 border-red-300 text-red-600 hover:bg-red-50">
                <X className="w-4 h-4" />
                {lang === "ar" ? "رفض الشكوى" : "Rejeter"}
              </Button>
              <Button className="flex-1 bg-emerald hover:bg-emerald-light">
                <Check className="w-4 h-4" />
                {lang === "ar" ? `استرد ${formatDZD(selected.amount)}` : `Rembourser ${formatDZD(selected.amount)}`}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
