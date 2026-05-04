import Script from 'next/script';

interface LocalBusinessJsonLdProps {
  locale?: string;
}

export function LocalBusinessJsonLd({ locale = 'de' }: LocalBusinessJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://toriplanen.de/#organization',
    name: 'Tori Bau GmbH - Planen & Netze',
    alternateName: ['Tori Planen', 'TORI BAU GmbH'],
    description: locale === 'de' 
      ? 'Ihr Spezialist für PVC-Planen, Gerüstplanen, Kederplanen, Staubschutznetze, Strahlschutznetze und Personenauffangnetze. Über 20 Jahre Erfahrung in der Montage von Planen und Netzen.'
      : 'Your specialist for PVC tarps, scaffolding tarps, keder tarps, dust protection nets, blast protection nets and safety nets. Over 20 years of experience.',
    url: 'https://toriplanen.de',
    telephone: '+49 40 30372206',
    email: 'info@toriplanen.de',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Reeseberg 3',
      addressLocality: 'Hamburg',
      postalCode: '21079',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 53.4631,
      longitude: 9.9988,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    priceRange: '€€',
    image: 'https://toriplanen.de/images/og-image.jpg',
    logo: 'https://toriplanen.de/logo/tori-logo.png',
    sameAs: [],
    areaServed: {
      '@type': 'Country',
      name: 'Germany',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Planen und Netze Dienstleistungen',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'PVC-Planen Montage',
            description: 'PVC Planen für staubdichte Einhausungen, Sandstrahl- und Korrosionsschutzarbeiten. Schutz vor Schmutz, Wind, Regen und Schnee.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Gerüstplanen Montage',
            description: 'Ösenbandplanen und Polybandplanen für jeden Einsatzweck. Schutz vor Regen, Wind und Verschmutzung.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kederplanen Montage',
            description: 'Kederplanen für staubdichte Einhausungen bei Sandstrahl- und Korrosionsschutzarbeiten.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Staubschutznetze Montage',
            description: 'Gerüstnetze für zuverlässigen Schutz vor Staub, Schmutz und herabfallenden Gegenständen.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Strahlschutznetze Montage',
            description: 'Extrem reißfeste und dichte Strahlschutznetze für Strahlarbeiten und längere Standzeiten.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Personenauffangnetze Montage',
            description: 'PA-Netze zur Absturzsicherung für Personen im Hallen- und Brückenbau, Dachdecker- und Zimmereiarbeiten.',
          },
        },
      ],
    },
  };

  return (
    <Script
      id="local-business-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tori Planen - PVC Planen & Netze',
    alternateName: 'Tori Bau GmbH',
    url: 'https://toriplanen.de',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://toriplanen.de/de?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['de-DE', 'en-US', 'hi-IN'],
  };

  return (
    <Script
      id="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export function FAQJsonLd({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}

export function ProductJsonLd({ 
  name, 
  description, 
  image,
  category,
}: { 
  name: string; 
  description: string; 
  image: string;
  category: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    category,
    brand: {
      '@type': 'Brand',
      name: 'Tori Planen',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Tori Bau GmbH',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Tori Bau GmbH',
      },
    },
  };

  return (
    <Script
      id={`product-jsonld-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      strategy="afterInteractive"
    />
  );
}
