import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Clock, ShoppingBag, Heart, MapPin, ChevronLeft } from "lucide-react";
import { getProductById, getShopById, getReviewsByProductId, getProductsByShopId } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/stores/cart";
import { useLocale } from "@/stores/locale";
import { formatDZD, formatDate } from "@/lib/utils";
import { getWilayaByCode } from "@/data/wilayas";
import { ProductCard } from "@/components/ProductCard";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLocale();
  const product = id ? getProductById(id) : undefined;
  const shop = product ? getShopById(product.shopId) : undefined;
  const reviews = product ? getReviewsByProductId(product.id) : [];
  const related = shop ? getProductsByShopId(shop.id).filter((p) => p.id !== product?.id).slice(0, 4) : [];
  const [photoIndex, setPhotoIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);

  if (!product || !shop) {
    return <div className="container-editorial py-20 text-center">المنتج غير موجود</div>;
  }

  const onAddToCart = () => {
    addItem({
      productId: product.id,
      shopId: product.shopId,
      nameAr: product.nameAr,
      priceDzd: product.priceDzd,
      photo: product.photos[0],
      quantity: qty,
    });
    navigate("/cart");
  };

  return (
    <div className="container-editorial py-8">
      <div className="text-sm text-cocoa-400 mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-gold-700">{lang === "ar" ? "الرئيسية" : "Accueil"}</Link>
        <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
        <Link to="/browse" className="hover:text-gold-700">{lang === "ar" ? "المنتجات" : "Produits"}</Link>
        <ChevronLeft className="w-3 h-3 rtl:rotate-180" />
        <span className="text-cocoa-900 line-clamp-1">{product.nameAr}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-[24px] overflow-hidden bg-white shadow-soft mb-4"
          >
            <img
              src={product.photos[photoIndex]}
              alt={product.nameAr}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-3">
            {product.photos.map((src, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className={`aspect-square rounded-[12px] overflow-hidden border-2 transition-all ${
                  i === photoIndex ? "border-gold-500" : "border-transparent hover:border-gold-500/40"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.featured && <Badge variant="default">✦ مميّز</Badge>}
              <Badge variant="outline">
                <Clock className="w-3 h-3" />
                {product.prepTimeHours}{lang === "ar" ? " ساعة تحضير" : "h de préparation"}
              </Badge>
            </div>
            <h1 className="font-display text-4xl lg:text-5xl text-cocoa-900 leading-tight mb-3">
              {product.nameAr}
            </h1>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                <span className="font-semibold">{product.ratingAvg.toFixed(1)}</span>
                <span className="text-cocoa-400">({product.reviewCount} {lang === "ar" ? "تقييم" : "avis"})</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="font-display text-4xl gold-text font-bold">
              {formatDZD(product.priceDzd)}
            </span>
            <span className="text-sm text-cocoa-400">
              {product.stock > 0
                ? `${product.stock} ${lang === "ar" ? "متوفر" : "en stock"}`
                : lang === "ar" ? "نفذت الكمية" : "Rupture"}
            </span>
          </div>

          <p className="text-cocoa-400 leading-relaxed">{product.description}</p>

          {/* Shop card */}
          <Link
            to={`/shop/${shop.slug}`}
            className="flex items-center gap-4 p-4 rounded-[16px] bg-cream-200 hover:bg-cream-300 transition-colors"
          >
            <img src={shop.logoUrl} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-cocoa-900">{shop.nameAr}</span>
                {shop.verified && <ShieldCheck className="w-4 h-4 text-emerald" />}
              </div>
              <div className="flex items-center gap-3 text-xs text-cocoa-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {getWilayaByCode(shop.wilayaCode)?.[lang]}
                </span>
                <span>·</span>
                <span>{shop.ratingAvg}★ · {shop.reviewCount} {lang === "ar" ? "تقييم" : "avis"}</span>
              </div>
            </div>
            <ChevronLeft className="w-5 h-5 text-cocoa-300 rtl:rotate-180" />
          </Link>

          {/* Quantity + Add to cart */}
          <div className="flex items-stretch gap-3">
            <div className="flex items-center bg-cream-200 rounded-[14px] overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-14 flex items-center justify-center text-xl font-bold hover:bg-cream-300"
              >–</button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-12 h-14 flex items-center justify-center text-xl font-bold hover:bg-cream-300"
              >+</button>
            </div>
            <Button size="lg" className="flex-1" onClick={onAddToCart}>
              <ShoppingBag className="w-5 h-5" />
              {lang === "ar" ? "أضف إلى السلة" : "Ajouter au panier"}
            </Button>
            <Button size="lg" variant="outline" aria-label="Favori" className="!px-4">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Ingredients & allergens */}
          <div className="grid grid-cols-1 gap-4 pt-4 border-t border-cocoa-900/8">
            <div>
              <h4 className="font-semibold text-sm text-cocoa-900 mb-2">
                {lang === "ar" ? "المكوّنات" : "Ingrédients"}
              </h4>
              <p className="text-sm text-cocoa-400">
                {product.ingredients.join(lang === "ar" ? "، " : ", ")}
              </p>
            </div>
            {product.allergens.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm text-cocoa-900 mb-2">
                  {lang === "ar" ? "محتمل وجود الحساسية من" : "Allergènes"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((a) => (
                    <Badge key={a} variant="warn">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="font-display text-3xl text-cocoa-900 mb-8">
          {lang === "ar" ? "آراء العملاء" : "Avis clients"}
        </h2>
        {reviews.length === 0 ? (
          <p className="text-cocoa-400">{lang === "ar" ? "لا توجد آراء بعد" : "Aucun avis pour le moment"}</p>
        ) : (
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
        )}
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl text-cocoa-900 mb-8">
            {lang === "ar" ? "من نفس البائع" : "Du même artisan"}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
