"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, CheckCircle, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ProtectedImage from "@/components/shared/ProtectedImage";
import { notFound } from "next/navigation";
import { use, useState, useCallback, useEffect } from "react";

// Slug to product key mapping
const slugToProductKey: Record<string, string> = {
  "pvc-planen": "pvc",
  "kederplanen": "keder",
  "geruestplanen": "oesenband",
  "strahlschutznetze": "blast",
  "staubschutznetze": "dust",
  "personenauffangnetze": "personenauffang",
};

// Main images (shown as hero)
const mainImages: Record<string, string> = {
  pvc: "/images/portfolio/PVC_Portfolio/PVC_Muster_1.png",
  keder: "/images/portfolio/Keder_Plane_Portfolio/Keder_Plane_Muster.jpg",
  oesenband: "/images/portfolio/Geruestplane_Portfolio/Gerüstplane_B1_Muster.jpg",
  blast: "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_B1_Muster.jpg",
  dust: "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_1.jpg",
  personenauffang: "/images/portfolio/Personauffangnetze_Portfolio/Personauffangnetze_Muster_2.jpg",
};

// Gallery images from portfolio folders
const galleryImages: Record<string, string[]> = {
  pvc: [
    "/images/portfolio/PVC_Portfolio/PVC_Muster_1.png",
    "/images/portfolio/PVC_Portfolio/PVC_Muster_3.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Muster_4.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Muster_9.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Blau.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Weiß.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Transparent.JPG",
    "/images/portfolio/PVC_Portfolio/PVC_Transparent_Muster_2.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Abdeckplane_1.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Abdeckplane_2.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Abdeckplane_3.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Klett_und_Flausch_Muster.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Klett_und_Flausch_Muster1.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Reißverschluß.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_Reißverschluß_1.jpg",
    "/images/portfolio/PVC_Portfolio/PVC_oesenstreifen.jpg",
  ],
  keder: [
    "/images/portfolio/Keder_Plane_Portfolio/Keder_Plane_Muster.jpg",
    "/images/portfolio/Keder_Plane_Portfolio/Keder_Muster_1.jpg",
    "/images/portfolio/Keder_Plane_Portfolio/Keder_Muster_3.jpg",
    "/images/portfolio/Keder_Plane_Portfolio/Keder_Muster_12.jpg",
  ],
  oesenband: [
    "/images/portfolio/Geruestplane_Portfolio/Gerüstplane_B1_Muster.jpg",
    "/images/portfolio/Geruestplane_Portfolio/Gersütplane_Muster.jpg",
    "/images/portfolio/Geruestplane_Portfolio/Gerüstplane_Muster_3.jpeg",
  ],
  blast: [
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_B1_Muster.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_1.JPG",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_Muster_1.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_Muster_2.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_Muster_3.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_Muster_7.jpg",
    "/images/portfolio/Strahlschutznetze_Portfolio/Strahlschutznetze_Muster_Rolle.jpg",
  ],
  dust: [
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_1.jpg",
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_2.jpg",
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_3.jpg",
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_4.jpg",
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_5.jpg",
    "/images/portfolio/Staubschutznetze_Portfolio/Staubschutznetze_Muster_6.jpg",
  ],
  personenauffang: [
    "/images/portfolio/Personauffangnetze_Portfolio/Personauffangnetze_Muster_2.jpg",
    "/images/portfolio/Personauffangnetze_Portfolio/Personauffangnetze_Muster_1.jpg",
    "/images/portfolio/Personauffangnetze_Portfolio/Personauffangnetze.jpg",
    "/images/portfolio/Personauffangnetze_Portfolio/Vogelnetze.jpg",
  ],
};

function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  title,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  title: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative w-[90vw] h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <ProtectedImage
          src={images[currentIndex]}
          alt={`${title} - ${currentIndex + 1}`}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </motion.div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-white/80 text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              const diff = idx - currentIndex;
              if (diff > 0) {
                for (let i = 0; i < diff; i++) onNext();
              } else {
                for (let i = 0; i < -diff; i++) onPrev();
              }
            }}
            className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all ${
              idx === currentIndex
                ? "ring-2 ring-primary scale-110"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <ProtectedImage
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export default function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = use(params);
  const t = useTranslations("Portfolio");

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productKey = slugToProductKey[slug];

  if (!productKey) {
    notFound();
  }

  const title = t(`products.${productKey}.title`);
  const description = t(`products.${productKey}.description`);
  const features = t.raw(`products.${productKey}.features`) as string[];
  const gallery = galleryImages[productKey] || [];
  const mainImage = gallery[0] ?? mainImages[productKey];

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  }, [gallery.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  }, [gallery.length]);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "de" ? "Zurück zum Portfolio" : "Back to Portfolio"}
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative aspect-square rounded-3xl overflow-hidden cursor-zoom-in group"
              onClick={() => openLightbox(0)}
            >
              <ProtectedImage
                src={mainImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain rounded-3xl transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-6 grid grid-cols-4 sm:grid-cols-6 gap-3">
                {gallery.slice(0, 12).map((img, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => openLightbox(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group ${
                      idx === 0 ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <ProtectedImage
                      src={img}
                      alt={`${title} - ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 25vw, 100px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </motion.button>
                ))}
                {gallery.length > 12 && (
                  <button
                    onClick={() => openLightbox(12)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-lg font-semibold text-muted-foreground">
                      +{gallery.length - 12}
                    </span>
                  </button>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {title}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {description}
            </p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {locale === "de" ? "Eigenschaften" : "Features"}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border"
                  >
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-border">
              <Link
                href="/#kontakt"
                className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
              >
                {locale === "de" ? "Anfrage senden" : "Send Inquiry"}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <ImageLightbox
            images={gallery}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onPrev={goToPrev}
            onNext={goToNext}
            title={title}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
