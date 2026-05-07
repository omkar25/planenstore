"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Star,
  Truck,
  Shield,
  Phone,
  Users,
  Send,
  Heart,
  Share2,
  ZoomIn,
  X,
  HelpCircle,
} from "lucide-react";
import { ProductService, Product } from "@/services/product-service";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = (params.locale as string) || "de";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedBreite, setSelectedBreite] = useState<string | null>(null);
  const [laenge, setLaenge] = useState<string>("100");
  const [anmerkungen, setAnmerkungen] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProductService.getProductBySlug(slug);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        // Set default Breite from sizes
        if (data.sizes && data.sizes.length > 0) {
          const breiteOptions = data.sizes.filter(s => 
            s.toUpperCase().includes('BREITE') || s.toUpperCase().includes('CM')
          );
          if (breiteOptions.length > 0) {
            setSelectedBreite(breiteOptions[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(locale === "de" ? "Produkt nicht gefunden" : "Product not found");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, locale]);

  const handlePrevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-amber-400 fill-amber-400"
            : i < rating
              ? "text-amber-400 fill-amber-400/50"
              : "text-gray-300"
        }`}
      />
    ));
  };

  const colorMap: Record<string, string> = {
    "Weiss": "#FFFFFF",
    "Weiß": "#FFFFFF",
    "Weiß RAL9010": "#FFFFFF",
    "Weiß RAL 9010": "#FFFFFF",
    "Beige": "#D4C4A8",
    "Beige RAL1014": "#D4C4A8",
    "Beige RAL 1014": "#D4C4A8",
    "Beige RAL1015": "#E6D2B5",
    "Beige RAL 1015": "#E6D2B5",
    "Gelb": "#F5D033",
    "Gelb RAL1003": "#F5D033",
    "Gelb RAL 1003": "#F5D033",
    "Gelb RAL1021": "#F5D033",
    "Gelb RAL 1021": "#F5D033",
    "Lichtgrau": "#C4C4C4",
    "Lichtgrau RAL7035": "#C4C4C4",
    "Lichtgrau RAL 7035": "#C4C4C4",
    "Grau": "#8E8E8E",
    "Grau RAL7042": "#8E8E8E",
    "Grau RAL 7042": "#8E8E8E",
    "Anthrazit": "#4A4A4A",
    "Anthrazit RAL7016": "#4A4A4A",
    "Anthrazit RAL 7016": "#4A4A4A",
    "Schwarz": "#1A1A1A",
    "Schwarz RAL9005": "#1A1A1A",
    "Schwarz RAL 9005": "#1A1A1A",
    "Braun": "#5D4037",
    "Braun RAL8017": "#5D4037",
    "Braun RAL 8017": "#5D4037",
    "Blau": "#0047AB",
    "Blau RAL5002": "#0047AB",
    "Blau RAL 5002": "#0047AB",
    "Grün": "#2E7D32",
    "Grün RAL6005": "#2E7D32",
    "Grün RAL 6005": "#2E7D32",
    "Olivgrün": "#6B8E23",
    "Olivgrün RAL6003": "#6B8E23",
    "Olivgrün RAL 6003": "#6B8E23",
    "Rot": "#C62828",
    "Rot RAL3002": "#C62828",
    "Rot RAL 3002": "#C62828",
    "Orange": "#FF6D00",
    "Transparent": "transparent",
  };

  const getColorHex = (colorName: string): string => {
    return colorMap[colorName] || "#CCCCCC";
  };

  // Map color names to image indices based on color keywords in image URLs or color order
  const getImageIndexForColor = (colorName: string, colors: string[], images: { id: number; url: string }[]): number => {
    const colorLower = colorName.toLowerCase();
    
    // Try to find image by color name in URL
    const imageIndex = images.findIndex(img => {
      const urlLower = img.url.toLowerCase();
      if (colorLower.includes('blau') && urlLower.includes('blau')) return true;
      if (colorLower.includes('rot') && urlLower.includes('rot')) return true;
      if (colorLower.includes('grün') && urlLower.includes('gruen')) return true;
      if (colorLower.includes('grün') && urlLower.includes('grün')) return true;
      if (colorLower.includes('gelb') && urlLower.includes('gelb')) return true;
      if (colorLower.includes('oliv') && urlLower.includes('oliv')) return true;
      if (colorLower.includes('schwarz') && urlLower.includes('schwarz')) return true;
      if (colorLower.includes('weiß') && urlLower.includes('weiss')) return true;
      if (colorLower.includes('weiss') && urlLower.includes('weiss')) return true;
      if (colorLower.includes('grau') && urlLower.includes('grau')) return true;
      if (colorLower.includes('braun') && urlLower.includes('braun')) return true;
      if (colorLower.includes('beige') && urlLower.includes('beige')) return true;
      return false;
    });
    
    if (imageIndex !== -1) return imageIndex;
    
    // Fallback: use color index if within image bounds
    const colorIndex = colors.indexOf(colorName);
    if (colorIndex !== -1 && colorIndex < images.length) {
      return colorIndex;
    }
    
    return 0;
  };

  // Handle color selection and update image
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    if (product?.images && product?.colors) {
      const newImageIndex = getImageIndexForColor(color, product.colors, product.images);
      setSelectedImageIndex(newImageIndex);
    }
  };

  // Parse sizes into Breite options
  const parseBreiteOptions = (sizes: string[]): string[] => {
    return sizes.filter(s => {
      const upper = s.toUpperCase();
      return upper.includes('BREITE') || (upper.includes('CM') && !upper.includes('LÄNGE'));
    }).map(s => {
      // Extract just the measurement value
      const match = s.match(/(\d+)\s*CM/i);
      if (match) return `${match[1]}cm`;
      return s.replace(/BREITE[:\s]*/i, '').trim();
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-1/2">
              <div className="aspect-square bg-muted animate-pulse rounded-xl" />
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-20 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-20 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">{error}</h1>
          <Link
            href="/shop"
            className="text-primary hover:underline"
          >
            {locale === "de" ? "Zurück zum Shop" : "Back to Shop"}
          </Link>
        </div>
      </main>
    );
  }

  const currentImage = product.images?.[selectedImageIndex]?.url || "/images/product-bild/placeholder.jpg";
  const discount = product.listPrice > product.price
    ? Math.round(((product.listPrice - product.price) / product.listPrice) * 100)
    : null;

  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              {locale === "de" ? "Startseite" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-primary transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/shop?category=${product.category.code}`}
              className="hover:text-primary transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image Gallery - Left Side */}
          <div className="lg:w-1/2">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />

              {/* Discount Badge */}
              {discount && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg shadow-lg">
                  -{discount}%
                </span>
              )}

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                </>
              )}

              {/* Zoom Button */}
              <button
                onClick={() => setShowZoom(true)}
                className="absolute bottom-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <ZoomIn className="w-5 h-5 text-foreground" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Side */}
          <div className="lg:w-1/2">
            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Features List - parsed from brand field */}
            <div className="space-y-2 mb-6">
              {product.brand && product.brand.split(",").map((feature, index) => {
                const trimmedFeature = feature.trim();
                const icons = [Truck, Shield, Phone, Users];
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span>{trimmedFeature}</span>
                  </div>
                );
              })}
            </div>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">{renderStars(product.avgRating)}</div>
                <span className="text-sm text-muted-foreground">
                  ({product.numReviews} {locale === "de" ? "Bewertungen" : "reviews"})
                </span>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {locale === "de" ? "Farbe" : "Color"}: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                </h3>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {product.colors.map((color) => {
                    const colorHex = getColorHex(color);
                    const isSelected = selectedColor === color;
                    const isLight = colorHex === "#FFFFFF" || colorHex === "#E6D2B5" || colorHex === "#D4C4A8";
                    const isTransparent = colorHex === "transparent";

                    return (
                      <button
                        key={color}
                        onClick={() => handleColorSelect(color)}
                        className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-md mb-1 flex items-center justify-center ${
                            isTransparent ? "bg-linear-to-br from-gray-100 to-gray-300" : ""
                          } ${isLight ? "border border-gray-300" : ""}`}
                          style={{ backgroundColor: isTransparent ? undefined : colorHex }}
                        >
                          {isSelected && (
                            <Check className={`w-5 h-5 ${isLight ? "text-gray-700" : "text-white"}`} />
                          )}
                        </div>
                        <span className="text-[10px] text-center text-muted-foreground leading-tight">
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Breite (Width) Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Breite:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parseBreiteOptions(product.sizes).map((breite) => (
                    <button
                      key={breite}
                      onClick={() => setSelectedBreite(breite)}
                      className={`px-6 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                        selectedBreite === breite
                          ? "border-red-500 bg-white text-foreground"
                          : "border-border bg-white text-foreground hover:border-gray-400"
                      }`}
                    >
                      {breite}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedBreite("custom")}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all border-2 ${
                      selectedBreite === "custom"
                        ? "border-red-500 bg-white text-foreground"
                        : "border-border bg-white text-foreground hover:border-gray-400"
                    }`}
                  >
                    {locale === "de" ? "Individuelle Größen" : "Custom Sizes"}
                  </button>
                </div>
              </div>
            )}

            {/* Länge (Length) Input */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Länge:
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={laenge}
                  onChange={(e) => setLaenge(e.target.value)}
                  min="40"
                  max="6000"
                  className="flex-1 px-4 py-3 border-2 border-border rounded-lg text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                min. 40cm | max. 6000cm
              </p>
            </div>

            {/* Anmerkungen zur Bestellung (Order Notes) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                {locale === "de" ? "Anmerkungen zur Bestellung:" : "Order Notes:"}
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
              </h3>
              <textarea
                value={anmerkungen}
                onChange={(e) => setAnmerkungen(e.target.value)}
                placeholder={locale === "de" ? "optional" : "optional"}
                rows={3}
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-y"
              />
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  {locale === "de" ? "Verfügbare Optionen" : "Available Options"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.listPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  €{product.listPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                {locale === "de" ? "inkl. MwSt." : "incl. VAT"}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.countInStock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {locale === "de" ? "Auf Lager" : "In Stock"} ({product.countInStock})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  {locale === "de" ? "Nicht auf Lager" : "Out of Stock"}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/#kontakt"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Send className="w-5 h-5" />
                {locale === "de" ? "Anfrage senden" : "Send Inquiry"}
              </Link>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isWishlisted
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-border hover:border-primary/50 text-muted-foreground hover:text-primary"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      url: window.location.href,
                    });
                  }
                }}
                className="p-3 rounded-lg border-2 border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {locale === "de" ? "Beschreibung" : "Description"}
              </h3>
              <div className="prose prose-sm text-muted-foreground max-w-none">
                {product.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowZoom(false)}
          >
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImage}
                alt={product.name}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-white"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
