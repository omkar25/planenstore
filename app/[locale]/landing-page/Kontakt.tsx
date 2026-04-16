"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
} from "react-icons/hi";

const contactInfo = [
  {
    icon: HiLocationMarker,
    title: "Adresse",
    details: ["Musterstraße 42", "20457 Hamburg", "Deutschland"],
  },
  {
    icon: HiPhone,
    title: "Telefon",
    details: ["+49 (0) 40 123 456 78", "+49 (0) 170 123 4567"],
  },
  {
    icon: HiMail,
    title: "E-Mail",
    details: ["info@toriplanen.de", "anfrage@toriplanen.de"],
  },
  {
    icon: HiClock,
    title: "Öffnungszeiten",
    details: ["Mo - Fr: 08:00 - 17:00", "Sa: nach Vereinbarung"],
  },
];

export default function Kontakt() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", phone: "", message: "" });
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
            <span className="text-primary">Kontakt</span>ieren Sie uns
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Haben Sie Fragen oder benötigen Sie ein individuelles Angebot? Wir
            freuen uns auf Ihre Nachricht!
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
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-card/50 p-5 rounded-xl border border-border hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="text-primary text-lg" />
                    </div>
                    <h3 className="text-foreground font-semibold">{info.title}</h3>
                  </div>
                  {info.details.map((detail) => (
                    <p
                      key={detail}
                      className="text-muted-foreground text-sm leading-relaxed"
                    >
                      {detail}
                    </p>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl overflow-hidden border border-border h-64 bg-card/50 flex items-center justify-center">
              <div className="text-center">
                <HiLocationMarker className="text-primary text-4xl mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">Hamburg, Deutschland</p>
                <p className="text-muted-foreground/70 text-xs mt-1">
                  Kartenansicht verfügbar
                </p>
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
              className="bg-card/50 p-8 rounded-2xl border border-border"
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="Ihr Name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      E-Mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="ihre@email.de"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) =>
                        setFormState({ ...formState, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="+49 ..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-foreground text-sm font-medium mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
                    placeholder="Beschreiben Sie Ihr Projekt..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                >
                  {submitted ? "✓ Nachricht gesendet!" : "Nachricht senden"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
