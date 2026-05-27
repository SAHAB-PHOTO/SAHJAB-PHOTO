import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Globe, User, Menu, X, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useCart } from "@/stores/cart";
import { useLocale } from "@/stores/locale";
import { useAuth } from "@/stores/auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", ar: "الرئيسية", fr: "Accueil" },
  { to: "/browse", ar: "تصفّح", fr: "Catalogue" },
  { to: "/shops", ar: "البائعون", fr: "Vendeurs" },
  { to: "/seller/onboarding", ar: "كن بائعاً", fr: "Devenir vendeur" },
];

export function Header() {
  const navigate = useNavigate();
  const cartCount = useCart((s) => s.count());
  const { lang, toggle } = useLocale();
  const { profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-cocoa-900/5">
      <div className="container-editorial">
        <div className="flex items-center justify-between h-20 gap-8">
          <Logo />

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-gold-700 bg-gold-500/10"
                      : "text-cocoa-900 hover:text-gold-700 hover:bg-cream-200"
                  )
                }
              >
                {lang === "ar" ? item.ar : item.fr}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <button
              aria-label="Search"
              onClick={() => navigate("/browse")}
              className="p-2.5 rounded-full hover:bg-cream-200 transition-colors"
            >
              <Search className="w-5 h-5 text-cocoa-900" strokeWidth={1.5} />
            </button>
            <button
              aria-label="Toggle language"
              onClick={toggle}
              className="p-2.5 rounded-full hover:bg-cream-200 transition-colors flex items-center gap-1.5 text-sm font-medium"
            >
              <Globe className="w-4 h-4" strokeWidth={1.5} />
              <span>{lang === "ar" ? "FR" : "ع"}</span>
            </button>
            <Link
              to="/favorites"
              aria-label="Favorites"
              className="p-2.5 rounded-full hover:bg-cream-200 transition-colors"
            >
              <Heart className="w-5 h-5 text-cocoa-900" strokeWidth={1.5} />
            </Link>
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full hover:bg-cream-200 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-cocoa-900" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {profile ? (
              <Link
                to={
                  profile.role === "admin"
                    ? "/admin"
                    : profile.role === "seller"
                    ? "/seller/dashboard"
                    : "/account"
                }
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  {profile.fullName.split(" ")[0]}
                </Button>
              </Link>
            ) : (
              <Link to="/auth/signin">
                <Button size="sm">{lang === "ar" ? "تسجيل الدخول" : "Connexion"}</Button>
              </Link>
            )}
          </div>

          <button
            className="lg:hidden p-2"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-cocoa-900/5 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-3 rounded-lg font-medium",
                    isActive
                      ? "bg-gold-500/10 text-gold-700"
                      : "text-cocoa-900"
                  )
                }
              >
                {lang === "ar" ? item.ar : item.fr}
              </NavLink>
            ))}
            <div className="flex items-center gap-2 pt-2 border-t border-cocoa-900/5">
              <button
                onClick={toggle}
                className="flex-1 py-2 text-sm font-medium border border-cocoa-900/10 rounded-lg"
              >
                {lang === "ar" ? "Français" : "العربية"}
              </button>
              {!profile && (
                <Link to="/auth/signin" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    {lang === "ar" ? "تسجيل الدخول" : "Connexion"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
