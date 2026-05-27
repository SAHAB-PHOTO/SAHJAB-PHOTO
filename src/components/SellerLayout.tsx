import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  DollarSign,
  Store,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/auth";
import { useLocale } from "@/stores/locale";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/seller/dashboard", Icon: LayoutDashboard, ar: "لوحة التحكم", fr: "Tableau de bord" },
  { to: "/seller/products", Icon: Package, ar: "المنتجات", fr: "Produits" },
  { to: "/seller/orders", Icon: ShoppingBag, ar: "الطلبات", fr: "Commandes", badge: 3 },
  { to: "/seller/earnings", Icon: DollarSign, ar: "الأرباح", fr: "Gains" },
  { to: "/seller/shop", Icon: Store, ar: "إعدادات المتجر", fr: "Boutique" },
];

export function SellerLayout() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { lang } = useLocale();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-white border-l border-cocoa-900/8 flex-col">
        <div className="p-6 border-b border-cocoa-900/8">
          <Logo />
        </div>

        <div className="p-4 border-b border-cocoa-900/8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gold-gradient flex items-center justify-center text-white font-display">
              {profile?.fullName?.charAt(0) || "B"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{profile?.fullName || "بائع"}</div>
              <Badge variant="verified" className="mt-1">✓ {lang === "ar" ? "معتمد" : "Certifié"}</Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, Icon, ar, fr, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold-500/10 text-gold-700"
                    : "text-cocoa-900 hover:bg-cream-200"
                )
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.6} />
              <span className="flex-1">{lang === "ar" ? ar : fr}</span>
              {badge ? <Badge variant="default">{badge}</Badge> : null}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cocoa-900/8">
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-red-600 hover:bg-red-50 w-full"
          >
            <LogOut className="w-4 h-4" />
            {lang === "ar" ? "تسجيل الخروج" : "Déconnexion"}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-cocoa-900/8 px-6 py-3 flex items-center gap-3 lg:hidden">
          <Logo />
          <button className="ms-auto p-2 rounded-full hover:bg-cream-200 relative">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
          </button>
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-cocoa-900/8">
          <div className="grid grid-cols-5">
            {NAV.map(({ to, Icon, ar, fr }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px]",
                    isActive ? "text-gold-700" : "text-cocoa-400"
                  )
                }
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span>{lang === "ar" ? ar : fr}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
