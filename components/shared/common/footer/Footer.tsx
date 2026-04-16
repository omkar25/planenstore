"use client";

import { HiArrowUp } from "react-icons/hi";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-foreground font-bold text-xl mb-4">
              <span className="text-primary">TORİ</span> Planen & Netze
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Ihr zuverlässiger Partner für professionelle Planen- und
              Netzlösungen im Bauwesen. Sicherheit, Umweltschutz und
              Wetterschutz – alles aus einer Hand.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Schnellzugriff</h4>
            <ul className="space-y-2">
              {[
                { name: "Startseite", id: "hero" },
                { name: "Portfolio", id: "portfolio" },
                { name: "Über uns", id: "about" },
                { name: "Referenzen", id: "referenzen" },
                { name: "Kontakt", id: "kontakt" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Leistungen</h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>PVC-Planen</li>
              <li>Staubschutznetze</li>
              <li>Strahlschutznetze</li>
              <li>Wetterschutzplanen</li>
              <li>Individuelle Lösungen</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} TORİ Planen & Netze. Alle Rechte
            vorbehalten.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Impressum
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Datenschutz
            </a>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-full flex items-center justify-center text-primary transition-all hover:scale-110"
              aria-label="Nach oben scrollen"
            >
              <HiArrowUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
