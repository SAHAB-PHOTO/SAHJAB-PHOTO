import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useLocale } from "@/stores/locale";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { WILAYAS } from "@/data/wilayas";

export function Footer() {
  const { lang } = useLocale();

  return (
    <footer className="bg-cocoa-900 text-cream mt-24">
      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="text-sm text-cream/70 leading-relaxed max-w-xs">
              {lang === "ar"
                ? "منصة فاخرة تجمع بين أمهر صانعي الحلويات الجزائريين وعشاق الذوق الرفيع في كل ولايات الوطن."
                : "La plateforme premium qui réunit les meilleurs pâtissiers algériens et les amateurs de raffinement à travers toutes les wilayas."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold-500/20 hover:border-gold-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-cream/20 flex items-center justify-center hover:bg-gold-500/20 hover:border-gold-500 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-base mb-5 text-gold-500">
              {lang === "ar" ? "اكتشف" : "Découvrir"}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><Link to="/browse" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "تصفّح الحلويات" : "Parcourir"}</Link></li>
              <li><Link to="/shops" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "البائعون المعتمدون" : "Vendeurs certifiés"}</Link></li>
              <li><Link to="/categories" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "الفئات" : "Catégories"}</Link></li>
              <li><Link to="/featured" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "الأكثر تميزاً" : "Coups de cœur"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base mb-5 text-gold-500">
              {lang === "ar" ? "للبائعين" : "Pour les vendeurs"}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li><Link to="/seller/onboarding" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "كن بائعاً" : "Devenir vendeur"}</Link></li>
              <li><Link to="/seller/dashboard" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "لوحة التحكم" : "Tableau de bord"}</Link></li>
              <li><Link to="/help" className="hover:text-gold-500 transition-colors">{lang === "ar" ? "مركز المساعدة" : "Aide"}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base mb-5 text-gold-500">
              {lang === "ar" ? "تواصل معنا" : "Contact"}
            </h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                <span>{lang === "ar" ? "حيدرة، الجزائر العاصمة" : "Hydra, Alger"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+213000000000" className="hover:text-gold-500" dir="ltr">+213 770 00 00 00</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:hello@halawiyat.dz" className="hover:text-gold-500">hello@halawiyat.dz</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-cream/10">
          <h4 className="font-display text-sm text-gold-500 mb-4 uppercase tracking-widest">
            {lang === "ar" ? "نُغطّي 58 ولاية في الجزائر" : "Nous couvrons les 58 wilayas d'Algérie"}
          </h4>
          <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs text-cream/50">
            {WILAYAS.map((w) => (
              <span key={w.code} className="hover:text-gold-500 transition-colors">
                {lang === "ar" ? w.ar : w.fr}
                {w.code < 58 && <span className="mx-1 text-cream/20">·</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream/40">
          <span>© 2026 Halawiyat El Djazair · {lang === "ar" ? "جميع الحقوق محفوظة" : "Tous droits réservés"}</span>
          <div className="flex items-center gap-6">
            <Link to="/legal/terms" className="hover:text-gold-500">{lang === "ar" ? "الشروط" : "CGU"}</Link>
            <Link to="/legal/privacy" className="hover:text-gold-500">{lang === "ar" ? "الخصوصية" : "Confidentialité"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
