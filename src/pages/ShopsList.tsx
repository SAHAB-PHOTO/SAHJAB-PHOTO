import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShieldCheck, MapPin } from "lucide-react";
import { SHOPS } from "@/data/mock";
import { useLocale } from "@/stores/locale";
import { getWilayaByCode } from "@/data/wilayas";
import { SectionHeading } from "@/components/SectionHeading";

export default function ShopsList() {
  const { lang } = useLocale();

  return (
    <div className="container-editorial py-12">
      <SectionHeading
        eyebrow={lang === "ar" ? "كل البائعين" : "Tous les vendeurs"}
        title={lang === "ar" ? "حرفيّون اخترناهم بعناية" : "Des artisans triés sur le volet"}
        description={lang === "ar"
          ? "كل بائع يمر بفحص دقيق قبل الانضمام إلى المنصة، لضمان أعلى مستويات الجودة."
          : "Chaque vendeur passe par un processus rigoureux de vérification."
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SHOPS.map((shop, i) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.06 }}
          >
            <Link
              to={`/shop/${shop.slug}`}
              className="block group rounded-[20px] overflow-hidden bg-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
            >
              <div className="aspect-[16/9] overflow-hidden bg-cream-200">
                <img
                  src={shop.bannerUrl}
                  alt={shop.nameAr}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 -mt-12 relative">
                <img
                  src={shop.logoUrl}
                  alt=""
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover mb-4"
                />
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-display text-xl text-cocoa-900">{shop.nameAr}</h3>
                  {shop.verified && <ShieldCheck className="w-5 h-5 text-emerald" />}
                </div>
                <p className="text-sm text-cocoa-400 line-clamp-2 mb-4">{shop.description}</p>
                <div className="flex items-center justify-between text-xs text-cocoa-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                    <span className="font-semibold">{shop.ratingAvg}</span>
                    <span>({shop.reviewCount})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {getWilayaByCode(shop.wilayaCode)?.[lang]}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
