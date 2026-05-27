import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Upload, ChevronLeft, Store, FileText, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { useAuth } from "@/stores/auth";
import { WILAYAS } from "@/data/wilayas";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "shop", icon: Store, ar: "معلومات المتجر", fr: "Boutique" },
  { key: "type", icon: Building, ar: "نوع النشاط", fr: "Activité" },
  { key: "docs", icon: FileText, ar: "الوثائق", fr: "Documents" },
  { key: "done", icon: Sparkles, ar: "تم!", fr: "Terminé" },
];

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { setRole } = useAuth();
  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState<"shop" | "home">("shop");
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCat = (id: string) =>
    setCategories((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const next = () => {
    if (step === STEPS.length - 2) {
      setRole("seller");
    }
    if (step < STEPS.length - 1) setStep(step + 1);
    else navigate("/seller/dashboard");
  };

  return (
    <div className="min-h-screen bg-cream-gradient">
      <div className="container-editorial py-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="default" className="mb-4">
              <Sparkles className="w-3 h-3" />
              {lang === "ar" ? "أنشئ متجرك" : "Créez votre boutique"}
            </Badge>
            <h1 className="font-display text-4xl lg:text-5xl text-cocoa-900 mb-3">
              {lang === "ar" ? "كن بائعاً معتمداً" : "Devenez vendeur certifié"}
            </h1>
            <p className="text-cocoa-400 max-w-xl mx-auto">
              {lang === "ar"
                ? "في أقل من 10 دقائق، ستصبح مستعداً لاستقبال طلبات من 58 ولاية"
                : "En moins de 10 minutes, prêt à recevoir des commandes des 58 wilayas"}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center flex-1 last:flex-initial">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center transition-all",
                      i < step ? "bg-emerald text-white" :
                      i === step ? "bg-gold-gradient text-white shadow-gold" :
                      "bg-white text-cocoa-300 border border-cocoa-900/8"
                    )}
                  >
                    {i < step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={cn(
                    "text-xs font-medium hidden sm:block",
                    i <= step ? "text-cocoa-900" : "text-cocoa-300"
                  )}>
                    {lang === "ar" ? s.ar : s.fr}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-0.5 flex-1 mx-2", i < step ? "bg-emerald" : "bg-cocoa-900/10")} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] p-8 lg:p-12 shadow-elevated"
            >
              {step === 0 && (
                <>
                  <h2 className="font-display text-2xl mb-6">
                    {lang === "ar" ? "معلومات المتجر" : "Informations boutique"}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <Label>{lang === "ar" ? "اسم المتجر بالعربية" : "Nom de la boutique (AR)"}</Label>
                      <Input placeholder="حلويات أم وليد" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>{lang === "ar" ? "اسم المتجر بالفرنسية" : "Nom (FR)"}</Label>
                      <Input placeholder="Chez Om Walid" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>{lang === "ar" ? "وصف موجز" : "Description courte"}</Label>
                      <textarea
                        rows={3}
                        className="w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 py-3 text-base focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
                        placeholder={lang === "ar" ? "حلويات تقليدية من قلب وهران..." : "Pâtisseries traditionnelles..."}
                      />
                    </div>
                    <div>
                      <Label>{lang === "ar" ? "الولاية" : "Wilaya"}</Label>
                      <select className="flex h-12 w-full rounded-[14px] border border-cocoa-900/10 px-4 text-base">
                        <option value="">{lang === "ar" ? "اختر" : "Sélectionnez"}</option>
                        {WILAYAS.map((w) => <option key={w.code}>{lang === "ar" ? w.ar : w.fr}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label>{lang === "ar" ? "رقم الهاتف" : "Téléphone"}</Label>
                      <Input dir="ltr" placeholder="+213 555 12 34 56" />
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="font-display text-2xl mb-2">
                    {lang === "ar" ? "نوع نشاطك" : "Type d'activité"}
                  </h2>
                  <p className="text-cocoa-400 mb-6">
                    {lang === "ar" ? "هذا يحدد الوثائق المطلوبة في الخطوة التالية" : "Cela détermine les documents requis"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { id: "shop", icon: "🏪", titleAr: "محل تجاري", titleFr: "Boutique commerciale", descAr: "أملك سجل تجاري", descFr: "J'ai un registre de commerce" },
                      { id: "home", icon: "🏠", titleAr: "صانع منزلي", titleFr: "Artisan à domicile", descAr: "أحضّر من بيتي", descFr: "Je cuisine chez moi" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          "p-6 rounded-[16px] border-2 cursor-pointer transition-all",
                          businessType === opt.id ? "border-gold-500 bg-gold-500/5" : "border-cocoa-900/10 hover:border-gold-500/40"
                        )}
                      >
                        <input
                          type="radio"
                          className="sr-only"
                          checked={businessType === opt.id}
                          onChange={() => setBusinessType(opt.id as any)}
                        />
                        <div className="text-4xl mb-3">{opt.icon}</div>
                        <div className="font-display text-lg mb-1">{lang === "ar" ? opt.titleAr : opt.titleFr}</div>
                        <div className="text-sm text-cocoa-400">{lang === "ar" ? opt.descAr : opt.descFr}</div>
                      </label>
                    ))}
                  </div>

                  <div>
                    <Label>{lang === "ar" ? "الفئات التي تبيعها" : "Catégories vendues"}</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCat(c.id)}
                          className={cn(
                            "p-3 rounded-[12px] border-2 text-sm flex items-center gap-2 transition-all",
                            categories.includes(c.id) ? "border-gold-500 bg-gold-500/10" : "border-cocoa-900/10 hover:border-gold-500/40"
                          )}
                        >
                          <span>{c.icon}</span>
                          <span>{lang === "ar" ? c.ar : c.fr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="font-display text-2xl mb-2">
                    {lang === "ar" ? "رفع الوثائق" : "Documents"}
                  </h2>
                  <p className="text-cocoa-400 mb-6">
                    {businessType === "shop"
                      ? (lang === "ar" ? "السجل التجاري + بطاقة هوية" : "Registre de commerce + pièce d'identité")
                      : (lang === "ar" ? "بطاقة هوية + إثبات إقامة" : "Pièce d'identité + justificatif")}
                  </p>

                  <div className="space-y-4">
                    {[
                      businessType === "shop"
                        ? { ar: "السجل التجاري", fr: "Registre de commerce" }
                        : { ar: "إثبات الإقامة", fr: "Justificatif de domicile" },
                      { ar: "بطاقة الهوية الوطنية (الأمامي)", fr: "CIN (recto)" },
                      { ar: "بطاقة الهوية الوطنية (الخلفي)", fr: "CIN (verso)" },
                    ].map((doc, i) => (
                      <div key={i} className="border-2 border-dashed border-cocoa-900/15 rounded-[14px] p-6 hover:border-gold-500 transition-colors cursor-pointer text-center">
                        <Upload className="w-8 h-8 text-cocoa-300 mx-auto mb-2" strokeWidth={1.5} />
                        <div className="font-medium text-sm">{lang === "ar" ? doc.ar : doc.fr}</div>
                        <div className="text-xs text-cocoa-400 mt-1">
                          {lang === "ar" ? "اضغط للرفع · PDF أو صورة" : "Cliquez pour téléverser · PDF ou image"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[14px] p-4 text-xs text-amber-800">
                    {lang === "ar"
                      ? "⓵ ستتم مراجعة وثائقك خلال 24-48 ساعة من قبل فريقنا. لن تتمكن من استقبال طلبات قبل الموافقة."
                      : "⓵ Vos documents seront vérifiés sous 24-48h. Vous ne pourrez pas recevoir de commandes avant validation."}
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold"
                  >
                    <Check className="w-12 h-12 text-white" strokeWidth={2} />
                  </motion.div>
                  <h2 className="font-display text-3xl mb-3">
                    {lang === "ar" ? "تمّ التسجيل بنجاح!" : "Inscription envoyée !"}
                  </h2>
                  <p className="text-cocoa-400 max-w-md mx-auto mb-8">
                    {lang === "ar"
                      ? "وثائقك قيد المراجعة. ستصلك رسالة عبر البريد والهاتف بمجرّد الموافقة. يمكنك في غضون ذلك إعداد متجرك."
                      : "Vos documents sont en cours d'examen. Vous recevrez une confirmation par email et SMS dès validation."}
                  </p>
                  <Badge variant="warn" className="mb-6">
                    {lang === "ar" ? "في انتظار الموافقة" : "En attente de validation"}
                  </Badge>
                </div>
              )}

              <div className={cn("flex items-center justify-between mt-8 pt-6 border-t border-cocoa-900/8", step === STEPS.length - 1 && "justify-center")}>
                {step !== STEPS.length - 1 && (
                  <Button variant="ghost" onClick={() => (step === 0 ? navigate("/") : setStep(step - 1))}>
                    {step === 0 ? (lang === "ar" ? "إلغاء" : "Annuler") : (lang === "ar" ? "السابق" : "Précédent")}
                  </Button>
                )}
                <Button onClick={next}>
                  {step === STEPS.length - 1
                    ? (lang === "ar" ? "اذهب إلى لوحة التحكم" : "Aller au dashboard")
                    : (lang === "ar" ? "متابعة" : "Continuer")}
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
