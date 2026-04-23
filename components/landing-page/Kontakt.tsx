"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
} from "react-icons/hi";
import { IconType } from "react-icons";
import { z } from "zod";

const contactKeys = ["address", "phone", "email", "hours"] as const;
const contactIcons: Record<string, IconType> = {
  address: HiLocationMarker,
  phone: HiPhone,
  email: HiMail,
  hours: HiClock,
};
const contactDetails: Record<string, string[]> = {
  address: ["Reeseberg 3", "21079 Hamburg", "Deutschland"],
  phone: ["+49 (40) 303 72 206"],
  email: ["info@toriplanen.de"],
};

export default function Kontakt() {
  const t = useTranslations("Kontakt");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "99999px 0px -100px 0px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactSchema = z.object({
    name: z
      .string()
      .min(1, t("form.errors.nameRequired"))
      .min(2, t("form.errors.nameMin")),
    email: z
      .string()
      .min(1, t("form.errors.emailRequired"))
      .email(t("form.errors.emailInvalid")),
    phone: z.string(),
    message: z
      .string()
      .min(1, t("form.errors.messageRequired"))
      .min(10, t("form.errors.messageMin")),
  });

  const isValidGermanPhone = (val: string): boolean => {
    if (val === "") return true;
    const cleaned = val.replace(/[() ]/g, "");
    return /^(\+49|0049|0)[\d\-/]{6,15}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formState);
    const fieldErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
    }

    if (!isValidGermanPhone(formState.phone)) {
      fieldErrors.phone = t("form.errors.phoneInvalid");
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!res.ok) throw new Error();

      setSubmitted(true);
      toast.success(t("form.successToast"));
      setFormState({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      toast.error(t("form.errorToast"));
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const getDetails = (key: string): string[] => {
    if (key === "hours") return [t("info.hoursMon"), t("info.hoursSat")];
    return contactDetails[key] ?? [];
  };

  return (
    <section id="kontakt" className="relative py-24 bg-background">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-primary">{t("sectionTitle")}</span>{t("sectionTitleHighlight")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("subtitle")}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {contactKeys.map((key, i) => {
                const Icon = contactIcons[key];
                const details = getDetails(key);
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-card/50 p-5 rounded-xl border border-border hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="text-primary text-lg" />
                      </div>
                      <h3 className="text-foreground font-semibold">{t(`info.${key}`)}</h3>
                    </div>
                    {details.map((detail) => {
                      if (key === "phone") {
                        const tel = detail.replace(/[\s()]/g, "");
                        return (
                          <a
                            key={detail}
                            href={`tel:${tel}`}
                            className="block text-muted-foreground hover:text-primary text-sm leading-relaxed font-semibold transition-colors"
                          >
                            {detail}
                          </a>
                        );
                      }
                      if (key === "email") {
                        return (
                          <a
                            key={detail}
                            href={`mailto:${detail}`}
                            rel="noopener"
                            className="block text-muted-foreground hover:text-primary text-sm leading-relaxed font-semibold transition-colors"
                          >
                            {detail}
                          </a>
                        );
                      }
                      return (
                        <p
                          key={detail}
                          className="text-muted-foreground text-sm leading-relaxed"
                        >
                          {detail}
                        </p>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>

            {/* Google Maps Embed */}
            <div className="relative rounded-xl overflow-hidden border border-border h-64 group">
              <iframe
                title={t("map.location")}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2376.0246857143693!2d9.985808176992455!3d53.450144966951676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b191a08662a451%3A0xd7d3b1b5397f8486!2sTori%20Bau%20GmbH%20Ger%C3%BCstplanen!5e0!3m2!1sde!2sde!4v1732471376758!5m2!1sde!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Info card overlay */}
              <div className="absolute bottom-3 left-3 z-10 rounded-xl bg-background/95 backdrop-blur-sm shadow-xl border border-border px-4 py-3 max-w-[260px]">
                <p className="text-foreground font-bold text-sm leading-snug">
                  Tori Bau GmbH<br />Gerüstplanen
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Reeseberg 3, 21079 Hamburg
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="text-xs font-semibold text-foreground">5.0</span>
                  <span className="text-amber-400 text-xs">★</span>
                  <a
                    href="https://www.google.com/maps/place/Reeseberg+3,+21079+Hamburg,+Germany"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline ml-0.5"
                  >
                    (3)
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-card/50 p-8 rounded-2xl border border-border"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">
                    {t("form.name")}
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${errors.name ? "border-destructive" : "border-border"}`}
                    placeholder={t("form.namePlaceholder")}
                  />
                  {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      {t("form.email")}
                    </label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${errors.email ? "border-destructive" : "border-border"}`}
                      placeholder={t("form.emailPlaceholder")}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      {t("form.phone")}
                    </label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${errors.phone ? "border-destructive" : "border-border"}`}
                      placeholder={t("form.phonePlaceholder")}
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">
                    {t("form.message")}
                  </label>
                  <textarea
                    rows={5}
                    value={formState.message}
                    onChange={(e) => updateField("message", e.target.value)}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none ${errors.message ? "border-destructive" : "border-border"}`}
                    placeholder={t("form.messagePlaceholder")}
                  />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                >
                  {loading
                    ? t("form.sending")
                    : submitted
                      ? t("form.submitted")
                      : t("form.submit")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
