import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Clock, Package, Truck, Home, MapPin, Phone, MessageCircle } from "lucide-react";
import { ORDERS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { formatDZD, formatDate, cn } from "@/lib/utils";
import { getWilayaByCode } from "@/data/wilayas";

const STATUS_STEPS = [
  { key: "pending", icon: Clock, ar: "تأكيد الطلب", fr: "Confirmé" },
  { key: "preparing", icon: Package, ar: "قيد التحضير", fr: "En préparation" },
  { key: "ready", icon: Truck, ar: "في الطريق", fr: "En route" },
  { key: "delivered", icon: Home, ar: "تم التسليم", fr: "Livré" },
];

export default function OrderTracking() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const isNew = params.get("new") === "1";
  const { lang } = useLocale();
  const order = ORDERS.find((o) => o.id === id) || ORDERS[0];

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="container-editorial py-10">
      {isNew && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald/10 border border-emerald/20 rounded-[16px] p-5 mb-8 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full bg-emerald flex items-center justify-center shrink-0">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg text-emerald">
              {lang === "ar" ? "تم تأكيد طلبك بنجاح!" : "Commande confirmée !"}
            </h3>
            <p className="text-sm text-cocoa-400">
              {lang === "ar"
                ? "ستصلك رسالة نصية بمجرّد بدء التحضير."
                : "Vous recevrez un SMS dès le début de la préparation."}
            </p>
          </div>
        </motion.div>
      )}

      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-gold-600 mb-2">
          {lang === "ar" ? "رقم الطلب" : "Numéro de commande"}
        </div>
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">{order.id}</h1>
        <div className="text-sm text-cocoa-400 mt-2">
          {lang === "ar" ? "تم الطلب يوم" : "Commandé le"} {formatDate(order.createdAt, lang)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-soft">
            <h2 className="font-display text-xl mb-8">{lang === "ar" ? "حالة الطلب" : "Suivi de livraison"}</h2>

            <div className="relative">
              <div className="absolute top-0 bottom-0 right-6 lg:right-7 w-0.5 bg-cream-200" />
              <div
                className="absolute top-0 right-6 lg:right-7 w-0.5 bg-gold-gradient transition-all duration-700"
                style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />

              <div className="space-y-8">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i < currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="relative flex items-start gap-5"
                    >
                      <div
                        className={cn(
                          "relative z-10 w-12 lg:w-14 h-12 lg:h-14 rounded-full flex items-center justify-center shrink-0 transition-all",
                          isDone ? "bg-emerald text-white" :
                          isCurrent ? "bg-gold-gradient text-white shadow-gold animate-pulse" :
                          "bg-cream-200 text-cocoa-300"
                        )}
                      >
                        {isDone ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 pt-2.5">
                        <div className={cn("font-display text-base", isCurrent && "text-gold-700")}>
                          {lang === "ar" ? step.ar : step.fr}
                        </div>
                        <div className="text-xs text-cocoa-400 mt-1">
                          {isDone && (lang === "ar" ? "اكتمل" : "Terminé")}
                          {isCurrent && (lang === "ar" ? "جارٍ الآن" : "En cours")}
                          {!isDone && !isCurrent && (lang === "ar" ? "في الانتظار" : "À venir")}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-[20px] p-6 lg:p-8 shadow-soft">
            <h2 className="font-display text-xl mb-6">{lang === "ar" ? "المنتجات" : "Articles"}</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 py-2">
                  <img src={item.photo} alt="" className="w-16 h-16 rounded-[10px] object-cover" />
                  <div className="flex-1">
                    <div className="font-display text-sm">{item.nameAr}</div>
                    <div className="text-xs text-cocoa-400">× {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-sm">{formatDZD(item.priceDzd * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Seller card */}
          <div className="bg-white rounded-[20px] p-6 shadow-soft">
            <h2 className="font-display text-xl mb-4">{lang === "ar" ? "البائع" : "Vendeur"}</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-500/15 flex items-center justify-center font-display text-gold-700 text-xl">
                {order.shopNameAr.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{order.shopNameAr}</div>
                <div className="text-xs text-cocoa-400">{lang === "ar" ? "بائع معتمد" : "Vendeur certifié"}</div>
              </div>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4" />
                {lang === "ar" ? "تواصل" : "Contacter"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Address */}
          <div className="bg-white rounded-[20px] p-6 shadow-soft">
            <h3 className="font-display text-base mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-600" />
              {lang === "ar" ? "عنوان التوصيل" : "Adresse de livraison"}
            </h3>
            <p className="text-sm text-cocoa-900 leading-relaxed">{order.deliveryAddress}</p>
            <p className="text-sm text-cocoa-400 mt-1">
              {getWilayaByCode(order.deliveryWilayaCode)?.[lang]}
            </p>
            <div className="text-xs text-cocoa-400 mt-3 flex items-center gap-2" dir="ltr">
              <Phone className="w-3.5 h-3.5" />
              {order.buyerPhone}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-[20px] p-6 shadow-soft space-y-3">
            <h3 className="font-display text-base mb-2">{lang === "ar" ? "ملخّص الفاتورة" : "Récapitulatif"}</h3>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-cocoa-400">{lang === "ar" ? "المنتجات" : "Articles"}</span><span>{formatDZD(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-cocoa-400">{lang === "ar" ? "التوصيل" : "Livraison"}</span><span>{formatDZD(order.deliveryFee)}</span></div>
              <div className="h-px bg-cocoa-900/8" />
              <div className="flex justify-between items-baseline">
                <span className="font-display">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="font-display text-xl gold-text font-bold">{formatDZD(order.total)}</span>
              </div>
            </div>
            <Badge variant="outline" className="w-full justify-center">
              {lang === "ar" ? "الدفع" : "Paiement"}: {order.paymentMethod.toUpperCase()}
            </Badge>
          </div>

          <Link to="/account" className="block">
            <Button variant="outline" className="w-full">
              {lang === "ar" ? "كل طلباتي" : "Toutes mes commandes"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
