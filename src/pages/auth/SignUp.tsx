import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/stores/auth";
import { useLocale } from "@/stores/locale";
import { WILAYAS } from "@/data/wilayas";
import { validateAlgerianPhone } from "@/lib/utils";

export default function SignUp() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { lang } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const phone = form.get("phone") as string;
    if (!validateAlgerianPhone(phone)) {
      setError(lang === "ar" ? "رقم الهاتف الجزائري غير صالح" : "Numéro de téléphone invalide");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signIn({
        id: "u-new",
        role: "buyer",
        fullName: form.get("fullName") as string,
        phone,
        email: form.get("email") as string,
        wilayaCode: Number(form.get("wilaya")),
        createdAt: new Date().toISOString(),
      });
      navigate("/auth/otp");
    }, 600);
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
          className="w-full max-w-md bg-white rounded-[24px] shadow-elevated p-8 lg:p-10"
        >
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-cocoa-900 mb-2">
              {lang === "ar" ? "انضم إلى العائلة" : "Rejoignez la famille"}
            </h1>
            <p className="text-sm text-cocoa-400">
              {lang === "ar" ? "أنشئ حسابك في أقل من دقيقة" : "Créez votre compte en moins d'une minute"}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">{lang === "ar" ? "الاسم الكامل" : "Nom complet"}</Label>
              <Input id="fullName" name="fullName" placeholder={lang === "ar" ? "كريمة بن عيسى" : "Karima Ben Aissa"} required />
            </div>

            <div>
              <Label htmlFor="phone">{lang === "ar" ? "رقم الهاتف" : "Téléphone"}</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+213 555 12 34 56" required dir="ltr" />
            </div>

            <div>
              <Label htmlFor="email">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
              <Input id="email" name="email" type="email" placeholder="example@halawiyat.dz" required />
            </div>

            <div>
              <Label htmlFor="wilaya">{lang === "ar" ? "الولاية" : "Wilaya"}</Label>
              <select
                id="wilaya"
                name="wilaya"
                required
                className="flex h-12 w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 text-base focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              >
                <option value="">{lang === "ar" ? "اختر ولايتك" : "Choisissez"}</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code.toString().padStart(2, "0")} · {lang === "ar" ? w.ar : w.fr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="password">{lang === "ar" ? "كلمة المرور" : "Mot de passe"}</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
              {loading
                ? (lang === "ar" ? "جاري الإنشاء..." : "Création...")
                : (lang === "ar" ? "إنشاء حسابي" : "Créer mon compte")}
            </Button>

            <p className="text-xs text-cocoa-400 text-center leading-relaxed">
              {lang === "ar" ? "بإنشائك حساباً فإنك توافق على" : "En vous inscrivant, vous acceptez nos"}{" "}
              <Link to="/legal/terms" className="text-gold-700 hover:underline">
                {lang === "ar" ? "شروط الاستخدام" : "conditions"}
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-cocoa-400 mt-6">
            {lang === "ar" ? "لديك حساب؟" : "Déjà inscrit ?"}{" "}
            <Link to="/auth/signin" className="text-gold-700 font-medium hover:underline">
              {lang === "ar" ? "تسجيل الدخول" : "Se connecter"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
