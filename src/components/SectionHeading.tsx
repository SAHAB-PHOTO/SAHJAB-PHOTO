import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "right" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "right",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "max-w-2xl mb-12",
        align === "center" ? "mx-auto text-center" : "",
        className
      )}
    >
      {eyebrow && (
        <div className={cn("flex items-center gap-3 mb-4", align === "center" && "justify-center")}>
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold-600 font-medium">
            {eyebrow}
          </span>
          <div className="h-px w-8 bg-gold-500" />
        </div>
      )}
      <h2 className="font-display text-3xl lg:text-5xl text-cocoa-900 text-balance leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base lg:text-lg text-cocoa-400 leading-relaxed text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  );
}
