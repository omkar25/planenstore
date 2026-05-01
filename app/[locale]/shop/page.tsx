"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  Grid3X3,
  List,
  SlidersHorizontal,
  ChevronRight,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { products, priceRanges } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

export default function ShopPage() {
  const t = useTranslations("Shop");
  const params = useParams();
  const locale = (params.locale as string) || "de";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.nameEn.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.descriptionEn.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      const categoryMap: Record<string, string> = {
        "pvc-planen": "PVC-Planen",
        kederplanen: "Kederplanen",
        geruestplanen: "Gerüstplanen",
        staubschutznetze: "Staubschutznetze",
        strahlschutznetze: "Strahlschutznetze",
        personenauffangnetze: "Personenauffangnetze",
      };
      result = result.filter((p) => p.category === categoryMap[selectedCategory]);
    }

    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.id === selectedPriceRange);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    if (selectedRating > 0) {
      result = result.filter((p) => p.rating >= selectedRating);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "popular":
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, selectedPriceRange, selectedRating, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const sortOptions = [
    { value: "popular", label: locale === "de" ? "Beliebtheit" : "Popularity" },
    { value: "newest", label: locale === "de" ? "Neueste" : "Newest" },
    { value: "price-asc", label: locale === "de" ? "Preis: Niedrig → Hoch" : "Price: Low → High" },
    { value: "price-desc", label: locale === "de" ? "Preis: Hoch → Niedrig" : "Price: High → Low" },
    { value: "rating", label: locale === "de" ? "Bewertung" : "Rating" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              {locale === "de" ? "Startseite" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">
              {locale === "de" ? "Shop" : "Shop"}
            </span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t("title")}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {t("description")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            locale={locale}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            isMobileOpen={mobileFiltersOpen}
            setIsMobileOpen={setMobileFiltersOpen}
          />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:border-primary/30 transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {locale === "de" ? "Filter" : "Filters"}
                </button>

                <div className="relative flex-1 sm:flex-none sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={locale === "de" ? "Produkte suchen..." : "Search products..."}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} {locale === "de" ? "Produkte" : "Products"}
                </span>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-primary text-white"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-primary text-white"
                          : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-4"
                  }
                >
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      locale={locale}
                      viewMode={viewMode}
                      index={index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 transition-colors"
                    >
                      {locale === "de" ? "Zurück" : "Previous"}
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "bg-card border border-border hover:border-primary/30"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 transition-colors"
                    >
                      {locale === "de" ? "Weiter" : "Next"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {locale === "de" ? "Keine Produkte gefunden" : "No products found"}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {locale === "de"
                    ? "Versuchen Sie, Ihre Filter anzupassen oder nach etwas anderem zu suchen."
                    : "Try adjusting your filters or searching for something else."}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
