import { Metadata } from 'next';
import { ProductJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/shared/seo/JsonLd';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kederplanen kaufen & Montage | Staubdichte Einhausungen',
    description: 'Kederplanen für staubdichte Einhausungen ✓ Sandstrahlarbeiten ✓ Korrosionsschutz ✓ Professionelle Montage ✓ Maßanfertigung ✓ Über 20 Jahre Erfahrung ✓ Jetzt anfragen!',
    keywords: [
      'Kederplanen',
      'Kederplanen kaufen',
      'Kederplanen Montage',
      'Keder Planen',
      'Staubdichte Einhausung',
      'Sandstrahlplanen',
      'Korrosionsschutz Planen',
      'Kederplanen nach Maß',
    ],
    openGraph: {
      title: 'Kederplanen kaufen & Montage | Tori Planen',
      description: 'Kederplanen für staubdichte Einhausungen bei Sandstrahl- und Korrosionsschutzarbeiten.',
      images: ['/images/portfolio/kederplanen.jpg'],
    },
    alternates: {
      canonical: '/de/kederplanen',
    },
  };
}

export default async function KederplanenPage() {
  const faqs = [
    {
      question: 'Was sind Kederplanen?',
      answer: 'Kederplanen sind spezielle Planen mit einem Keder (Randverstärkung), die in Kederschienen eingezogen werden. Sie bieten eine besonders staubdichte und wetterfeste Einhausung.',
    },
    {
      question: 'Wofür werden Kederplanen verwendet?',
      answer: 'Kederplanen werden hauptsächlich für staubdichte Einhausungen bei Sandstrahl- und Korrosionsschutzarbeiten eingesetzt. Sie schützen vor Schmutz, Wind, Regen und Schnee.',
    },
    {
      question: 'Können Kederplanen nach Maß angefertigt werden?',
      answer: 'Ja, wir fertigen Kederplanen individuell nach Ihren Maßen an. Kontaktieren Sie uns für ein kostenloses Angebot.',
    },
  ];

  return (
    <>
      <ProductJsonLd
        name="Kederplanen"
        description="Kederplanen für staubdichte Einhausungen bei Sandstrahl- und Korrosionsschutzarbeiten. Schutz vor Schmutz, Wind, Regen und Schnee."
        image="https://toriplanen.de/images/portfolio/kederplanen.jpg"
        category="Bauplanen"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Startseite', url: 'https://toriplanen.de/de' },
          { name: 'Kederplanen', url: 'https://toriplanen.de/de/kederplanen' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-900 to-purple-700 text-white py-20">
          <div className="container mx-auto px-4">
            <nav className="text-sm mb-8 text-purple-200">
              <Link href="/de" className="hover:text-white">Startseite</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Kederplanen</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Kederplanen – Staubdichte Einhausungen
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mb-8">
              Professionelle Kederplanen für Sandstrahl- und Korrosionsschutzarbeiten. 
              Optimaler Schutz vor Schmutz, Wind, Regen und Schnee.
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
            <h2 className="text-3xl font-bold text-center mb-12">Vorteile von Kederplanen</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['Staubdicht', 'Wetterfest', 'Maßanfertigung', 'Schnelle Montage'].map((feature) => (
                <div key={feature} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <h2 className="text-3xl font-bold mb-6">Was sind Kederplanen?</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  <strong>Kederplanen</strong> sind besonders geeignet für staubdichte Einhausungen, 
                  z.B. für Sandstrahl- und Korrosionsschutzarbeiten. Sie schützen vor Schmutz, Wind, 
                  Regen und Schnee.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Der <strong>Keder</strong> (eine verstärkte Randleiste) wird in spezielle Kederschienen 
                  eingezogen, was eine besonders sichere und dichte Verbindung ermöglicht. Dies macht 
                  Kederplanen ideal für Projekte, bei denen eine vollständige Abdichtung erforderlich ist.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Häufig gestellte Fragen zu Kederplanen</h2>
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
        <section className="py-16 bg-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interesse an Kederplanen?</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne!
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
