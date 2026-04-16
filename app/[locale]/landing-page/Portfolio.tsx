"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const products = [
  {
    title: "PVC-Planen",
    description:
      "Hochwertige PVC-Planen für den professionellen Einsatz auf Baustellen. Robust, wetterfest und langlebig – ideal für den Schutz von Gebäuden und Materialien.",
    image: "/images/pvc-planen.jpg",
    features: ["Wetterfest", "UV-beständig", "Reißfest", "Individuell"],
  },
  {
    title: "Staubschutznetze",
    description:
      "Effektive Staubschutznetze reduzieren die Staubbelastung auf Baustellen erheblich. Sie schützen Anwohner und die Umwelt vor Feinstaubpartikeln.",
    image: "/images/staubschutz.jpg",
    features: ["Staubreduktion", "Luftdurchlässig", "Leicht", "Vielseitig"],
  },
  {
    title: "Strahlschutznetze",
    description:
      "Professionelle Strahlschutznetze für Sandstrahl- und Kugelstrahlarbeiten. Maximale Sicherheit bei industriellen Strahlverfahren.",
    image: "/images/strahlschutz.jpg",
    features: ["Hochfest", "Abriebfest", "Normgerecht", "Sicher"],
  },
  {
    title: "Wetterschutzplanen",
    description:
      "Zuverlässiger Wetterschutz für Baustellen bei Wind, Regen und Schnee. Ermöglichen ganzjähriges Arbeiten unter optimalen Bedingungen.",
    image: "/images/wetterschutz.jpg",
    features: ["Windfest", "Wasserdicht", "Winterfest", "Flexibel"],
  },
];

function ProductCard({
  product,
  index,
}: {
  product: (typeof products)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
        <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-foreground">
          {product.title}
        </h3>
      </div>

      <div className="p-6">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {product.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
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
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

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
            Unser <span className="text-primary">Portfolio</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Professionelle Planen und Netze für jeden Einsatzbereich – maßgeschneidert für Ihre Anforderungen.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.title} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
