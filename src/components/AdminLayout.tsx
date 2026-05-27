import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  Store,
  Users,
  FolderTree,
  Percent,
  AlertTriangle,
  FileBarChart2,
  ShieldAlert,
  LogOut,
  Bell,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/auth";
import { useLocale } from "@/stores/locale";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", end: true, Icon: LayoutDashboard, ar: "نظرة شاملة", fr: "Vue d'ensemble" },
  { to: "/admin/sellers", Icon: Store, ar: "البائعون", fr: "Vendeurs", badge: 3 },
  { to: "/admin/users", Icon: Users, ar: "المستخدمون", fr: "Utilisateurs" },
  { to: "/admin/categories", Icon: FolderTree, ar: "الفئات", fr: "Catégories" },
  { to: "/admin/commissions", Icon: Percent, ar: "العمولات", fr: "Commissions" },
  { to: "/admin/disputes", Icon: AlertTriangle, ar: "النزاعات", fr: "Litiges", badge: 2 },
  { to: "/admin/reports", Icon: FileBarChart2, ar: "التقارير", fr: "Rapports" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { lang } = useLocale();

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 bg-cocoa-900 text-cream flex-col">
        <div className="p-6 border-b border-cream/10">
          <div className="flex items-center gap-2">
            <Logo variant="light" />
          </div>
          <Badge variant="cocoa" className="mt-3 bg-gold-500/20 border-gold-500/40 text-gold-200">
            <ShieldAlert className="w-3 h-3" />
            {lang === "ar" ? "لوحة الإدارة" : "Administration"}
          </Badge>
        </div>

        <div className="p-4 border-b border-cream/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gold-gradient flex items-center justify-center text-white font-display">
              {profile?.fullName?.charAt(0) || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate text-cream">{profile?.fullName || "Admin"}</div>
              <div className="text-xs text-cream/50">{lang === "ar" ? "مشرف عام" : "Super-admin"}</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, end, Icon, ar, fr, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold-500/15 text-gold-300"
                    : "text-cream/70 hover:bg-cream/5 hover:text-cream"
                )
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.6} />
              <span className="flex-1">{lang === "ar" ? ar : fr}</span>
              {badge ? <Badge variant="default" className="bg-gold-500 border-transparent text-white">{badge}</Badge> : null}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10">
          <button
            onClick={() => { signOut(); navigate("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm text-cream/70 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {lang === "ar" ? "تسجيل الخروج" : "Déconnexion"}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-cocoa-900 text-cream px-4 py-3 flex items-center gap-3">
          <Logo variant="light" />
          <button className="ms-auto p-2 rounded-full hover:bg-cream/5 relative">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold-500 rounded-full" />
          </button>
        </div>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cocoa-900 text-cream border-t border-cream/10">
          <div className="grid grid-cols-5">
            {NAV.slice(0, 5).map(({ to, end, Icon, ar, fr }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px]",
                    isActive ? "text-gold-300" : "text-cream/50"
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
