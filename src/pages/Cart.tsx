import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { useCart } from "@/stores/cart";
import { useLocale } from "@/stores/locale";
import { Button } from "@/components/ui/button";
import { formatDZD } from "@/lib/utils";

export default function Cart() {
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { items, updateQuantity, removeItem, total } = useCart();
  const deliveryFee = items.length > 0 ? 500 : 0;
  const subtotal = total();
  const grandTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-editorial py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-200 flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-cocoa-300" strokeWidth={1.2} />
          </div>
          <h1 className="font-display text-3xl text-cocoa-900 mb-3">
            {lang === "ar" ? "سلتك فارغة" : "Votre panier est vide"}
          </h1>
          <p className="text-cocoa-400 mb-8">
            {lang === "ar"
              ? "اكتشف أجود الحلويات الجزائرية وأضفها إلى سلتك."
              : "Découvrez nos pâtisseries et ajoutez-les à votre panier."}
          </p>
          <Link to="/browse">
            <Button size="lg">{lang === "ar" ? "تصفّح الحلويات" : "Explorer le catalogue"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-editorial py-10">
      <h1 className="font-display text-4xl text-cocoa-900 mb-8">
        {lang === "ar" ? "سلّة التسوّق" : "Mon panier"}
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-[16px] p-4 shadow-soft flex items-center gap-4"
            >
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <img src={item.photo} alt="" className="w-24 h-24 rounded-[12px] object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.productId}`} className="font-display text-base text-cocoa-900 hover:text-gold-700 line-clamp-2">
                  {item.nameAr}
                </Link>
                <div className="text-sm gold-text font-bold mt-1">{formatDZD(item.priceDzd)}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center bg-cream-200 rounded-[10px] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-9 h-9 hover:bg-cream-300"
                    >–</button>
                    <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-9 h-9 hover:bg-cream-300"
                    >+</button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-cocoa-300 hover:text-red-600 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-end shrink-0">
                <div className="font-display text-lg font-bold">
                  {formatDZD(item.priceDzd * item.quantity)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[20px] p-6 shadow-soft sticky top-28 space-y-4">
            <h2 className="font-display text-xl">{lang === "ar" ? "ملخّص الطلب" : "Récapitulatif"}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-cocoa-400">{lang === "ar" ? "المجموع الفرعي" : "Sous-total"}</span>
                <span className="font-semibold">{formatDZD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cocoa-400">{lang === "ar" ? "التوصيل" : "Livraison"}</span>
                <span className="font-semibold">{formatDZD(deliveryFee)}</span>
              </div>
              <div className="h-px bg-cocoa-900/8" />
              <div className="flex justify-between items-baseline">
                <span className="font-display text-base">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="font-display text-2xl gold-text font-bold">{formatDZD(grandTotal)}</span>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={() => navigate("/checkout")}>
              {lang === "ar" ? "إتمام الطلب" : "Passer commande"}
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </Button>
            <Link to="/browse" className="text-center block text-sm text-cocoa-400 hover:text-gold-700 transition-colors">
              {lang === "ar" ? "مواصلة التسوق" : "Continuer mes achats"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
