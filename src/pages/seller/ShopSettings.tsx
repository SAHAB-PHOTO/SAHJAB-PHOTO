import { motion } from "framer-motion";
import { Camera, MapPin, Clock, Truck, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SHOPS } from "@/data/mock";
import { WILAYAS } from "@/data/wilayas";
import { useLocale } from "@/stores/locale";

export default function ShopSettings() {
  const { lang } = useLocale();
  const shop = SHOPS[0];

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-cocoa-900">
          {lang === "ar" ? "إعدادات المتجر" : "Boutique"}
        </h1>
        <p className="text-cocoa-400 mt-1">
          {lang === "ar" ? "خصّص متجرك ليعكس هويّتك" : "Personnalisez votre vitrine"}
        </p>
      </div>

      {/* Banner & Logo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] shadow-soft overflow-hidden mb-6"
      >
        <div className="relative h-48 bg-cream-200">
          <img src={shop.bannerUrl} alt="" className="w-full h-full object-cover" />
          <button className="absolute top-4 end-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-[12px] text-sm font-medium flex items-center gap-2 hover:bg-white shadow-md">
            <Camera className="w-4 h-4" />
            {lang === "ar" ? "تغيير الغلاف" : "Changer la bannière"}
          </button>
        </div>
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex items-end gap-4">
            <div className="relative">
              <img src={shop.logoUrl} alt="" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover" />
              <button className="absolute bottom-0 end-0 w-8 h-8 rounded-full bg-gold-gradient text-white flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <div className="font-display text-2xl">{shop.nameAr}</div>
              <Badge variant="verified" className="mt-1">✓ {lang === "ar" ? "بائع معتمد" : "Vendeur certifié"}</Badge>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Basic info */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-[20px] shadow-soft p-6 lg:p-8 mb-6"
      >
        <h2 className="font-display text-xl mb-5">{lang === "ar" ? "المعلومات الأساسية" : "Informations"}</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Label>{lang === "ar" ? "اسم المتجر (عربي)" : "Nom (AR)"}</Label>
            <Input defaultValue={shop.nameAr} />
          </div>
          <div>
            <Label>{lang === "ar" ? "اسم المتجر (فرنسي)" : "Nom (FR)"}</Label>
            <Input defaultValue={shop.nameFr} />
          </div>
          <div className="sm:col-span-2">
            <Label>{lang === "ar" ? "الوصف الموجز" : "Description courte"}</Label>
            <Input defaultValue={shop.description} />
          </div>
          <div className="sm:col-span-2">
            <Label>{lang === "ar" ? "قصّة المتجر" : "Histoire de la boutique"}</Label>
            <textarea
              defaultValue={shop.story}
              rows={5}
              className="w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4 py-3 text-base focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500 outline-none resize-none"
            />
            <p className="text-xs text-cocoa-400 mt-2">
              {lang === "ar" ? "احكِ للزبائن من تكون. القصص الشخصية تبني الثقة." : "Racontez votre histoire. Les récits authentiques inspirent confiance."}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Hours & Location */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[20px] shadow-soft p-6 lg:p-8 mb-6"
      >
        <h2 className="font-display text-xl mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold-600" />
          {lang === "ar" ? "ساعات العمل والموقع" : "Horaires & Localisation"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          <div>
            <Label>{lang === "ar" ? "الولاية الأم" : "Wilaya principale"}</Label>
            <select
              defaultValue={shop.wilayaCode}
              className="flex h-12 w-full rounded-[14px] border border-cocoa-900/10 bg-white px-4"
            >
              {WILAYAS.map((w) => <option key={w.code} value={w.code}>{lang === "ar" ? w.ar : w.fr}</option>)}
            </select>
          </div>
          <div>
            <Label>{lang === "ar" ? "ساعات العمل" : "Horaires"}</Label>
            <Input defaultValue={shop.workingHours} />
          </div>
        </div>
      </motion.section>

      {/* Delivery zones */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-[20px] shadow-soft p-6 lg:p-8 mb-6"
      >
        <h2 className="font-display text-xl mb-2 flex items-center gap-2">
          <Truck className="w-5 h-5 text-gold-600" />
          {lang === "ar" ? "مناطق التوصيل" : "Zones de livraison"}
        </h2>
        <p className="text-sm text-cocoa-400 mb-4">
          {lang === "ar" ? "اختر الولايات التي يمكنك التوصيل إليها" : "Sélectionnez les wilayas couvertes"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-72 overflow-y-auto p-2 bg-cream-200/40 rounded-[14px]">
          {WILAYAS.map((w) => {
            const checked = shop.deliveryZones.includes(w.code);
            return (
              <label
                key={w.code}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs transition-colors ${
                  checked ? "bg-gold-500/15 text-gold-700" : "bg-white text-cocoa-400 hover:bg-cream-200"
                }`}
              >
                <input type="checkbox" defaultChecked={checked} className="w-4 h-4 accent-gold-500" />
                <span>{lang === "ar" ? w.ar : w.fr}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-cocoa-400 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {lang === "ar" ? `حالياً تغطّي ${shop.deliveryZones.length} ولايات` : `${shop.deliveryZones.length} wilayas couvertes`}
        </div>
      </motion.section>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{lang === "ar" ? "إلغاء" : "Annuler"}</Button>
        <Button>
          <Save className="w-4 h-4" />
          {lang === "ar" ? "حفظ التغييرات" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
