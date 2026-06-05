import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "gradient-brand text-primary-foreground shadow-card hover:shadow-hover",
        solid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary/5",
        ghost: "hover:bg-muted text-foreground",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-card",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10",
        full: "h-12 w-full px-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
