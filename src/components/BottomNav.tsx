import { NavLink } from "react-router-dom";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/stores/cart";
import { useLocale } from "@/stores/locale";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const cartCount = useCart((s) => s.count());
  const { lang } = useLocale();

  const items = [
    { to: "/", Icon: Home, ar: "الرئيسية", fr: "Accueil" },
    { to: "/browse", Icon: Search, ar: "تصفّح", fr: "Catalogue" },
    { to: "/cart", Icon: ShoppingBag, ar: "السلة", fr: "Panier", badge: cartCount },
    { to: "/favorites", Icon: Heart, ar: "المفضلة", fr: "Favoris" },
    { to: "/account", Icon: User, ar: "حسابي", fr: "Compte" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream/95 backdrop-blur-xl border-t border-cocoa-900/8 shadow-elevated">
      <div className="flex items-stretch justify-around">
        {items.map(({ to, Icon, ar, fr, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "relative flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-xs transition-colors",
                isActive ? "text-gold-700" : "text-cocoa-400"
              )
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" strokeWidth={1.6} />
              {badge && badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-gold-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </div>
            <span className="font-medium">{lang === "ar" ? ar : fr}</span>
          </NavLink>
        ))}
      </div>
      <div className="h-safe-area-inset-bottom" />
    </nav>
  );
}
