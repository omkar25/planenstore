"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { HiShieldCheck, HiGlobe, HiLightningBolt, HiUserGroup } from "react-icons/hi";
import { IconType } from "react-icons";

const valueKeys = ["safety", "environment", "fastInstall", "team"] as const;
const valueIcons: Record<string, IconType> = {
  safety: HiShieldCheck,
  environment: HiGlobe,
  fastInstall: HiLightningBolt,
  team: HiUserGroup,
};

const statKeys = ["experience", "projects", "clients", "employees"] as const;

export default function About() {
  const t = useTranslations("About");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "99999px 0px -100px 0px" });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "99999px 0px -100px 0px" });

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
            {t("sectionTitle")} <span className="text-primary">{t("sectionTitleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            {t("description")}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {valueKeys.map((key, i) => {
            const Icon = valueIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-card/60 backdrop-blur-sm p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="text-primary text-2xl" />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">
                  {t(`values.${key}.title`)}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(`values.${key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {statKeys.map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center py-8 px-4 bg-primary/5 rounded-xl border border-primary/10"
            >
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {t(`stats.${key}.number`)}
              </p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">
                {t(`stats.${key}.label`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
