import React from "react";
import Image from "next/image";

const HERO_IMAGE = "/tori-pictures/IMG_3237.jpeg";
const LOGO_PQ_VOB = "/tori-pictures/PHOTO-1.jpg";
const LOGO_BUNDESINNUNG = "/tori-pictures/PHOTO-2.jpg";
const LOGO_CERT = "/tori-pictures/PHOTO-3.jpg";
const LOGO_CERT_2 = "/tori-pictures/PHOTO-4.jpg";

export default function Hero() {
  return (
    <section className="sm:mt-6 lg:mt-8 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row">
        {/* ── LEFT: Text Content ── */}
        <div className="sm:text-center lg:text-left lg:w-2/3">
          {/* Headline */}
          <h2 className="text-4xl text-gray-500 sm:text-5xl md:text-6xl">
            <span className="block xl:inline">
              TORİ Planen 
            </span>
            <span className="block xl:inline"> & Netze</span>
          </h2>

          {/* Paragraph 1 */}
          <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            TORI BAU GmbH – Ihr Spezialist für Montage von Planen und Netzen
            seit über 20 Jahren Willkommen bei der TORI BAU GmbH! Wir sind ein
            erfahrenes Unternehmen, das sich auf die Montage von Planen und
            Netzen spezialisiert hat. Seit über 20 Jahren sind wir stolz darauf,
            unseren Kunden hochwertige Lösungen und erstklassigen Service zu
            bieten. Unser Team besteht aus kompetenten Fachleuten, die über
            umfangreiches Fachwissen und langjährige Erfahrung in der Branche
            verfügen. Wir sind bestrebt, die Erwartungen unserer Kunden zu
            übertreffen und ihnen maßgeschneiderte Lösungen anzubieten, die
            ihren individuellen Anforderungen entsprechen.
          </p>

          {/* Logos row */}
          <div className="mt-5 sm:mt-8 flex items-center gap-5 flex-wrap sm:justify-center lg:justify-start">
            <Image
              src={LOGO_PQ_VOB}
              alt="PQ VOB 0001.705216"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
            <Image
              src={LOGO_BUNDESINNUNG}
              alt="Bundesinnung Gerüstbau"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
            <Image
              src={LOGO_CERT}
              alt="Certification badge"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
            <Image
              src={LOGO_CERT_2}
              alt="Certification badge 2"
              width={64}
              height={64}
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        {/* ── RIGHT: Hero Image ── */}
        <div className="lg:inset-y-0 lg:right-0 lg:w-3/6 my-4">
          <Image
            src={HERO_IMAGE}
            alt="Gerüstbekleidung auf einer Brücke"
            width={1200}
            height={800}
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            priority
          />
        </div>
      </div>
    </section>
  );
}
