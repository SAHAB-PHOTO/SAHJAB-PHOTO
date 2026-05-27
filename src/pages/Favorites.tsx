import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/stores/locale";
import { SectionHeading } from "@/components/SectionHeading";

export default function Favorites() {
  const { lang } = useLocale();
  const products = getFeaturedProducts().slice(0, 4);

  return (
    <div className="container-editorial py-10">
      <SectionHeading
        eyebrow={lang === "ar" ? "محفوظاتك" : "Vos favoris"}
        title={lang === "ar" ? "قائمة أمنياتك الحلوة" : "Votre wishlist sucrée"}
      />

      {products.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-16 h-16 text-cocoa-300 mx-auto mb-4" strokeWidth={1.2} />
          <h3 className="font-display text-xl mb-2">{lang === "ar" ? "لا يوجد مفضّل بعد" : "Aucun favori pour le moment"}</h3>
          <p className="text-cocoa-400 mb-6">{lang === "ar" ? "أضف ما يعجبك إلى المفضّلة بضغطة قلب." : "Cliquez sur le cœur pour ajouter."}</p>
          <Link to="/browse"><Button>{lang === "ar" ? "تصفّح الحلويات" : "Explorer"}</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
