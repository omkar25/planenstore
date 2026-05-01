"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, SlidersHorizontal, Star } from "lucide-react";
import { categories, priceRanges } from "@/data/products";

interface FilterSidebarProps {
  locale: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (range: string) => void;
  selectedRating: number;
  setSelectedRating: (rating: number) => void;
  inStockOnly: boolean;
  setInStockOnly: (inStock: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function FilterSidebar({
  locale,
  selectedCategory,
  setSelectedCategory,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedRating,
  setSelectedRating,
  inStockOnly,
  setInStockOnly,
  isMobileOpen,
  setIsMobileOpen,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("");
    setSelectedRating(0);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedPriceRange !== "" ||
    selectedRating > 0 ||
    inStockOnly;

  const filterContent = (
    <div className="space-y-6">
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <X className="w-4 h-4" />
          {locale === "de" ? "Filter zurücksetzen" : "Clear all filters"}
        </button>
      )}

      <div className="border-b border-border pb-6">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-foreground">
            {locale === "de" ? "Kategorie" : "Category"}
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.category ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.category && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.id}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                      />
                      <span
                        className={`text-sm transition-colors ${
                          selectedCategory === cat.id
                            ? "text-primary font-medium"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        {locale === "de" ? cat.name : cat.nameEn}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-b border-border pb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-foreground">
            {locale === "de" ? "Preis" : "Price"}
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range.id}
                      onChange={() =>
                        setSelectedPriceRange(
                          selectedPriceRange === range.id ? "" : range.id
                        )
                      }
                      className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                    />
                    <span
                      className={`text-sm transition-colors ${
                        selectedPriceRange === range.id
                          ? "text-primary font-medium"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {locale === "de" ? range.label : range.labelEn}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-b border-border pb-6">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-foreground">
            {locale === "de" ? "Bewertung" : "Rating"}
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.rating ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={selectedRating === rating}
                      onChange={() =>
                        setSelectedRating(selectedRating === rating ? 0 : rating)
                      }
                      className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                    />
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        {locale === "de" ? "& mehr" : "& up"}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <button
          onClick={() => toggleSection("availability")}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-foreground">
            {locale === "de" ? "Verfügbarkeit" : "Availability"}
          </h3>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              expandedSections.availability ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {expandedSections.availability && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      inStockOnly
                        ? "text-primary font-medium"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {locale === "de" ? "Nur auf Lager" : "In stock only"}
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">
              {locale === "de" ? "Filter" : "Filters"}
            </h2>
          </div>
          {filterContent}
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-lg text-foreground">
                      {locale === "de" ? "Filter" : "Filters"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterContent}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
