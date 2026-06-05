import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center", className)} aria-label={`تقييم ${value} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value)
              ? "fill-accent text-accent"
              : "fill-muted text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}
