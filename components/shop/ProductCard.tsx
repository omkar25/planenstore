"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Send, Star, Eye, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  locale: string;
  viewMode?: "grid" | "list";
  index?: number;
}

export default function ProductCard({ product, locale, viewMode = "grid", index = 0 }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  const name = locale === "de" ? product.name : product.nameEn;
  const description = locale === "de" ? product.description : product.descriptionEn;
  const category = locale === "de" ? product.category : product.categoryEn;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : i < rating
              ? "text-amber-400 fill-amber-400/50"
              : "text-gray-300"
        }`}
      />
    ));
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
            <Image
              src={product.image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority={index < 6}
            />
            {product.discount && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md">
                -{product.discount}%
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-primary text-white text-xs font-bold rounded-md">
                NEU
              </span>
            )}
            {product.isBestseller && !product.isNew && (
              <span className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-md">
                BESTSELLER
              </span>
            )}
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs text-primary font-medium uppercase tracking-wide">
                {category}
              </span>
              <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {description}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  €{product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    €{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-2 rounded-lg border transition-all ${
                    isWishlisted
                      ? "bg-red-50 border-red-200 text-red-500"
                      : "border-border hover:border-primary/30 text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
                <Link
                  href="/#kontakt"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-primary text-white hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                  {locale === "de" ? "Anfrage senden" : "Send Inquiry"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          priority={index < 6}
        />

        {product.discount && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow-lg">
            -{product.discount}%
          </span>
        )}

        {product.isNew && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-md shadow-lg">
            NEU
          </span>
        )}

        {product.isBestseller && !product.isNew && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-xs font-bold rounded-md shadow-lg">
            BESTSELLER
          </span>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-white/90 text-foreground font-semibold rounded-lg">
              {locale === "de" ? "Ausverkauft" : "Sold Out"}
            </span>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/70 to-transparent"
        >
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-2.5 rounded-lg backdrop-blur-sm transition-all ${
                isWishlisted
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-foreground hover:bg-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button 
              onClick={() => setShowImagePopup(true)}
              className="p-2.5 rounded-lg bg-white/90 text-foreground hover:bg-white backdrop-blur-sm transition-all"
            >
              <Eye className="w-5 h-5" />
            </button>
            <Link
              href="/#kontakt"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all bg-primary text-white hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
              <span className="text-sm">{locale === "de" ? "Anfrage" : "Inquiry"}</span>
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="p-4">
        <span className="text-xs text-primary font-medium uppercase tracking-wide">
          {category}
        </span>
        <h3 className="text-sm font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors min-h-10">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* <div className="flex items-baseline gap-2 mt-3">
          <span className="text-lg font-bold text-foreground">
            €{product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              €{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div> */}
      </div>
    </motion.div>

      {/* Image Preview Popup */}
      <AnimatePresence>
        {showImagePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowImagePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowImagePopup(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative aspect-square md:aspect-4/3">
                <Image
                  src={product.image}
                  alt={name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-contain"
                  priority
                />
              </div>
              
              <div className="p-4 border-t border-border">
                <span className="text-xs text-primary font-medium uppercase tracking-wide">
                  {category}
                </span>
                <h3 className="text-lg font-semibold text-foreground mt-1">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
