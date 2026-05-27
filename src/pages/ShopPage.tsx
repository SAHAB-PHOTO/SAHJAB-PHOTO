import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShieldCheck, MapPin, Clock, Award } from "lucide-react";
import { SHOPS, getProductsByShopId, getReviewsByShopId } from "@/data/mock";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { getWilayaByCode, WILAYAS } from "@/data/wilayas";
import { formatDate } from "@/lib/utils";

export default function ShopPage() {
  const { slug } = useParams();
  const { lang } = useLocale();
  const shop = SHOPS.find((s) => s.slug === slug);
  if (!shop) return <div className="container-editorial py-20 text-center">المتجر غير موجود</div>;

  const products = getProductsByShopId(shop.id);
  const reviews = getReviewsByShopId(shop.id);

  return (
    <div>
      <div className="relative h-64 lg:h-96 overflow-hidden">
        <img src={shop.bannerUrl} alt={shop.nameAr} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/80 via-cocoa-900/20 to-transparent" />
      </div>

      <div className="container-editorial">
        <div className="relative -mt-20 lg:-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-[24px] shadow-elevated p-6 lg:p-10"
          >
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <img
                src={shop.logoUrl}
                alt=""
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-md object-cover -mt-12 lg:-mt-20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">{shop.nameAr}</h1>
                  {shop.verified && (
                    <Badge variant="verified">
                      <ShieldCheck className="w-3 h-3" />
                      {lang === "ar" ? "بائع معتمد" : "Certifié"}
                    </Badge>
                  )}
                </div>
                <p className="text-cocoa-400 mb-4 max-w-2xl">{shop.description}</p>
                <div className="flex items-center gap-6 text-sm text-cocoa-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                    <span className="font-semibold text-cocoa-900">{shop.ratingAvg}</span>
                    <span>({shop.reviewCount} {lang === "ar" ? "تقييم" : "avis"})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-600" />
                    {getWilayaByCode(shop.wilayaCode)?.[lang]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold-600" />
                    +{shop.totalSales} {lang === "ar" ? "طلب" : "commandes"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gold-600" />
                    {shop.workingHours}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Story */}
        <section className="mt-12">
          <div className="bg-white rounded-[20px] p-8 lg:p-10 border-r-4 border-gold-500">
            <div className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-3">
              {lang === "ar" ? "قصّتنا" : "Notre histoire"}
            </div>
            <p className="font-amiri text-xl lg:text-2xl text-cocoa-900 leading-loose">
              {shop.story}
            </p>
          </div>
        </section>

        {/* Delivery zones */}
        <section className="mt-12">
          <h2 className="font-display text-2xl mb-4">{lang === "ar" ? "مناطق التوصيل" : "Zones de livraison"}</h2>
          <div className="flex flex-wrap gap-2">
            {shop.deliveryZones.map((code) => (
              <Badge key={code} variant="outline">
                {WILAYAS.find((w) => w.code === code)?.[lang]}
              </Badge>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="mt-16">
          <h2 className="font-display text-3xl text-cocoa-900 mb-8">
            {lang === "ar" ? "مجموعتنا" : "Notre collection"} ({products.length})
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-20 mb-12">
            <h2 className="font-display text-3xl text-cocoa-900 mb-8">
              {lang === "ar" ? "آراء العملاء" : "Avis clients"}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white p-6 rounded-[16px] shadow-soft">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center font-display text-gold-700">
                      {r.buyerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{r.buyerName}</div>
                      <div className="text-xs text-cocoa-300">{formatDate(r.createdAt, lang)}</div>
                    </div>
                    <div className="me-auto flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < r.rating ? "fill-gold-500 text-gold-500" : "text-cocoa-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-cocoa-400 text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
