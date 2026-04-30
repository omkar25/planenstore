"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, CheckCircle, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ProtectedImage from "@/components/shared/ProtectedImage";
import { notFound } from "next/navigation";
import { use, useState, useCallback, useEffect } from "react";

// Slug to project key mapping
const slugToProjectKey: Record<string, string> = {
  "pvc-planen-montage": "pvcInstall",
  "keder-planen-montage": "kederInstall",
  "geruestband-montage": "geruestbandInstall",
  "strahlschutznetze": "blastNets",
  "staubschutznetze": "dustNets",
  "personenauffangnetze-montage": "personenauffangInstall",
};

// Main images (shown as hero) - keep original
const mainImages: Record<string, string> = {
  pvcInstall: "/images/references/pvc-referenzen/pvc-23.jpg",
  kederInstall: "/images/references/keder-plane-referenzen/keder-plane-9.jpeg",
  geruestbandInstall: "/images/references/geruestplane-referenzen/geruestplane--wsk-1.jpg",
  blastNets: "/images/blast-protection.jpg",
  dustNets: "/images/Staubschutznetze_referenzen.jpg",
  personenauffangInstall: "/images/references/personauffangnetze-referenzen/personauffangnetze-2.jpg",
};

// Gallery images from references folder
const galleryImages: Record<string, string[]> = {
  pvcInstall: [
    "/images/references/pvc-referenzen/pvc-1.jpg",
    "/images/references/pvc-referenzen/pvc-2.jpg",
    "/images/references/pvc-referenzen/pvc-5.jpg",
    "/images/references/pvc-referenzen/pvc-7.jpg",
    "/images/references/pvc-referenzen/pvc-11.jpg",
    "/images/references/pvc-referenzen/pvc-19.jpg",
    "/images/references/pvc-referenzen/pvc-23.jpg",
    "/images/references/pvc-referenzen/pvc-24.jpg",
    "/images/references/pvc-referenzen/pvc-25.jpg",
    "/images/references/pvc-referenzen/pvc-26.jpg",
    "/images/references/pvc-referenzen/pvc-27.jpg",
    "/images/references/pvc-referenzen/pvc-28.jpg",
    "/images/references/pvc-referenzen/pvc-29.jpg",
    "/images/references/pvc-referenzen/pvc-30.jpg",
    "/images/references/pvc-referenzen/pvc-31.jpg",
    "/images/references/pvc-referenzen/pvc-32.jpg",
    "/images/references/pvc-referenzen/pvc-33.jpg",
    "/images/references/pvc-referenzen/pvc-35.jpg",
    "/images/references/pvc-referenzen/pvc-36.jpg",
    "/images/references/pvc-referenzen/pvc-42.jpg",
    "/images/references/pvc-referenzen/pvc-43.jpg",
    "/images/references/pvc-referenzen/pvc-44.jpg",
    "/images/references/pvc-referenzen/pvc-45.jpg",
    "/images/references/pvc-referenzen/pvc-48.jpg",
    "/images/references/pvc-referenzen/pvc-50.jpg",
    "/images/references/pvc-referenzen/pvc-52.jpg",
    "/images/references/pvc-referenzen/pvc-56.jpg",
    "/images/references/pvc-referenzen/pvc-58.jpg",
    "/images/references/pvc-referenzen/pvc-59.jpg",
    "/images/references/pvc-referenzen/pvc-montage.jpg",
    "/images/references/pvc-referenzen/pvc-dach-1.jpg",
    "/images/references/pvc-referenzen/pvc-transparent-1.jpg",
    "/images/references/pvc-referenzen/pvc-transparent-2.jpg",
  ],
  kederInstall: [
    "/images/references/keder-plane-referenzen/keder-plane-2.jpg",
    "/images/references/keder-plane-referenzen/keder-plane-3.jpg",
    "/images/references/keder-plane-referenzen/keder-plane-4.jpg",
    "/images/references/keder-plane-referenzen/keder-plane-8.jpeg",
    "/images/references/keder-plane-referenzen/keder-plane-9.jpeg",
    "/images/references/keder-plane-referenzen/keder-plane-10.jpeg",
    "/images/references/keder-plane-referenzen/keder-plane-11.jpeg",
    "/images/references/keder-plane-referenzen/keder-plane--gerüstplane-1.jpg",
    "/images/references/keder-plane-referenzen/keder-plane--gerüstplane-2.jpg",
    "/images/references/keder-plane-referenzen/keder-plane--gerüstplane-7.jpg",
    "/images/references/keder-plane-referenzen/keder-plane--gerüstplane.jpg",
    "/images/references/keder-plane-referenzen/keder-plane--pvc-2.jpg",
    "/images/references/keder-plane-referenzen/keder-plane-pvc-1.jpg",
    "/images/references/keder-plane-referenzen/keder--gerüstplane.jpg",
    "/images/references/keder-plane-referenzen/keder--gerüstplane-8.jpg",
    "/images/references/keder-plane-referenzen/keder--gerüstplane-25.jpg",
    "/images/references/keder-plane-referenzen/keder-planen--pvc-2.jpg",
    "/images/references/keder-plane-referenzen/keder-planen--pvc-3.jpg",
    "/images/references/keder-plane-referenzen/keder-transparent-1.jpg",
    "/images/references/keder-plane-referenzen/keder-transparent-4.jpeg",
    "/images/references/keder-plane-referenzen/keder-transparent-plane.jpg",
    "/images/references/keder-plane-referenzen/keder-transparent-plane-1.jpeg",
    "/images/references/keder-plane-referenzen/keder-transparent-plane-2.jpeg",
    "/images/references/keder-plane-referenzen/keder-transparent-plane-3.jpeg",
    "/images/references/keder-plane-referenzen/keder-zelt-1.jpg",
    "/images/references/keder-plane-referenzen/keder-zelt.jpg",
  ],
  geruestbandInstall: [
    "/images/references/geruestplane-referenzen/geruestplane-1.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-2.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-3.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-4.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-5.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-6.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-7.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-8.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-9.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-10.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-11.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-12.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-13.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-14.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-15.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-16.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-17.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-18.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-19.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-20.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-21.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-22.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-23.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-24.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-25.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-26.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-31.jpg",
    "/images/references/geruestplane-referenzen/geruestplane--wsk-1.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-als-wsk.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-als-wsk-1.jpg",
    "/images/references/geruestplane-referenzen/geruestplane-als-wsk-2.jpg",
    "/images/references/geruestplane-referenzen/geruestplane.jpg",
    "/images/references/geruestplane-referenzen/gersuetplane.jpg",
  ],
  blastNets: [
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-1.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-2.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-3.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-4.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-5.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-6.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-7.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-8.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-9.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-10.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-11.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-12.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-13.jpg",
    "/images/references/strahlschutznetze-referenzen/strahlschutznetze-14.jpg",
  ],
  dustNets: [
    "/images/references/staubschutznetze-referenzen/staubschutznetze-1.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-2.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-3.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-4.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-5.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-6.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-7.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-8.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-9.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-10.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-11.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-14.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-15.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-16.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-17.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-18.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-19.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-20.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-21.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-22.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-23.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-24.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-25.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-26.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-27.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-28.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-29.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-30.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-31.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-32.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-33.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-34.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-36.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-37.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-38.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-40.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-41.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-42.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-43.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-44.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-45.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-46.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-47.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze-48.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze--wsk.jpg",
    "/images/references/staubschutznetze-referenzen/staubschutznetze--wsk-1.jpg",
  ],
  personenauffangInstall: [
    "/images/references/personauffangnetze-referenzen/personauffangnetze-1.jpg",
    "/images/references/personauffangnetze-referenzen/personauffangnetze-2.jpg",
    "/images/references/personauffangnetze-referenzen/personauffangnetze-3.jpg",
    "/images/references/personauffangnetze-referenzen/personauffangnetze-4.jpg",
    "/images/references/personauffangnetze-referenzen/personauffangnetze-5.jpg",
    "/images/references/personauffangnetze-referenzen/personauffangnetze-6.jpg",
  ],
};

