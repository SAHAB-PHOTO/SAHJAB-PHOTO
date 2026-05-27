import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/stores/auth";
import { useLocale } from "@/stores/locale";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { lang } = useLocale();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    setTimeout(() => {
      signIn({
        id: "u-current",
        role: "buyer",
        fullName: "كريمة بن عيسى",
        phone: "+213 555 12 34 56",
        email: (form.get("email") as string) || "user@example.com",
        wilayaCode: 16,
        createdAt: new Date().toISOString(),
      });
      navigate("/");
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
              {lang === "ar" ? "أهلاً بعودتك" : "Bon retour parmi nous"}
            </h1>
            <p className="text-sm text-cocoa-400">
              {lang === "ar" ? "سجّل دخولك لمواصلة التسوّق" : "Connectez-vous pour continuer"}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">{lang === "ar" ? "البريد الإلكتروني أو الهاتف" : "Email ou téléphone"}</Label>
              <Input id="email" name="email" type="text" placeholder="example@halawiyat.dz" required />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="mb-0">{lang === "ar" ? "كلمة المرور" : "Mot de passe"}</Label>
                <Link to="/auth/forgot" className="text-xs text-gold-700 hover:text-gold-600">
                  {lang === "ar" ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?"}
                </Link>
              </div>
              <Input id="password" name="password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading
                ? (lang === "ar" ? "جاري التحقق..." : "Connexion...")
                : (lang === "ar" ? "تسجيل الدخول" : "Se connecter")}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-cocoa-900/8" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-cocoa-300 tracking-widest">
                  {lang === "ar" ? "أو" : "OU"}
                </span>
              </div>
            </div>

            <Link to="/auth/otp" className="block">
              <Button type="button" variant="outline" size="lg" className="w-full">
                {lang === "ar" ? "الدخول برمز OTP عبر الهاتف" : "Connexion par OTP"}
              </Button>
            </Link>
          </form>

          <p className="text-center text-sm text-cocoa-400 mt-8">
            {lang === "ar" ? "ليس لديك حساب؟" : "Pas encore inscrit ?"}{" "}
            <Link to="/auth/signup" className="text-gold-700 font-medium hover:underline">
              {lang === "ar" ? "أنشئ حساباً" : "Créer un compte"}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
