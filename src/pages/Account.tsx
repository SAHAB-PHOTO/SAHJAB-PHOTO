import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Heart, MapPin, LogOut, Star, ChevronLeft, User } from "lucide-react";
import { useAuth } from "@/stores/auth";
import { useLocale } from "@/stores/locale";
import { ORDERS } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDZD, formatDate } from "@/lib/utils";
import { getWilayaByCode } from "@/data/wilayas";

const STATUS_COLORS: Record<string, "default" | "verified" | "warn" | "success"> = {
  pending: "warn",
  preparing: "default",
  ready: "default",
  delivered: "success",
  cancelled: "warn",
};

const STATUS_LABEL = {
  ar: { pending: "قيد التأكيد", preparing: "قيد التحضير", ready: "في الطريق", delivered: "تم التسليم", cancelled: "ملغى" },
  fr: { pending: "Confirmé", preparing: "En préparation", ready: "En route", delivered: "Livré", cancelled: "Annulé" },
} as const;

export default function Account() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { lang } = useLocale();

  if (!profile) {
    return (
      <div className="container-editorial py-20 text-center">
        <div className="max-w-md mx-auto">
          <User className="w-16 h-16 text-cocoa-300 mx-auto mb-4" strokeWidth={1.2} />
          <h2 className="font-display text-2xl mb-3">{lang === "ar" ? "يرجى تسجيل الدخول" : "Veuillez vous connecter"}</h2>
          <Link to="/auth/signin">
            <Button size="lg">{lang === "ar" ? "تسجيل الدخول" : "Connexion"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial py-10">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-[20px] p-6 shadow-soft sticky top-28">
            <div className="text-center pb-5 border-b border-cocoa-900/8">
              <div className="w-20 h-20 rounded-full bg-gold-gradient mx-auto mb-3 flex items-center justify-center text-2xl font-display text-white">
                {profile.fullName.charAt(0)}
              </div>
              <div className="font-display text-lg">{profile.fullName}</div>
              <div className="text-xs text-cocoa-400 mt-1" dir="ltr">{profile.phone}</div>
            </div>

            <nav className="mt-5 space-y-1">
              {[
                { Icon: Package, ar: "طلباتي", fr: "Mes commandes", to: "/account" },
                { Icon: Heart, ar: "المفضّلة", fr: "Favoris", to: "/favorites" },
                { Icon: MapPin, ar: "العناوين", fr: "Adresses", to: "/account/addresses" },
                { Icon: User, ar: "بياناتي", fr: "Mon profil", to: "/account/profile" },
              ].map(({ Icon, ar, fr, to }) => (
                <Link key={to} to={to} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-cream-200 transition-colors">
                  <Icon className="w-4 h-4 text-gold-600" strokeWidth={1.5} />
                  <span>{lang === "ar" ? ar : fr}</span>
                </Link>
              ))}
              <button
                onClick={() => { signOut(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span>{lang === "ar" ? "تسجيل الخروج" : "Déconnexion"}</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
              {lang === "ar" ? "طلباتي" : "Mes commandes"}
            </h1>
            <Badge variant="default">{ORDERS.length}</Badge>
          </div>

          <div className="space-y-4">
            {ORDERS.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to={`/order/${order.id}`}
                  className="block bg-white rounded-[16px] p-5 lg:p-6 shadow-soft hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-cocoa-300">{order.id}</div>
                      <div className="font-display text-lg mt-1">{order.shopNameAr}</div>
                      <div className="text-xs text-cocoa-400 mt-1">
                        {formatDate(order.createdAt, lang)} · {getWilayaByCode(order.deliveryWilayaCode)?.[lang]}
                      </div>
                    </div>
                    <Badge variant={STATUS_COLORS[order.status]}>
                      {STATUS_LABEL[lang][order.status as keyof typeof STATUS_LABEL.ar]}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <img key={item.productId} src={item.photo} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-cream-200 flex items-center justify-center text-xs font-semibold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-cocoa-900/8 pt-4">
                    <div className="text-sm text-cocoa-400">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} {lang === "ar" ? "قطعة" : "articles"}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-lg gold-text font-bold">{formatDZD(order.total)}</span>
                      <ChevronLeft className="w-4 h-4 text-cocoa-300 rtl:rotate-180" />
                    </div>
                  </div>

                  {order.status === "delivered" && (
                    <div className="mt-4 pt-4 border-t border-cocoa-900/8">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Star className="w-4 h-4" />
                        {lang === "ar" ? "قيّم طلبك" : "Évaluer"}
                      </Button>
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
