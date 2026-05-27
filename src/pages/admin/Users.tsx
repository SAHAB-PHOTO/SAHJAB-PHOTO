import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, ShieldCheck, Ban, UserCog, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/stores/locale";
import { formatDate, cn } from "@/lib/utils";
import { getWilayaByCode } from "@/data/wilayas";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "buyer" | "seller" | "admin";
  wilayaCode: number;
  status: "active" | "banned" | "verified";
  orders: number;
  joinedAt: string;
}

const USERS: AdminUser[] = [
  { id: "u-1", fullName: "أمينة بن يحيى", email: "amina.b@example.dz", phone: "+213 555 11 22 33", role: "buyer", wilayaCode: 16, status: "verified", orders: 42, joinedAt: "2024-03-12" },
  { id: "u-2", fullName: "ياسمين مرابط", email: "y.merabet@example.dz", phone: "+213 661 44 55 66", role: "buyer", wilayaCode: 31, status: "active", orders: 18, joinedAt: "2024-08-22" },
  { id: "u-3", fullName: "كريم بوزيد", email: "kbouzid@example.dz", phone: "+213 770 12 34 56", role: "seller", wilayaCode: 25, status: "verified", orders: 1247, joinedAt: "2023-03-15" },
  { id: "u-4", fullName: "ليلى حداد", email: "leila.h@example.dz", phone: "+213 555 78 90 12", role: "buyer", wilayaCode: 13, status: "active", orders: 7, joinedAt: "2025-11-04" },
  { id: "u-5", fullName: "هشام بن صالح", email: "h.bensalah@example.dz", phone: "+213 553 33 44 55", role: "seller", wilayaCode: 15, status: "verified", orders: 412, joinedAt: "2023-08-22" },
  { id: "u-6", fullName: "نادية بوعلام", email: "nadia.b@example.dz", phone: "+213 770 88 99 00", role: "buyer", wilayaCode: 23, status: "banned", orders: 2, joinedAt: "2025-01-18" },
  { id: "u-7", fullName: "سامي بلحاج", email: "sami.b@example.dz", phone: "+213 555 67 89 01", role: "buyer", wilayaCode: 16, status: "active", orders: 26, joinedAt: "2024-12-30" },
  { id: "u-8", fullName: "إيمان قاسمي", email: "iman.k@example.dz", phone: "+213 661 22 33 44", role: "buyer", wilayaCode: 9, status: "verified", orders: 51, joinedAt: "2024-02-14" },
];

const ROLE_LABEL = {
  ar: { buyer: "مشتري", seller: "بائع", admin: "مشرف" },
  fr: { buyer: "Acheteur", seller: "Vendeur", admin: "Admin" },
} as const;

export default function AdminUsers() {
  const { lang } = useLocale();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "buyer" | "seller" | "admin">("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = USERS.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
            {lang === "ar" ? "إدارة المستخدمين" : "Utilisateurs"}
          </h1>
          <p className="text-cocoa-400 mt-1">
            {USERS.length} {lang === "ar" ? "مستخدم مسجّل" : "utilisateurs inscrits"}
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4" />
          {lang === "ar" ? "تصدير قائمة" : "Exporter"}
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-[16px] shadow-soft mb-4 p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-cocoa-300" />
          <Input
            placeholder={lang === "ar" ? "ابحث بالاسم أو البريد..." : "Rechercher..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10"
          />
        </div>
        <div className="flex gap-1 bg-cream-200 rounded-[12px] p-1">
          {[
            { key: "all", ar: "الكل", fr: "Tous" },
            { key: "buyer", ar: "مشتري", fr: "Acheteurs" },
            { key: "seller", ar: "بائع", fr: "Vendeurs" },
            { key: "admin", ar: "مشرف", fr: "Admins" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setRoleFilter(f.key as any)}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                roleFilter === f.key ? "bg-white shadow-sm text-cocoa-900" : "text-cocoa-400"
              )}
            >
              {lang === "ar" ? f.ar : f.fr}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-[16px] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-cocoa-300 border-b border-cocoa-900/8 bg-cream-200/40">
                <th className="text-start p-4">{lang === "ar" ? "المستخدم" : "Utilisateur"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الدور" : "Rôle"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الولاية" : "Wilaya"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الطلبات" : "Commandes"}</th>
                <th className="text-start p-4">{lang === "ar" ? "انضم" : "Inscrit"}</th>
                <th className="text-start p-4">{lang === "ar" ? "الحالة" : "Statut"}</th>
                <th className="text-end p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="border-b border-cocoa-900/5 hover:bg-cream-200/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold-500/15 flex items-center justify-center font-display text-gold-700 text-sm shrink-0">
                        {u.fullName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium flex items-center gap-1.5">
                          {u.fullName}
                          {u.status === "verified" && <ShieldCheck className="w-3.5 h-3.5 text-emerald" />}
                        </div>
                        <div className="text-xs text-cocoa-400 truncate">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={u.role === "seller" ? "default" : u.role === "admin" ? "cocoa" : "outline"}>
                      {ROLE_LABEL[lang][u.role]}
                    </Badge>
                  </td>
                  <td className="p-4 text-cocoa-400">{getWilayaByCode(u.wilayaCode)?.[lang]}</td>
                  <td className="p-4 font-semibold">{u.orders}</td>
                  <td className="p-4 text-cocoa-400 text-xs">{formatDate(u.joinedAt, lang)}</td>
                  <td className="p-4">
                    {u.status === "banned"
                      ? <Badge variant="warn"><Ban className="w-3 h-3" />{lang === "ar" ? "محظور" : "Banni"}</Badge>
                      : u.status === "verified"
                      ? <Badge variant="success">{lang === "ar" ? "مُوثَّق" : "Vérifié"}</Badge>
                      : <Badge variant="outline">{lang === "ar" ? "نشط" : "Actif"}</Badge>}
                  </td>
                  <td className="p-4 text-end relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                      className="p-2 rounded-lg hover:bg-cream-200"
                    >
                      <MoreVertical className="w-4 h-4 text-cocoa-400" />
                    </button>
                    {openMenu === u.id && (
                      <div className="absolute end-4 top-12 z-10 bg-white rounded-[12px] shadow-elevated border border-cocoa-900/5 py-1 min-w-[180px] text-start">
                        <button className="w-full px-4 py-2 text-sm text-start hover:bg-cream-200 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald" />
                          {lang === "ar" ? "توثيق" : "Vérifier"}
                        </button>
                        <button className="w-full px-4 py-2 text-sm text-start hover:bg-cream-200 flex items-center gap-2">
                          <UserCog className="w-4 h-4 text-gold-600" />
                          {lang === "ar" ? "تغيير الدور" : "Changer rôle"}
                        </button>
                        <div className="h-px bg-cocoa-900/8 my-1" />
                        <button className="w-full px-4 py-2 text-sm text-start hover:bg-red-50 text-red-600 flex items-center gap-2">
                          <Ban className="w-4 h-4" />
                          {u.status === "banned"
                            ? (lang === "ar" ? "رفع الحظر" : "Débannir")
                            : (lang === "ar" ? "حظر" : "Bannir")}
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
