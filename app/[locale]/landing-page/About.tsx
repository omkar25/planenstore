"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HiShieldCheck, HiGlobe, HiLightningBolt, HiUserGroup } from "react-icons/hi";

const stats = [
  { number: "15+", label: "Jahre Erfahrung" },
  { number: "500+", label: "Projekte" },
  { number: "200+", label: "Zufriedene Kunden" },
  { number: "50+", label: "Mitarbeiter" },
];

const values = [
  {
    icon: HiShieldCheck,
    title: "Sicherheit",
    description:
      "Höchste Sicherheitsstandards bei allen unseren Produkten und Montagen. Zertifiziert nach aktuellen Normen.",
  },
  {
    icon: HiGlobe,
    title: "Umweltschutz",
    description:
      "Nachhaltige Materialien und umweltfreundliche Prozesse. Wir schützen die Umgebung Ihrer Baustelle.",
  },
  {
    icon: HiLightningBolt,
    title: "Schnelle Montage",
    description:
      "Professionelle und schnelle Montage durch erfahrene Teams. Termingerecht und zuverlässig.",
  },
  {
    icon: HiUserGroup,
    title: "Erfahrenes Team",
    description:
      "Unser qualifiziertes Team berät Sie kompetent und findet für jede Herausforderung die optimale Lösung.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-background/90" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Über <span className="text-primary">uns</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            TORİ Planen & Netze ist Ihr zuverlässiger Partner für professionelle
            Planen- und Netzlösungen im Bauwesen. Mit jahrelanger Erfahrung und
            einem engagierten Team bieten wir maßgeschneiderte Lösungen für
            Sicherheit, Umweltschutz und Wetterschutz auf Ihrer Baustelle.
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 text-center group"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <value.icon className="text-primary text-2xl" />
              </div>
              <h3 className="text-foreground font-semibold text-lg mb-2">
                {value.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center py-8 px-4 bg-primary/5 rounded-xl border border-primary/10"
            >
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
