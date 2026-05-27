import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Truck, CreditCard, ChevronLeft } from "lucide-react";
import { useCart } from "@/stores/cart";
import { useLocale } from "@/stores/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDZD, cn } from "@/lib/utils";
import { WILAYAS } from "@/data/wilayas";
import type { PaymentMethod } from "@/data/types";

const STEPS = [
  { key: "address", icon: MapPin, ar: "العنوان", fr: "Adresse" },
  { key: "delivery", icon: Truck, ar: "التوصيل", fr: "Livraison" },
  { key: "payment", icon: CreditCard, ar: "الدفع", fr: "Paiement" },
  { key: "confirm", icon: Check, ar: "تأكيد", fr: "Confirmation" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { items, total, clear } = useCart();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", wilaya: "" });
  const [delivery, setDelivery] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState<PaymentMethod>("cib");

  const deliveryFee = delivery === "express" ? 1200 : 500;
  const subtotal = total();
  const grandTotal = subtotal + deliveryFee;

  const onConfirm = () => {
    clear();
    navigate(`/order/ORD-2026-0142?new=1`);
  };

  return (
    <div className="container-editorial py-10">
      <h1 className="font-display text-4xl text-cocoa-900 mb-8">
        {lang === "ar" ? "إتمام الطلب" : "Finaliser la commande"}
      </h1>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                  i < step ? "bg-emerald text-white" :
                  i === step ? "bg-gold-gradient text-white shadow-gold" :
                  "bg-cream-200 text-cocoa-300"
                )}
              >
                {i < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-xs font-medium",
                i <= step ? "text-cocoa-900" : "text-cocoa-300"
              )}>
                {lang === "ar" ? s.ar : s.fr}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "h-0.5 flex-1 mx-2 transition-colors",
                i < step ? "bg-emerald" : "bg-cream-200"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[20px] p-6 lg:p-8 shadow-soft"
            >
              {step === 0 && (
                <>
                  <h2 className="font-display text-2xl mb-6">{lang === "ar" ? "عنوان التوصيل" : "Adresse de livraison"}</h2>
                  <div className="space-y-4">
                    <div>
                      <Label>{lang === "ar" ? "الاسم الكامل" : "Nom complet"}</Label>
                      <Input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>{lang === "ar" ? "رقم الهاتف" : "Téléphone"}</Label>
                      <Input dir="ltr" placeholder="+213 555 12 34 56" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                    </div>
                    <div>
                      <Label>{lang === "ar" ? "العنوان التفصيلي" : "Adresse détaillée"}</Label>
                      <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder={lang === "ar" ? "حي، شارع، رقم" : "Quartier, rue, n°"} />
                    </div>
                    <div>
                      <Label>{lang === "ar" ? "الولاية" : "Wilaya"}</Label>
                      <select
                        value={address.wilaya}
                        onChange={(e) => setAddress({ ...address, wilaya: e.target.value })}
                        className="flex h-12 w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 text-base"
                      >
                        <option value="">{lang === "ar" ? "اختر الولاية" : "Sélectionnez"}</option>
                        {WILAYAS.map((w) => (
                          <option key={w.code} value={w.code}>{lang === "ar" ? w.ar : w.fr}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-display text-2xl mb-6">{lang === "ar" ? "اختر طريقة التوصيل" : "Mode de livraison"}</h2>
                  <div className="space-y-3">
                    {[
                      { id: "standard", titleAr: "توصيل قياسي", titleFr: "Standard", descAr: "خلال 24-48 ساعة", descFr: "24-48 heures", price: 500 },
                      { id: "express", titleAr: "توصيل سريع", titleFr: "Express", descAr: "خلال 4-6 ساعات (المدن الكبرى)", descFr: "4-6 heures (grandes villes)", price: 1200 },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-[14px] border cursor-pointer transition-all",
                          delivery === opt.id ? "border-gold-500 bg-gold-500/5" : "border-cocoa-900/8 hover:border-gold-500/40"
                        )}
                      >
                        <input
                          type="radio"
                          checked={delivery === opt.id}
                          onChange={() => setDelivery(opt.id as any)}
                          className="w-4 h-4 accent-gold-500"
                        />
                        <Truck className="w-6 h-6 text-gold-600" />
                        <div className="flex-1">
                          <div className="font-display text-base">{lang === "ar" ? opt.titleAr : opt.titleFr}</div>
                          <div className="text-sm text-cocoa-400">{lang === "ar" ? opt.descAr : opt.descFr}</div>
                        </div>
                        <div className="font-display gold-text font-bold">{formatDZD(opt.price)}</div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-2xl mb-6">{lang === "ar" ? "طريقة الدفع" : "Mode de paiement"}</h2>
                  <div className="space-y-3">
                    {[
                      { id: "cib", title: "CIB", desc: lang === "ar" ? "البطاقة المصرفية" : "Carte bancaire", emoji: "💳" },
                      { id: "edahabia", title: "Edahabia", desc: lang === "ar" ? "بطاقة الذهبية" : "Carte Edahabia", emoji: "🪙" },
                      { id: "baridimob", title: "BaridiMob", desc: lang === "ar" ? "محفظة بريدي موب" : "Portefeuille BaridiMob", emoji: "📱" },
                      { id: "cod", title: lang === "ar" ? "الدفع عند الاستلام" : "Paiement à la livraison", desc: lang === "ar" ? "ادفع نقداً عند وصول الطلب" : "Cash à la livraison", emoji: "💵" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-[14px] border cursor-pointer transition-all",
                          payment === opt.id ? "border-gold-500 bg-gold-500/5" : "border-cocoa-900/8 hover:border-gold-500/40"
                        )}
                      >
                        <input type="radio" checked={payment === opt.id} onChange={() => setPayment(opt.id as PaymentMethod)} className="w-4 h-4 accent-gold-500" />
                        <span className="text-3xl">{opt.emoji}</span>
                        <div className="flex-1">
                          <div className="font-display text-base">{opt.title}</div>
                          <div className="text-sm text-cocoa-400">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2 className="font-display text-2xl mb-6">{lang === "ar" ? "تأكيد الطلب" : "Confirmation"}</h2>
                  <div className="space-y-5 text-sm">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-cocoa-300 mb-2">{lang === "ar" ? "العنوان" : "Adresse"}</h3>
                      <p className="text-cocoa-900">{address.name} · {address.phone}</p>
                      <p className="text-cocoa-400">{address.street}, {WILAYAS.find((w) => w.code === Number(address.wilaya))?.[lang]}</p>
                    </div>
                    <div className="h-px bg-cocoa-900/8" />
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-cocoa-300 mb-2">{lang === "ar" ? "التوصيل" : "Livraison"}</h3>
                      <p className="text-cocoa-900">{delivery === "express" ? (lang === "ar" ? "سريع" : "Express") : (lang === "ar" ? "قياسي" : "Standard")}</p>
                    </div>
                    <div className="h-px bg-cocoa-900/8" />
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-cocoa-300 mb-2">{lang === "ar" ? "الدفع" : "Paiement"}</h3>
                      <p className="text-cocoa-900 uppercase">{payment}</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-cocoa-900/8">
                <Button
                  variant="ghost"
                  onClick={() => (step === 0 ? navigate("/cart") : setStep(step - 1))}
                >
                  {step === 0 ? (lang === "ar" ? "العودة للسلة" : "Retour panier") : (lang === "ar" ? "السابق" : "Précédent")}
                </Button>
                <Button
                  onClick={() => (step === STEPS.length - 1 ? onConfirm() : setStep(step + 1))}
                >
                  {step === STEPS.length - 1 ? (lang === "ar" ? "تأكيد ودفع" : "Payer & confirmer") : (lang === "ar" ? "متابعة" : "Continuer")}
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[20px] p-6 shadow-soft sticky top-28 space-y-4">
            <h2 className="font-display text-xl">{lang === "ar" ? "ملخّص الطلب" : "Récapitulatif"}</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  <img src={item.photo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-1 font-medium">{item.nameAr}</div>
                    <div className="text-xs text-cocoa-400">× {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-sm">{formatDZD(item.priceDzd * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="h-px bg-cocoa-900/8" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cocoa-400">{lang === "ar" ? "المجموع" : "Sous-total"}</span><span>{formatDZD(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-cocoa-400">{lang === "ar" ? "التوصيل" : "Livraison"}</span><span>{formatDZD(deliveryFee)}</span></div>
              <div className="h-px bg-cocoa-900/8" />
              <div className="flex justify-between items-baseline">
                <span className="font-display">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="font-display text-2xl gold-text font-bold">{formatDZD(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
