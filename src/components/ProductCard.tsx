import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import type { Product } from "@/data/types";
import { formatDZD } from "@/lib/utils";
import { getShopById } from "@/data/mock";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const shop = getShopById(product.shopId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-white rounded-[14px] overflow-hidden shadow-soft hover:shadow-gold transition-all duration-500 hover:-translate-y-1 border border-transparent hover:border-gold-500/30"
      >
        <div className="relative aspect-square overflow-hidden bg-cream-200">
          <img
            src={product.photos[0]}
            alt={product.nameAr}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {product.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="default" className="shadow-md backdrop-blur-md">
                ✦ مميّز
              </Badge>
            </div>
          )}
          <button
            aria-label="Add to favorites"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-gold hover:text-white"
          >
            <Heart className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {shop && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-cocoa-300 font-medium truncate">{shop.nameAr}</span>
              {shop.verified && (
                <span className="text-emerald flex items-center gap-1 shrink-0">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          )}

          <h3 className="font-display text-base text-cocoa-900 line-clamp-2 leading-snug group-hover:text-gold-700 transition-colors">
            {product.nameAr}
          </h3>

          <div className="flex items-center gap-1.5 text-xs">
            <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
            <span className="font-semibold text-cocoa-900">{product.ratingAvg.toFixed(1)}</span>
            <span className="text-cocoa-300">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-display text-lg gold-text font-bold">
              {formatDZD(product.priceDzd)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
