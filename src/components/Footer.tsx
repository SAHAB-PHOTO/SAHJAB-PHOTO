import { Link } from "react-router-dom";
import { Facebook, Instagram, Send, Phone, Mail, MapPin } from "lucide-react";
import { paymentMethods } from "@/data/payments";
import { couriers } from "@/data/couriers";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      {/* trust strip */}
      <div className="border-b border-border">
        <div className="container-app grid grid-cols-2 gap-4 py-6 text-center md:grid-cols-4">
          {[
            { i: "🚚", t: "توصيل لكل الولايات", s: "58 ولاية + دفع عند الاستلام" },
            { i: "🛡️", t: "حماية المشتري", s: "استرجاع خلال 7 أيام" },
            { i: "🔒", t: "دفع آمن 100%", s: "عبر بوابة SATIM المؤمّنة" },
            { i: "📞", t: "دعم على مدار الساعة", s: "فريق جزائري بلهجتك" },
          ].map((b) => (
            <div key={b.t} className="flex flex-col items-center gap-1">
              <span className="text-3xl">{b.i}</span>
              <span className="text-sm font-bold">{b.t}</span>
              <span className="text-xs text-muted-foreground">{b.s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-app grid grid-cols-2 gap-8 py-10 md:grid-cols-5">
        <div className="col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-lg font-black text-white">
              R
            </span>
            <span className="text-xl font-black" dir="ltr">RafikExpress</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            RafikExpress — المتجر الإلكتروني الجزائري الأول. ملايين المنتجات بأسعار الجملة،
            توصيل سريع لكل الولايات، وكل وسائل الدفع الإلكتروني الجزائرية والدولية في مكان واحد.
          </p>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground transition hover:bg-primary hover:text-white"
                aria-label="تواصل اجتماعي"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="تسوّق"
          links={[
            ["كل الفئات", "/category/electronics"],
            ["عروض اليوم", "/"],
            ["الأكثر مبيعاً", "/"],
            ["المفضلة", "/wishlist"],
          ]}
        />
        <FooterCol
          title="خدمة الزبائن"
          links={[
            ["تتبع الطلب", "/track"],
            ["سياسة الإرجاع", "/"],
            ["الأسئلة الشائعة", "/"],
            ["اتصل بنا", "/"],
          ]}
        />
        <div>
          <h4 className="mb-3 font-bold">تواصل معنا</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone size={15} /> 0770 00 00 00</li>
            <li className="flex items-center gap-2"><Mail size={15} /> support@rafikexpress.dz</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> الجزائر العاصمة</li>
          </ul>
        </div>
      </div>

      {/* payments */}
      <div className="border-t border-border">
        <div className="container-app py-6">
          <p className="mb-3 text-center text-xs font-bold text-muted-foreground">
            وسائل الدفع المدعومة
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((p) => (
              <span
                key={p.id}
                title={p.name}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
              >
                <span className="text-base">{p.icon}</span> {p.name}
              </span>
            ))}
          </div>

          <p className="mb-3 mt-6 text-center text-xs font-bold text-muted-foreground">
            شركاء التوصيل في الجزائر 🇩🇿
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {couriers.map((c) => (
              <span
                key={c.id}
                title={`${c.latin} · ${c.eta}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold"
              >
                <span className="text-base">{c.emoji}</span> {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RafikExpress — جميع الحقوق محفوظة · صُنع في الجزائر 🇩🇿
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 font-bold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-primary">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
