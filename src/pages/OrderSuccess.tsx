import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDZD } from "@/lib/utils";

export default function OrderSuccess() {
  const { state } = useLocation() as {
    state?: {
      orderId?: string;
      total?: number;
      method?: string;
      courier?: string;
      eta?: string;
      channels?: string[];
    };
  };
  const orderId = state?.orderId ?? "DZ000000";

  return (
    <div className="container-app py-14">
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-card">
        <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/10">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-success/30" />
          <CheckCircle2 size={48} className="relative text-success" />
        </div>
        <h1 className="mt-5 text-2xl font-black">تم تأكيد طلبك بنجاح! 🎉</h1>
        <p className="mt-2 text-muted-foreground">
          شكراً لتسوّقك من RafikExpress.
          {state?.channels && state.channels.length > 0
            ? ` ستصلك تحديثات الطلب عبر: ${state.channels.join(" · ")}.`
            : " سنرسل لك تأكيداً عبر الرسائل القصيرة."}
        </p>

        <div className="mt-5 space-y-2 rounded-xl bg-muted/50 p-4 text-right text-sm">
          <Row label="رقم الطلب" value={`#${orderId}`} />
          {state?.method && <Row label="طريقة الدفع" value={state.method} />}
          {state?.courier && <Row label="شركة التوصيل" value={state.courier} />}
          {state?.total != null && <Row label="الإجمالي" value={formatDZD(state.total)} bold />}
          <Row label="التوصيل المتوقّع" value={state?.eta ?? "خلال 48 – 72 ساعة"} />
        </div>

        {/* tracker */}
        <div className="mt-6 flex items-center justify-between px-2">
          {[
            { Icon: CheckCircle2, t: "تم التأكيد", active: true },
            { Icon: Package, t: "قيد التجهيز", active: false },
            { Icon: Truck, t: "في الطريق", active: false },
            { Icon: Home, t: "تم التسليم", active: false },
          ].map((s, i, a) => (
            <div key={s.t} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && <div className="h-0.5 flex-1 bg-border" />}
                <span className={`grid h-9 w-9 place-items-center rounded-full ${s.active ? "gradient-brand text-white" : "bg-muted text-muted-foreground"}`}>
                  <s.Icon size={16} />
                </span>
                {i < a.length - 1 && <div className="h-0.5 flex-1 bg-border" />}
              </div>
              <span className="mt-1 text-[11px] font-semibold">{s.t}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex gap-3">
          <Link to={`/track?code=${orderId}`} className="flex-1">
            <Button variant="outline" size="full">تتبّع الطلب</Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button size="full">مواصلة التسوّق</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-black text-primary" : "font-bold"}>{value}</span>
    </div>
  );
}
