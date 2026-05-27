import { Link } from "react-router-dom";
import { useLocale } from "@/stores/locale";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "light";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const { lang } = useLocale();

  return (
    <Link to="/" className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative w-10 h-10">
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldgrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2AC4D" />
              <stop offset="100%" stopColor="#A8893E" />
            </linearGradient>
          </defs>
          <circle cx="20" cy="20" r="19" stroke="url(#goldgrad)" strokeWidth="1.5" fill="none" />
          <path
            d="M20 8 L23 16 L31 16 L25 21 L27 29 L20 24 L13 29 L15 21 L9 16 L17 16 Z"
            fill="url(#goldgrad)"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-tight",
            variant === "light" ? "text-cream" : "text-cocoa-900"
          )}
        >
          {lang === "ar" ? "حلويات الجزائر" : "Halawiyat El Djazair"}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold-600 font-inter">
          Premium Marketplace
        </span>
      </div>
    </Link>
  );
}
