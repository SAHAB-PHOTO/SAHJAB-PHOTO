import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/,/g, " ");
  return `${formatted} دج`;
}

export function formatDate(date: Date | string, lang: "ar" | "fr" = "ar"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-DZ" : "fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateAlgerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "");
  return /^(\+213|0)(5|6|7)\d{8}$/.test(cleaned);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("213")) {
    const rest = cleaned.slice(3);
    return `+213 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }
  return phone;
}
