import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-gold-500/15 text-gold-700 border border-gold-500/30",
        verified: "bg-emerald/10 text-emerald border border-emerald/20",
        cocoa: "bg-cocoa-900 text-cream",
        outline: "border border-cocoa-900/15 text-cocoa-900",
        rose: "bg-rose-gold/15 text-rose-dark border border-rose-gold/30",
        success: "bg-emerald-light/15 text-emerald border border-emerald/30",
        warn: "bg-amber-100 text-amber-800 border border-amber-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
