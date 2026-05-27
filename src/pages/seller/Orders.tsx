import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, MapPin, Clock, ChevronLeft, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ORDERS } from "@/data/mock";
import type { OrderStatus } from "@/data/types";
import { useLocale } from "@/stores/locale";
import { formatDZD, formatDate, cn } from "@/lib/utils";
import { getWilayaByCode } from "@/data/wilayas";

const STATUS_LABEL = {
  ar: { pending: "جديد", preparing: "قيد التحضير", ready: "جاهز للتوصيل", delivered: "تم التسليم", cancelled: "ملغى" },
  fr: { pending: "Nouveau", preparing: "En préparation", ready: "Prêt", delivered: "Livré", cancelled: "Annulé" },
} as const;

const STATUS_COLORS: Record<OrderStatus, "default" | "verified" | "warn" | "success" | "outline"> = {
  pending: "warn",
  preparing: "default",
  ready: "verified",
  delivered: "success",
  cancelled: "outline",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivered",
};

const NEXT_ACTION = {
  ar: { pending: "ابدأ التحضير", preparing: "أعلِن الجاهزية", ready: "أكّد التسليم", delivered: "", cancelled: "" },
  fr: { pending: "Commencer", preparing: "Marquer prêt", ready: "Confirmer livraison", delivered: "", cancelled: "" },
} as const;

const TAB_KEYS: OrderStatus[] = ["pending", "preparing", "ready", "delivered"];

const sampleOrders = [
  ...ORDERS,
  { ...ORDERS[0], id: "ORD-2026-0143", status: "pending" as OrderStatus, total: 6700 },
  { ...ORDERS[0], id: "ORD-2026-0144", status: "pending" as OrderStatus, total: 4200 },
  { ...ORDERS[1], id: "ORD-2026-0140", status: "ready" as OrderStatus },
];

export default function SellerOrders() {
  const { lang } = useLocale();
  const [tab, setTab] = useState<OrderStatus>("pending");

  const filtered = sampleOrders.filter((o) => o.status === tab);
  const counts = TAB_KEYS.reduce((acc, k) => ({ ...acc, [k]: sampleOrders.filter((o) => o.status === k).length }), {} as Record<OrderStatus, number>);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
          {lang === "ar" ? "إدارة الطلبات" : "Gestion des commandes"}
        </h1>
        <p className="text-cocoa-400 mt-1">
          {lang === "ar" ? "تابع طلباتك وحدّث حالاتها" : "Suivez et mettez à jour vos commandes"}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[16px] shadow-soft p-1 mb-6 inline-flex flex-wrap gap-1">
        {TAB_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn(
              "px-4 py-2.5 rounded-[12px] text-sm font-medium transition-colors flex items-center gap-2",
              tab === k ? "bg-cocoa-900 text-cream" : "text-cocoa-400 hover:bg-cream-200"
            )}
          >
            {STATUS_LABEL[lang][k]}
            <span className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              tab === k ? "bg-gold-500 text-white" : "bg-cream-200 text-cocoa-400"
            )}>
              {counts[k]}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[16px] shadow-soft p-16 text-center">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-display text-xl mb-2">
              {lang === "ar" ? "لا توجد طلبات" : "Aucune commande"}
            </h3>
            <p className="text-cocoa-400">
              {lang === "ar" ? "ستظهر الطلبات الجديدة هنا تلقائياً" : "Les nouvelles commandes apparaîtront ici"}
            </p>
          </div>
        ) : (
          filtered.map((order, i) => {
            const nextStatus = NEXT_STATUS[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-[16px] shadow-soft overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs uppercase tracking-wider text-cocoa-300">{order.id}</span>
                        <Badge variant={STATUS_COLORS[order.status]}>
                          {STATUS_LABEL[lang][order.status]}
                        </Badge>
                        {order.status === "pending" && (
                          <Badge variant="warn">
                            <Clock className="w-3 h-3" />
                            {lang === "ar" ? "جديد" : "Nouveau"}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-cocoa-400 flex items-center gap-3 flex-wrap">
                        <span>{formatDate(order.createdAt, lang)}</span>
                        <span>·</span>
                        <span dir="ltr">{order.buyerPhone}</span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="font-display text-2xl gold-text font-bold">{formatDZD(order.total)}</div>
                      <div className="text-xs text-cocoa-400 mt-1">
                        {lang === "ar" ? "صافي بعد العمولة" : "Net après commission"}: <span className="font-semibold text-cocoa-900">{formatDZD(order.total - order.commissionAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-5 mb-5">
                    <div className="lg:col-span-2 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-3 bg-cream-200/50 rounded-[12px]">
                          <img src={item.photo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{item.nameAr}</div>
                            <div className="text-xs text-cocoa-400">× {item.quantity}</div>
                          </div>
                          <div className="font-semibold text-sm">{formatDZD(item.priceDzd * item.quantity)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-cream-200/50 rounded-[12px] p-4 space-y-3">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-cocoa-300 mb-1">
                          {lang === "ar" ? "التوصيل إلى" : "Livraison à"}
                        </div>
                        <div className="text-sm text-cocoa-900 flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 text-gold-600 shrink-0" />
                          <div>
                            <div>{order.deliveryAddress}</div>
                            <div className="text-cocoa-400 text-xs">{getWilayaByCode(order.deliveryWilayaCode)?.[lang]}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white rounded-lg text-xs font-medium hover:bg-gold-500/10 transition-colors">
                          <Phone className="w-3.5 h-3.5" />
                          {lang === "ar" ? "اتصال" : "Appeler"}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white rounded-lg text-xs font-medium hover:bg-gold-500/10 transition-colors">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {lang === "ar" ? "رسالة" : "Message"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {nextStatus && (
                    <div className="flex items-center justify-between pt-4 border-t border-cocoa-900/8">
                      <div className="text-xs text-cocoa-400">
                        {lang === "ar" ? "الخطوة التالية:" : "Étape suivante :"}
                        <span className="font-semibold text-cocoa-900 ms-1">{STATUS_LABEL[lang][nextStatus]}</span>
                      </div>
                      <Button size="sm">
                        <Check className="w-4 h-4" />
                        {NEXT_ACTION[lang][order.status]}
                        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
