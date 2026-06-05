import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Algerian Dinar (DZD). */
export function formatDZD(amount: number): string {
  return (
    new Intl.NumberFormat("ar-DZ", {
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " دج"
  );
}

/** Compute discount percentage from old/new price. */
export function discountPct(oldPrice: number, price: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function arDigits(n: number): string {
  return new Intl.NumberFormat("ar-DZ").format(n);
}
