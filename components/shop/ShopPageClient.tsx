"use client";

import { useState, useMemo, useEffect } from "react";
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
import { priceRanges } from "@/data/products";
import ProductCard from "@/components/shop/ProductCard";
import FilterSidebar, { FilterCategory } from "@/components/shop/FilterSidebar";
import { ProductService, Product } from "@/services/product-service";
import { CategoryService } from "@/services/category-service";

type SortOption = "popular" | "newest" | "price-asc" | "price-desc" | "rating";

export default function ShopPageClient() {
  useTranslations("Shop");
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

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTotalPages, setApiTotalPages] = useState(0);

  // Categories state
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await CategoryService.getAllCategories();
        const filterCategories: FilterCategory[] = response.map(cat => ({
          code: cat.code,
          name: cat.name,
          productCount: cat.productCount,
        }));
        setCategories(filterCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getProducts(currentPage - 1, productsPerPage);
        setProducts(response.content);
        setApiTotalPages(response.totalPages);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(locale === "de" ? "Fehler beim Laden der Produkte" : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, locale]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category.code === selectedCategory || p.category.name === selectedCategory);
    }

    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.id === selectedPriceRange);
      if (range) {
        result = result.filter((p) => p.price >= range.min && p.price <= range.max);
      }
    }

    if (selectedRating > 0) {
      result = result.filter((p) => p.avgRating >= selectedRating);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.countInStock > 0);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "popular":
      default:
        result.sort((a, b) => b.numReviews - a.numReviews);
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedRating, inStockOnly, sortBy]);

  const paginatedProducts = filteredProducts;

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

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            locale={locale}
            categories={categories}
            categoriesLoading={categoriesLoading}
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

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground">
                  {locale === "de" ? "Produkte werden geladen..." : "Loading products..."}
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{error}</h3>
                <button
                  onClick={() => setCurrentPage(1)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {locale === "de" ? "Erneut versuchen" : "Try again"}
                </button>
              </div>
            ) : paginatedProducts.length > 0 ? (
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
                      key={product.code}
                      product={product}
                      locale={locale}
                      viewMode={viewMode}
                      index={index}
                    />
                  ))}
                </div>

                {apiTotalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 transition-colors"
                    >
                      {locale === "de" ? "Zurück" : "Previous"}
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: apiTotalPages }, (_, i) => i + 1).map((page) => (
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
                      onClick={() => setCurrentPage((p) => Math.min(apiTotalPages, p + 1))}
                      disabled={currentPage === apiTotalPages}
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
