"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const productKeys = ["pvc", "dust", "blast", "weather"] as const;
const productImages: Record<string, string> = {
  pvc: "/images/pvc-planen.jpg",
  dust: "/images/staubschutz.jpg",
  blast: "/images/strahlschutz.jpg",
  weather: "/images/wetterschutz.jpg",
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
      className="group relative bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={productImages[productKey]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-foreground">
          {title}
        </h3>
      </div>

      <div className="p-6">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const t = useTranslations("Portfolio");
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: "99999px 0px -100px 0px" });

  return (
    <section id="portfolio" className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {productKeys.map((key, i) => (
            <ProductCard key={key} productKey={key} index={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
