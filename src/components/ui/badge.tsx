import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "primary" | "accent" | "success" | "muted" | "dark";
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-amber-700",
  success: "bg-success/10 text-success",
  muted: "bg-muted text-muted-foreground",
  dark: "bg-foreground text-background",
};

export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