// Lightbox Component
function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
  title,
}: {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 px-3 py-1 rounded-full bg-white/10 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Main image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-[90vw] h-[80vh] max-w-6xl"
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

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-lg bg-black/50">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                    setTimeout(() => {
                      const event = new CustomEvent("openLightbox", { detail: idx });
                      window.dispatchEvent(event);
                    }, 100);
                  }}
                  className={`relative w-16 h-12 rounded overflow-hidden transition-all ${
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ReferenzDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = use(params);
  const t = useTranslations("Referenzen");
  const tPage = useTranslations("ReferenzDetail");

  const projectKey = slugToProjectKey[slug];

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    const gallery = projectKey ? galleryImages[projectKey] : [];
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  }, [projectKey]);

  const prevImage = useCallback(() => {
    const gallery = projectKey ? galleryImages[projectKey] : [];
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  }, [projectKey]);

  // Listen for custom lightbox events (from thumbnail clicks)
  useEffect(() => {
    const handleOpenLightbox = (e: CustomEvent<number>) => {
      openLightbox(e.detail);
    };
    window.addEventListener("openLightbox", handleOpenLightbox as EventListener);
    return () => window.removeEventListener("openLightbox", handleOpenLightbox as EventListener);
  }, [openLightbox]);

  if (!projectKey) {
    notFound();
  }

  const title = t(`projects.${projectKey}.title`);
  const description = t(`projects.${projectKey}.description`);
  const gallery = galleryImages[projectKey];
  const mainImage = gallery[0] ?? mainImages[projectKey];

  return (
    <main className="min-h-screen bg-background">
      {/* Lightbox - for gallery images only */}
      <ImageLightbox
        images={gallery}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        title={title}
      />

      {/* Hero Section */}
      <div className="border-b border-border bg-muted/40">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-6">
          <Link
            href="/referenzen"
            className="inline-flex items-center gap-2 text-lime-500 hover:text-lime-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {tPage("backToReferenzen")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h5 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-bold tracking-tight mb-2">
              {title}
            </h5>
           
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Image - Hero image (not in lightbox) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative aspect-video max-w-4xl mx-auto rounded-[2rem] overflow-hidden mb-12"
        >
          <ProtectedImage
            src={mainImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12"
        >
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">
              {tPage("projectOverview")}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-muted-foreground mb-4">
                {tPage("projectDetails")}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {tPage("qualityMaterials")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {tPage("professionalInstallation")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    {tPage("customSolutions")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Gallery */}
        {gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-muted-foreground mb-6">
              {tPage("gallery")} ({gallery.length} {gallery.length === 1 ? "Bild" : "Bilder"})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  <ProtectedImage
                    src={image}
                    alt={`${title} - ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading={index < 8 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/70 rounded-full p-2">
                      <ZoomIn className="w-5 h-5 text-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center bg-primary/5 rounded-2xl border border-primary/20 p-8"
        >
          <h2 className="text-2xl font-bold text-muted-foreground mb-3">
            {tPage("ctaTitle")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            {tPage("ctaDescription")}
          </p>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {tPage("ctaButton")}
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
