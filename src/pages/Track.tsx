import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  PackageCheck,
  Warehouse,
  Truck,
  MapPin,
  Bike,
  Home,
  CheckCircle2,
  Circle,
  Phone,
} from "lucide-react";
import { couriers, getCourier } from "@/data/couriers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Step {
  Icon: typeof Truck;
  title: string;
  place: (w: string) => string;
}

const STEPS: Step[] = [
  { Icon: PackageCheck, title: "تم تأكيد الطلب", place: () => "RafikExpress" },
  { Icon: Warehouse, title: "تم التجهيز في المستودع", place: () => "مستودع الجزائر الوسطى" },
  { Icon: Truck, title: "خرج من المستودع", place: () => "في الطريق إلى الولاية" },
  { Icon: MapPin, title: "وصل إلى مركز الفرز", place: (w) => `مركز ${w}` },
  { Icon: Bike, title: "خرج للتوصيل مع الموزّع", place: (w) => w },
  { Icon: Home, title: "تم التسليم بنجاح", place: (w) => w },
];

// توليد حالة ثابتة (deterministic) من رقم الوصل لأغراض العرض.
function hashNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("ar-DZ", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

interface Result {
  code: string;
  courierId: string;
  wilaya: string;
  currentStep: number;
  events: { title: string; place: string; date: string }[];
}

const wilayaPool = ["الجزائر العاصمة", "وهران", "قسنطينة", "سطيف", "عنابة", "البليدة", "تيزي وزو", "بجاية"];

function buildResult(code: string, courierId: string): Result {
  const h = hashNum(code + courierId);
  const currentStep = h % STEPS.length; // 0..5
  const wilaya = wilayaPool[h % wilayaPool.length];
  const now = Date.now();
  const events = [];
  for (let i = 0; i <= currentStep; i++) {
    const hoursAgo = (currentStep - i) * 11 + (h % 7);
    events.push({
      title: STEPS[i].title,
      place: STEPS[i].place(wilaya),
      date: fmtDate(new Date(now - hoursAgo * 3.6e6)),
    });
  }
  return { code, courierId, wilaya, currentStep, events: events.reverse() };
}

export default function Track() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [courierId, setCourierId] = useState(params.get("courier") ?? "yalidine");
  const [result, setResult] = useState<Result | null>(null);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) return;
    setResult(buildResult(code.trim(), courierId));
  };

  const courier = result ? getCourier(result.courierId) : undefined;
  const delivered = result?.currentStep === STEPS.length - 1;

  return (
    <div className="container-app py-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="text-5xl">📦</span>
          <h1 className="mt-2 text-2xl font-black">تتبّع طلبك</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            أدخل رقم الوصل (Tracking) واختر شركة التوصيل لمعرفة حالة طردك لحظياً
          </p>
        </div>

        {/* form */}
        <form onSubmit={search} className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <div className="relative">
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="رقم الوصل مثال: yal-284194"
                className="h-12 w-full rounded-lg border border-border bg-background pr-10 pl-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <select
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              className="h-12 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            >
              {couriers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.name}
                </option>
              ))}
            </select>
          </div>
          <Button size="full" className="mt-3" type="submit">
            <Search size={16} /> تتبّع الطرد
          </Button>
        </form>

        {/* result */}
        {result && courier && (
          <div className="animate-fade-in mt-6 space-y-4">
            {/* summary card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">رقم الوصل</p>
                  <p className="font-mono text-lg font-black" dir="ltr">{result.code}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">شركة التوصيل</p>
                  <p className="font-bold">{courier.emoji} {courier.name}</p>
                </div>
                <Badge tone={delivered ? "success" : "primary"}>
                  {delivered ? "✅ تم التسليم" : "🚚 قيد التوصيل"}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm sm:grid-cols-3">
                <Info label="الوجهة" value={result.wilaya} />
                <Info label="المدّة المقدّرة" value={courier.eta} />
                <Info label="آخر تحديث" value={result.events[0]?.date ?? "—"} />
              </div>
            </div>

            {/* horizontal progress */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                {STEPS.map((s, i) => {
                  const done = i <= result.currentStep;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center">
                      <div className="flex w-full items-center">
                        {i > 0 && <div className={`h-1 flex-1 ${i <= result.currentStep ? "bg-primary" : "bg-border"}`} />}
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${done ? "gradient-brand text-white" : "bg-muted text-muted-foreground"}`}>
                          <s.Icon size={16} />
                        </span>
                        {i < STEPS.length - 1 && <div className={`h-1 flex-1 ${i < result.currentStep ? "bg-primary" : "bg-border"}`} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* timeline */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="mb-4 font-black">سجلّ تتبّع الطرد</h2>
              <ol className="relative space-y-5 pr-6">
                <span className="absolute bottom-2 right-[7px] top-2 w-0.5 bg-border" />
                {result.events.map((ev, i) => {
                  const latest = i === 0;
                  return (
                    <li key={i} className="relative">
                      <span className={`absolute -right-6 top-0.5 ${latest ? "text-primary" : "text-success"}`}>
                        {latest ? <Circle size={16} className="fill-primary text-primary" /> : <CheckCircle2 size={16} />}
                      </span>
                      <p className={`text-sm font-bold ${latest ? "text-primary" : ""}`}>{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.place}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{ev.date}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* support */}
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/10 p-4 text-sm text-secondary">
              <Phone size={18} />
              <span>هل من مشكلة في طردك؟ تواصل مع دعم {courier.name} أو فريق RafikExpress على 0770 00 00 00</span>
            </div>
          </div>
        )}

        {!result && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            💡 جرّب أي رقم وصل (4 خانات فأكثر) لمعاينة نظام التتبّع — النسخة النهائية تُربط بـ API شركة التوصيل الفعلي.
          </p>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
