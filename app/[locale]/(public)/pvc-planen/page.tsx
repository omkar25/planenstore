import { Metadata } from 'next';
import { ProductJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/shared/seo/JsonLd';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PVC Planen kaufen & Montage | Wetterfest & UV-beständig',
    description: 'PVC Planen für Baustellen, Gerüste & Industrie ✓ Staubdichte Einhausungen ✓ Wetterfest & UV-beständig ✓ Maßanfertigung ✓ Professionelle Montage ✓ Jetzt anfragen!',
    keywords: [
      'PVC Planen',
      'PVC Planen kaufen',
      'PVC Planen Baustelle',
      'PVC Abdeckplanen',
      'PVC Planen nach Maß',
      'PVC Planen wetterfest',
      'PVC Planen UV-beständig',
      'Gerüstplanen PVC',
      'Sandstrahlplanen',
      'Korrosionsschutz Planen',
    ],
    openGraph: {
      title: 'PVC Planen kaufen & Montage | Tori Planen',
      description: 'Hochwertige PVC Planen für staubdichte Einhausungen. Wetterfest, UV-beständig, reißfest. Über 20 Jahre Erfahrung.',
      images: ['/images/portfolio/pvc-planen.jpg'],
    },
    alternates: {
      canonical: '/de/pvc-planen',
    },
  };
}

export default async function PVCPlanenPage() {
  const faqs = [
    {
      question: 'Was sind PVC Planen und wofür werden sie verwendet?',
      answer: 'PVC Planen sind robuste, wetterfeste Abdeckungen aus Polyvinylchlorid. Sie werden hauptsächlich für staubdichte Einhausungen bei Sandstrahl- und Korrosionsschutzarbeiten, als Wetterschutz auf Baustellen und für Gerüstverkleidungen eingesetzt.',
    },
    {
      question: 'Wie lange halten PVC Planen?',
      answer: 'Hochwertige PVC Planen haben eine Lebensdauer von 5-10 Jahren, abhängig von der Nutzung und Witterungseinflüssen. Unsere Planen sind UV-beständig und reißfest für maximale Haltbarkeit.',
    },
    {
      question: 'Können PVC Planen nach Maß angefertigt werden?',
      answer: 'Ja, wir fertigen PVC Planen individuell nach Ihren Maßen an. Kontaktieren Sie uns für ein kostenloses Angebot.',
    },
    {
      question: 'Bieten Sie auch die Montage von PVC Planen an?',
      answer: 'Ja, wir bieten professionelle Montage deutschlandweit an. Unser erfahrenes Team sorgt für eine fachgerechte Installation.',
    },
  ];

  return (
    <>
      <ProductJsonLd
        name="PVC Planen"
        description="Hochwertige PVC Planen für staubdichte Einhausungen, Sandstrahl- und Korrosionsschutzarbeiten. Wetterfest, UV-beständig und reißfest."
        image="https://toriplanen.de/images/portfolio/pvc-planen.jpg"
        category="Bauplanen"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Startseite', url: 'https://toriplanen.de/de' },
          { name: 'PVC Planen', url: 'https://toriplanen.de/de/pvc-planen' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <nav className="text-sm mb-8 text-blue-200">
              <Link href="/de" className="hover:text-white">Startseite</Link>
              <span className="mx-2">/</span>
              <span className="text-white">PVC Planen</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              PVC Planen – Professioneller Wetterschutz
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mb-8">
              Hochwertige PVC Planen für staubdichte Einhausungen, Sandstrahlarbeiten und Korrosionsschutz. 
              Wetterfest, UV-beständig und reißfest.
            </p>
            <Link
              href="/de#kontakt"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Jetzt Angebot anfragen
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Vorteile unserer PVC Planen</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['Wetterfest', 'UV-beständig', 'Reißfest', 'Individuell'].map((feature) => (
                <div key={feature} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Was sind PVC Planen?</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  PVC Planen sind besonders geeignet für <strong>staubdichte Einhausungen</strong>, 
                  z.B. für Sandstrahl- und Korrosionsschutzarbeiten. Sie schützen vor Schmutz, Wind, 
                  Regen und Schnee und sind damit die ideale Lösung für Baustellen und Industrieprojekte.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Unsere PVC Planen werden aus hochwertigem Material gefertigt und zeichnen sich durch 
                  ihre <strong>Langlebigkeit</strong> und <strong>Witterungsbeständigkeit</strong> aus. 
                  Sie sind in verschiedenen Stärken und Farben erhältlich und können individuell nach 
                  Ihren Maßen angefertigt werden.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Einsatzbereiche</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Sandstrahlarbeiten</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Staubdichte Einhausungen für professionelle Sandstrahlarbeiten an Brücken, Gebäuden und Industrieanlagen.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Korrosionsschutz</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Schutz bei Korrosionsschutzarbeiten mit vollständiger Abschirmung gegen Witterungseinflüsse.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3">Gerüstverkleidung</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Professionelle Gerüstverkleidung für Baustellen mit optimalem Wetter- und Sichtschutz.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Häufig gestellte Fragen zu PVC Planen</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interesse an PVC Planen?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne zu Ihrem individuellen Projekt.
            </p>
            <Link
              href="/de#kontakt"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors"
            >
              Jetzt Kontakt aufnehmen
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
