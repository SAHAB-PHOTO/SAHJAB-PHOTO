import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useLocale } from "@/stores/locale";

export default function OtpVerify() {
  const navigate = useNavigate();
  const { lang } = useLocale();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...code];
    next[i] = v;
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-cream-gradient flex flex-col">
      <div className="container-editorial py-8">
        <Logo />
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-[24px] shadow-elevated p-8 lg:p-10 text-center"
        >
          <div className="w-16 h-16 bg-gold-500/15 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            📱
          </div>
          <h1 className="font-display text-2xl text-cocoa-900 mb-2">
            {lang === "ar" ? "أدخل رمز التحقق" : "Code de vérification"}
          </h1>
          <p className="text-sm text-cocoa-400 mb-8">
            {lang === "ar"
              ? "أرسلنا رمزاً من 6 أرقام إلى رقمك المنتهي بـ ••56"
              : "Nous avons envoyé un code à 6 chiffres au numéro ••56"}
          </p>

          <div className="flex justify-center gap-2 mb-8" dir="ltr">
            {code.map((c, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                value={c}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold border border-cocoa-900/10 rounded-[14px] focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none"
              />
            ))}
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={code.some((c) => !c)}
            onClick={() => navigate("/")}
          >
            {lang === "ar" ? "تحقق" : "Vérifier"}
          </Button>

          <p className="text-sm text-cocoa-400 mt-6">
            {lang === "ar" ? "لم يصلك الرمز؟" : "Pas reçu ?"}{" "}
            <button className="text-gold-700 font-medium hover:underline">
              {lang === "ar" ? "إعادة الإرسال" : "Renvoyer"}
            </button>
          </p>
          <Link to="/auth/signin" className="text-xs text-cocoa-300 mt-4 inline-block hover:text-cocoa-900">
            {lang === "ar" ? "العودة لتسجيل الدخول" : "Retour à la connexion"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
