import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Star,
  ChevronLeft,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/data/categories";
import { SHOPS, getFeaturedProducts, getTopRatedProducts } from "@/data/mock";
import { useLocale } from "@/stores/locale";
import { getWilayaByCode } from "@/data/wilayas";

export default function Landing() {
  const { lang } = useLocale();
  const featured = getFeaturedProducts();
  const topRated = getTopRatedProducts(8);
  const featuredShops = SHOPS.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-bl from-cream via-cream-200 to-gold-50" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #C9A961 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container-editorial pt-16 lg:pt-24 pb-20 lg:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="default" className="mb-6 px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "السوق الفاخر للحلويات الجزائرية" : "Le marché premium des pâtisseries algériennes"}</span>
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-5xl lg:text-7xl xl:text-[80px] leading-[1.05] text-cocoa-900 tracking-tight text-balance"
              >
                {lang === "ar" ? (
                  <>
                    حلاوة <span className="gold-text">جزائريّة</span>
                    <br />
                    في طبقها الأصلي.
                  </>
                ) : (
                  <>
                    L'âme <span className="gold-text">sucrée</span>
                    <br />
                    de l'Algérie.
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg lg:text-xl text-cocoa-400 leading-relaxed max-w-xl"
              >
                {lang === "ar"
                  ? "من بقلاوة قسنطينة إلى مقروط الجنوب، اكتشف أجود الحلويات التقليدية والعصرية من أمهر الصنّاع في 58 ولاية، وصلت إلى بابك."
                  : "De la baklawa de Constantine au makroud du Sud, découvrez le meilleur du savoir-faire algérien — livré chez vous dans les 58 wilayas."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <Link to="/browse">
                  <Button size="lg" className="group w-full sm:w-auto">
                    {lang === "ar" ? "تصفّح الحلويات" : "Explorer la collection"}
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" />
                  </Button>
                </Link>
                <Link to="/seller/onboarding">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {lang === "ar" ? "كن بائعاً معتمداً" : "Devenir vendeur"}
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 pt-8 border-t border-cocoa-900/8"
              >
                <div>
                  <div className="font-display text-3xl gold-text font-bold">+240</div>
                  <div className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "بائع معتمد" : "Vendeurs certifiés"}</div>
                </div>
                <div>
                  <div className="font-display text-3xl gold-text font-bold">58</div>
                  <div className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "ولاية مغطّاة" : "Wilayas couvertes"}</div>
                </div>
                <div>
                  <div className="font-display text-3xl gold-text font-bold">4.9★</div>
                  <div className="text-xs text-cocoa-400 mt-1">{lang === "ar" ? "تقييم المنصة" : "Note moyenne"}</div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&h=1500&fit=crop"
                  alt="Premium Algerian sweets"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/40 via-transparent to-transparent" />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1604423043492-41303f9c4806?w=80&h=80&fit=crop"
                      alt=""
                      className="w-14 h-14 rounded-full object-cover border-2 border-gold-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-cocoa-900">دار الحلوى القسنطينية</span>
                        <ShieldCheck className="w-4 h-4 text-emerald" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-cocoa-400 mt-1">
                        <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                        <span>4.9 · 847 تقييم</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">زيارة</Button>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="hidden lg:flex absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-elevated gap-3 items-center max-w-[240px]"
              >
                <div className="w-10 h-10 rounded-full bg-gold-500/15 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-cocoa-900">جودة معتمدة</div>
                  <div className="text-xs text-cocoa-400">كل بائع يمر بتحقق صارم</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="gold-divider" />
      </section>

      {/* HOW IT WORKS */}
      <section className="container-editorial py-20 lg:py-28">
        <SectionHeading
          eyebrow={lang === "ar" ? "كيف يعمل" : "Comment ça marche"}
          title={lang === "ar" ? "ثلاث خطوات تفصلك عن أجود الحلويات" : "Trois étapes vers l'excellence"}
          description={lang === "ar" ? "تجربة طلب سلسة، من اللحظة التي تفتح فيها المنصة إلى أن يصل طلبك بأبهى تغليف." : "Une expérience fluide, du clic à la livraison."}
          align="center"
        />

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mt-16">
          {[
            {
              num: "01",
              titleAr: "اختر بائعك",
              titleFr: "Choisissez votre artisan",
              descAr: "تصفّح بائعين معتمدين في ولايتك. كل متجر يحمل شهادة جودة وتاريخاً من الحرفيّة.",
              descFr: "Parcourez des artisans certifiés dans votre wilaya, chacun avec son histoire et sa signature.",
            },
            {
              num: "02",
              titleAr: "أنشئ طلبك",
              titleFr: "Composez votre commande",
              descAr: "اختر من تشكيلة فاخرة، حدد الكمية، وادفع بأمان عبر CIB أو الذهبية أو BaridiMob.",
              descFr: "Sélectionnez vos pièces, payez en toute sécurité (CIB, Edahabia, BaridiMob ou à la livraison).",
            },
            {
              num: "03",
              titleAr: "تابع وصول الطلب",
              titleFr: "Suivez votre livraison",
              descAr: "تتبع طلبك مباشرة من التحضير إلى بابك، مع تغليف يليق بالهدية.",
              descFr: "Suivez votre commande en temps réel, du four à votre porte, dans un écrin digne d'un cadeau.",
            },
          ].map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-[20px] p-8 lg:p-10 shadow-soft hover:shadow-elevated transition-all duration-500 h-full">
                <div className="font-display text-6xl lg:text-7xl gold-text font-bold opacity-90 mb-6">
                  {step.num}
                </div>
                <h3 className="font-display text-2xl text-cocoa-900 mb-3">
                  {lang === "ar" ? step.titleAr : step.titleFr}
                </h3>
                <p className="text-cocoa-400 leading-relaxed">
                  {lang === "ar" ? step.descAr : step.descFr}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-editorial py-16">
        <SectionHeading
          eyebrow={lang === "ar" ? "الفئات" : "Catégories"}
          title={lang === "ar" ? "اكتشف العالم الحلو" : "Explorez l'univers gourmand"}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/browse?category=${cat.slug}`}
                className="group block bg-white rounded-[14px] p-6 text-center hover:shadow-gold border border-transparent hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="text-4xl mb-3 transition-transform group-hover:scale-110">
                  {cat.icon}
                </div>
                <div className="font-display text-sm text-cocoa-900 leading-tight">
                  {lang === "ar" ? cat.ar : cat.fr}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED SHOPS */}
      <section className="container-editorial py-20 lg:py-24">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-gold-500" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold-600 font-medium">
                {lang === "ar" ? "الحرفيّون" : "Les artisans"}
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-5xl text-cocoa-900 text-balance">
              {lang === "ar" ? "بائعون اخترناهم بعناية" : "Vendeurs sélectionnés avec soin"}
            </h2>
          </div>
          <Link to="/shops" className="text-gold-700 font-medium hover:gap-2 transition-all flex items-center gap-1">
            <span>{lang === "ar" ? "كل البائعين" : "Tous les vendeurs"}</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <Link
                to={`/shop/${shop.slug}`}
                className="block group rounded-[14px] overflow-hidden bg-white shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className="aspect-[5/3] overflow-hidden bg-cream-200">
                  <img
                    src={shop.bannerUrl}
                    alt={shop.nameAr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 -mt-10 relative">
                  <img
                    src={shop.logoUrl}
                    alt=""
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover mb-3"
                  />
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base text-cocoa-900 line-clamp-1">{shop.nameAr}</h3>
                    {shop.verified && <ShieldCheck className="w-4 h-4 text-emerald shrink-0" />}
                  </div>
                  <div className="text-xs text-cocoa-400 mb-3">
                    {getWilayaByCode(shop.wilayaCode)?.ar}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      <span className="font-semibold">{shop.ratingAvg}</span>
                      <span className="text-cocoa-300">({shop.reviewCount})</span>
                    </div>
                    <span className="text-xs text-cocoa-300">+{shop.totalSales} طلب</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-editorial">
          <SectionHeading
            eyebrow={lang === "ar" ? "الأكثر تميّزاً" : "Coups de cœur"}
            title={lang === "ar" ? "قطع لا يجب أن تفوّتها" : "Les incontournables"}
            description={lang === "ar" ? "اختيارات الخبراء من المنصة، أكثر القطع تميّزاً هذا الأسبوع." : "Notre sélection éditoriale de la semaine."}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {featured.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP RATED */}
      <section className="container-editorial py-20 lg:py-24">
        <SectionHeading
          eyebrow={lang === "ar" ? "الأعلى تقييماً" : "Mieux notés"}
          title={lang === "ar" ? "أبدع ما اختاره عملاؤنا" : "Plébiscités par nos clients"}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {topRated.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* BECOME A SELLER */}
      <section className="container-editorial py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[24px] overflow-hidden bg-cocoa-900"
        >
          <div className="absolute inset-0 opacity-30">
            <img
              src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&h=900&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-cocoa-900 via-cocoa-900/90 to-cocoa-900/40" />

          <div className="relative p-10 lg:p-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="default" className="bg-gold-500/20 border-gold-500/40 text-gold-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "انضم إلى المنصة" : "Rejoignez-nous"}</span>
              </Badge>

              <h2 className="font-display text-4xl lg:text-6xl text-cream leading-tight text-balance">
                {lang === "ar"
                  ? "اعرض حرفتك على آلاف المتذوّقين"
                  : "Présentez votre savoir-faire à des milliers de gourmets"}
              </h2>

              <p className="text-lg text-cream/70 leading-relaxed max-w-lg">
                {lang === "ar"
                  ? "انضم إلى أكثر من 240 بائعاً معتمداً يبيعون عبر منصتنا. سجّل، اعرض منتجاتك، وابدأ الاستلام في أيام."
                  : "Rejoignez plus de 240 vendeurs certifiés. Inscrivez-vous, présentez vos créations, commencez à vendre."}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/seller/onboarding">
                  <Button size="lg" className="bg-gold-gradient">
                    {lang === "ar" ? "ابدأ التسجيل" : "Commencer"}
                  </Button>
                </Link>
                <Link to="/help/sellers">
                  <Button size="lg" variant="ghost" className="text-cream hover:bg-cream/10 hover:text-cream">
                    {lang === "ar" ? "تعرف على شروط الانضمام" : "En savoir plus"}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Award, ar: "عمولة منخفضة", fr: "Commission basse", val: "10٪" },
                { icon: Truck, ar: "توصيل مدمج", fr: "Livraison intégrée", val: "58 ولاية" },
                { icon: ShieldCheck, ar: "دفعات أمنة", fr: "Paiements sûrs", val: "أسبوعياً" },
                { icon: Heart, ar: "دعم متواصل", fr: "Support dédié", val: "24/7" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-cream/5 border border-cream/10 backdrop-blur-md rounded-[14px] p-5"
                >
                  <item.icon className="w-6 h-6 text-gold-500 mb-3" strokeWidth={1.5} />
                  <div className="font-display text-2xl text-cream mb-1">{item.val}</div>
                  <div className="text-xs text-cream/60">{lang === "ar" ? item.ar : item.fr}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
