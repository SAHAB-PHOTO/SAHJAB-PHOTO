import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { useLocale } from "@/stores/locale";
import { useState } from "react";

export default function Forgot() {
  const { lang } = useLocale();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-cream-gradient flex flex-col">
      <div className="container-editorial py-8"><Logo /></div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-[24px] shadow-elevated p-8 lg:p-10"
        >
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald/15 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                ✉️
              </div>
              <h1 className="font-display text-2xl text-cocoa-900 mb-2">
                {lang === "ar" ? "تم إرسال الرابط" : "Lien envoyé"}
              </h1>
              <p className="text-sm text-cocoa-400 mb-6">
                {lang === "ar"
                  ? "تحقق من بريدك الإلكتروني لإعادة تعيين كلمة المرور"
                  : "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"}
              </p>
              <Link to="/auth/signin">
                <Button variant="outline" size="lg" className="w-full">
                  {lang === "ar" ? "العودة لتسجيل الدخول" : "Retour à la connexion"}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl text-cocoa-900 mb-2">
                  {lang === "ar" ? "نسيت كلمة المرور؟" : "Mot de passe oublié ?"}
                </h1>
                <p className="text-sm text-cocoa-400">
                  {lang === "ar" ? "أدخل بريدك وسنرسل رابط الاستعادة" : "Entrez votre email pour recevoir le lien"}
                </p>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email">{lang === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input id="email" type="email" required />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  {lang === "ar" ? "أرسل الرابط" : "Envoyer le lien"}
                </Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
