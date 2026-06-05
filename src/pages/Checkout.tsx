import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, CheckCircle2, Truck, Building2, CreditCard, Wallet, Banknote, Star, Bell, MessageCircle, Mail } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { paymentMethods, type PaymentMethod } from "@/data/payments";
import { couriers, getCourier } from "@/data/couriers";
import { computeShipping, getZone, zoneNames } from "@/data/shipping";
import { wilayas } from "@/data/wilayas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDZD } from "@/lib/utils";

const groupMeta: Record<PaymentMethod["group"], { title: string; Icon: typeof CreditCard }> = {
  local: { title: "وسائل الدفع الجزائرية", Icon: Building2 },
  card: { title: "بطاقات دولية", Icon: CreditCard },
  wallet: { title: "محافظ رقمية", Icon: Wallet },
  cod: { title: "الدفع عند الاستلام", Icon: Banknote },
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<"home" | "desk">("home");
  const [courierId, setCourierId] = useState<string>("yalidine");
  const [pay, setPay] = useState<string>("cod");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", address: "", email: "" });
  const [notify, setNotify] = useState({ sms: true, whatsapp: true, email: false });

  const courier = getCourier(courierId)!;
  // حساب التوصيل تلقائياً حسب الشركة + الولاية + نوع التوصيل + قيمة الطلب
  const shipping = computeShipping(courier, form.wilaya, delivery, subtotal);
  const total = subtotal + shipping;
  const codBlocked = pay === "cod" && !courier.cod;

  const grouped = useMemo(() => {
    const map = new Map<PaymentMethod["group"], PaymentMethod[]>();
    for (const m of paymentMethods) {
      const arr = map.get(m.group) ?? [];
      arr.push(m);
      map.set(m.group, arr);
    }
    return [...map.entries()];
  }, []);

  const valid = !!form.name && form.phone.length >= 9 && !!form.wilaya && !codBlocked;

  if (items.length === 0) {
    return (
      <div className="container-app py-20 text-center">
        <p className="text-2xl font-black">لا يوجد ما تدفعه</p>
        <Link to="/" className="mt-4 inline-block text-primary underline">العودة للتسوّق</Link>
      </div>
    );
  }

  const placeOrder = () => {
    if (!valid) return;
    setProcessing(true);
    // محاكاة معالجة الدفع — يُستبدل لاحقاً بربط بوابة SATIM/Stripe/PayPal الحقيقية
    setTimeout(() => {
      const orderId = "DZ" + Math.floor(100000 + Math.random() * 900000);
      clear();
      const channels = [
        notify.sms && "SMS",
        notify.whatsapp && "واتساب",
        notify.email && "البريد",
      ].filter(Boolean) as string[];
      navigate("/order-success", {
        state: {
          orderId,
          total,
          pay,
          method: paymentMethods.find((p) => p.id === pay)?.name,
          courier: courier.name,
          eta: courier.eta,
          channels,
        },
      });
    }, 1400);
  };

  return (
    <div className="container-app py-6">
      <h1 className="mb-5 flex items-center gap-2 text-2xl font-black">
        <Lock className="text-secondary" size={22} /> إتمام الطلب — دفع آمن
      </h1>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* 1. shipping info */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-white">1</span>
              معلومات التوصيل
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="الاسم الكامل" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="مثال: أحمد بن علي" />
              <Field label="رقم الهاتف" value={form.phone} onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "") })} placeholder="0X XX XX XX XX" />
              <div>
                <label className="mb-1 flex items-center gap-2 text-sm font-bold">
                  الولاية
                  {form.wilaya && (
                    <Badge tone="muted">منطقة: {zoneNames[getZone(form.wilaya)]}</Badge>
                  )}
                </label>
                <select
                  value={form.wilaya}
                  onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                >
                  <option value="">اختر الولاية…</option>
                  {wilayas.map((w, i) => (
                    <option key={w} value={w}>{`${i + 1} - ${w}`}</option>
                  ))}
                </select>
              </div>
              <Field label="العنوان (اختياري)" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="الحي، الشارع، رقم المنزل" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DeliveryOption
                active={delivery === "home"}
                onClick={() => setDelivery("home")}
                Icon={Truck}
                title="التوصيل إلى المنزل"
                desc={courier.eta}
                price={(() => {
                  const f = computeShipping(courier, form.wilaya, "home", subtotal);
                  return f === 0 ? "مجاني" : formatDZD(f);
                })()}
              />
              <DeliveryOption
                active={delivery === "desk"}
                onClick={() => setDelivery("desk")}
                Icon={Building2}
                title="التوصيل إلى المكتب (Stop Desk)"
                desc={courier.eta}
                price={formatDZD(computeShipping(courier, form.wilaya, "desk", subtotal))}
              />
            </div>
          </section>

          {/* 2. courier */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-white">2</span>
              شركة التوصيل
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              اختر شركة التوصيل المناسبة لك — كلها شركات جزائرية معتمدة 🇩🇿
              {form.wilaya
                ? ` · الأسعار محسوبة لولاية ${form.wilaya} (${zoneNames[getZone(form.wilaya)]})`
                : " · 💡 اختر ولايتك أعلاه ليُحسب سعر التوصيل تلقائياً"}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {couriers.map((c) => {
                const fee = computeShipping(c, form.wilaya, delivery, subtotal);
                return (
                  <button
                    key={c.id}
                    onClick={() => setCourierId(c.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-right transition ${
                      courierId === c.id
                        ? "border-primary bg-primary/5 shadow-card"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center gap-1.5 text-sm font-bold">
                        {c.name}
                        {c.note && <Badge tone="accent">{c.note}</Badge>}
                      </span>
                      <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-0.5">
                          <Star size={11} className="fill-accent text-accent" /> {c.rating}
                        </span>
                        · {c.eta} · {c.wilayas} ولاية
                        {c.cod ? " · دفع عند الاستلام" : ""}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {fee === 0 ? "مجاني" : formatDZD(fee)}
                    </span>
                    {courierId === c.id && <CheckCircle2 size={18} className="shrink-0 text-primary" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. payment */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-white">3</span>
              طريقة الدفع
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              كل وسائل الدفع الإلكتروني الجزائرية والدولية مدعومة — معاملاتك مشفّرة ومؤمّنة 🔒
            </p>

            <div className="space-y-5">
              {grouped.map(([group, methods]) => {
                const { title, Icon } = groupMeta[group];
                return (
                  <div key={group}>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                      <Icon size={14} /> {title}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {methods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPay(m.id)}
                          className={`flex items-center gap-3 rounded-xl border-2 p-3 text-right transition ${
                            pay === m.id
                              ? "border-primary bg-primary/5 shadow-card"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <span className="text-2xl">{m.icon}</span>
                          <span className="flex-1">
                            <span className="flex items-center gap-1.5 text-sm font-bold">
                              {m.name}
                              {m.badge && <Badge tone="accent">{m.badge}</Badge>}
                            </span>
                            <span className="block text-xs text-muted-foreground">{m.desc}</span>
                          </span>
                          {pay === m.id && <CheckCircle2 size={18} className="text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* contextual card form (demo only) */}
            {["cib", "edahabia", "visa"].includes(pay) && (
              <div className="mt-4 grid gap-3 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="رقم البطاقة" value="" onChange={() => {}} placeholder="•••• •••• •••• ••••" />
                </div>
                <Field label="تاريخ الانتهاء" value="" onChange={() => {}} placeholder="MM / YY" />
                <Field label="CVV" value="" onChange={() => {}} placeholder="•••" />
                <p className="text-xs text-muted-foreground sm:col-span-2">
                  🔒 نموذج تجريبي — في النسخة النهائية يتم التحويل إلى صفحة SATIM/Stripe المؤمّنة دون تخزين بيانات البطاقة.
                </p>
              </div>
            )}
            {pay === "cod" && !codBlocked && (
              <p className="mt-4 rounded-xl bg-secondary/10 p-3 text-sm text-secondary">
                💵 ستدفع المبلغ نقداً لموزّع {courier.name} عند استلام طلبك.
              </p>
            )}
            {codBlocked && (
              <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                ⚠️ شركة {courier.name} لا تدعم الدفع عند الاستلام — اختر شركة توصيل أخرى أو وسيلة دفع إلكترونية.
              </p>
            )}
          </section>

          {/* 4. notifications */}
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-black">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-xs text-white">4</span>
              إشعارات حالة الطلب
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              اختر كيف تحب أن نُعلِمك بكل تحديث لطردك (تأكيد، خروج للتوصيل، التسليم).
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              <NotifyToggle
                Icon={MessageCircle}
                title="رسائل SMS"
                desc={form.phone ? `إلى ${form.phone}` : "إلى رقم هاتفك"}
                on={notify.sms}
                onClick={() => setNotify((n) => ({ ...n, sms: !n.sms }))}
              />
              <NotifyToggle
                Icon={Bell}
                title="واتساب"
                desc="تحديثات فورية"
                on={notify.whatsapp}
                onClick={() => setNotify((n) => ({ ...n, whatsapp: !n.whatsapp }))}
              />
              <NotifyToggle
                Icon={Mail}
                title="البريد الإلكتروني"
                desc="إيصال + تتبّع"
                on={notify.email}
                onClick={() => setNotify((n) => ({ ...n, email: !n.email }))}
              />
            </div>
            {notify.email && (
              <div className="mt-3">
                <Field
                  label="البريد الإلكتروني"
                  value={form.email}
                  onChange={(v) => setForm({ ...form, email: v })}
                  placeholder="example@email.com"
                />
              </div>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              📨 الواجهة جاهزة لربط مزوّد إرسال حقيقي (SMS / WhatsApp Business / Email) عبر مفاتيح .env.
            </p>
          </section>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-3 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-28">
          <h2 className="text-lg font-black">طلبك ({items.length})</h2>
          <div className="max-h-52 space-y-2 overflow-y-auto">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-2 text-sm">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-lg">{product.emoji}</span>
                <span className="line-clamp-1 flex-1">{product.name}</span>
                <span className="text-xs text-muted-foreground">×{qty}</span>
                <span className="font-bold">{formatDZD(product.price * qty)}</span>
              </div>
            ))}
          </div>
          <dl className="space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">المجموع الفرعي</dt><dd className="font-semibold">{formatDZD(subtotal)}</dd></div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">التوصيل عبر {courier.emoji} {courier.name}</dt>
              <dd className="font-semibold">{shipping === 0 ? "مجاني" : formatDZD(shipping)}</dd>
            </div>
          </dl>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="text-2xl font-black text-primary">{formatDZD(total)}</span>
          </div>

          <Button size="full" onClick={placeOrder} disabled={!valid || processing}>
            {processing ? "جارٍ تأكيد الطلب…" : (
              <>
                <Lock size={16} /> تأكيد الطلب والدفع
              </>
            )}
          </Button>
          {!valid && <p className="text-center text-xs text-destructive">أكمل الاسم والهاتف والولاية للمتابعة</p>}
          <p className="text-center text-[11px] text-muted-foreground">
            بالنقر على «تأكيد الطلب» أنت توافق على شروط الاستخدام وسياسة الخصوصية.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function NotifyToggle({
  Icon,
  title,
  desc,
  on,
  onClick,
}: {
  Icon: typeof Bell;
  title: string;
  desc: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-right transition ${
        on ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      <Icon size={18} className={on ? "text-primary" : "text-muted-foreground"} />
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${
            on ? "left-0.5" : "right-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function DeliveryOption({
  active,
  onClick,
  Icon,
  title,
  desc,
  price,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof Truck;
  title: string;
  desc: string;
  price: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-right transition ${
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      }`}
    >
      <Icon size={20} className="text-primary" />
      <span className="flex-1">
        <span className="block text-sm font-bold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
      <span className="text-sm font-bold text-primary">{price}</span>
    </button>
  );
}
