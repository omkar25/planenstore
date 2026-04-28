"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import ProtectedImage from "@/components/shared/ProtectedImage";

const productKeys = ["pvc", "keder", "oesenband", "blast", "dust", "personenauffang"] as const;
const productImages: Record<string, string> = {
  pvc: "/images/pvc-planen_1.jpg",
  keder: "/images/keder_planen.jpg",
  oesenband: "/images/geruste-planen.jpg",
  blast: "/images/blast-protection.jpg",
  dust: "/images/staubschutznetze_converted.jpg",
  personenauffang: "/images/personenauffangnetze.jpg",
};

// Portfolio icons to show per product (array of photo numbers)
const productIcons: Record<string, number[]> = {
  pvc: [1, 2, 3, 4],
  keder: [1, 2, 3, 4],
  oesenband: [1, 2, 4],  // Gerüstplanen - no photo-3
  blast: [1, 2, 4],      // Strahlschutznetze - no photo-3
  dust: [],              // Staubschutznetze - no icons
  personenauffang: [],   // Personenauffangnetze - no icons
};

function ProductCard({
  productKey,
  index,
  t,
}: {
  productKey: string;
  index: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "99999px 0px -100px 0px" });
  const title = t(`products.${productKey}.title`);
  const description = t(`products.${productKey}.description`);
  const features = t.raw(`products.${productKey}.features`) as string[];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative bg-card/50 rounded-2xl overflow-hidden  hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative aspect-video overflow-hidden">
        <ProtectedImage
          src={productImages[productKey]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading={index < 6 ? "eager" : "lazy"}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {productIcons[productKey]?.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 md:gap-2">
            {productIcons[productKey].map((num) => (
              <div key={num} className="w-10 h-10 md:w-14 md:h-14 relative rounded-lg overflow-hidden shadow-lg">
                <ProtectedImage
                  src={`/images/portfolio/photo-${num}.jpg`}
                  alt={`Portfolio ${num}`}
                  fill
                  sizes="(max-width: 768px) 40px, 56px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const t = useTranslations("Portfolio");
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "99999px 0px -100px 0px" });

  return (
    <section id="portfolio" className="relative pt-5 pb-24 bg-background scroll-mt-16">
      <div className="max-w-screen-2xl mx-auto px-1">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("sectionTitle")} <span className="text-primary">{t("sectionTitleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {productKeys.map((key, i) => (
            <ProductCard key={key} productKey={key} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
