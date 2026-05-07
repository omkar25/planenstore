import { Metadata } from 'next';
import { ProductJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/shared/seo/JsonLd';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Gerüstplanen kaufen & Montage | Ösenbandplanen & Polybandplanen',
    description: 'Gerüstplanen für Baustellen ✓ Ösenbandplanen ✓ Polybandplanen ✓ Wetterschutz ✓ Professionelle Montage deutschlandweit ✓ Über 20 Jahre Erfahrung ✓ Jetzt anfragen!',
    keywords: [
      'Gerüstplanen',
      'Gerüstplanen kaufen',
      'Ösenbandplanen',
      'Polybandplanen',
      'Gerüstplanen Montage',
      'Baustellenplanen',
      'Gerüstverkleidung',
      'Gerüstschutz',
      'Wetterschutzplanen Gerüst',
    ],
    openGraph: {
      title: 'Gerüstplanen kaufen & Montage | Tori Planen',
      description: 'Ösenbandplanen und Polybandplanen für jeden Einsatzweck. Schutz vor Regen, Wind und Verschmutzung.',
      images: ['/images/portfolio/geruestplanen.jpg'],
    },
    alternates: {
      canonical: '/de/geruestplanen',
    },
  };
}

export default async function GeruestplanenPage() {
  const faqs = [
    {
      question: 'Was ist der Unterschied zwischen Ösenbandplanen und Polybandplanen?',
      answer: 'Ösenbandplanen haben verstärkte Ränder mit eingearbeiteten Ösen für eine sichere Befestigung. Polybandplanen (Gittergewebe) sind leichter und luftdurchlässiger, ideal für längere Standzeiten.',
    },
    {
      question: 'Wie werden Gerüstplanen befestigt?',
      answer: 'Gerüstplanen werden mit Kabelbindern, Spanngurten oder speziellen Haken an den Gerüstrohren befestigt. Unsere Monteure sorgen für eine fachgerechte und sichere Installation.',
    },
    {
      question: 'Sind Gerüstplanen auch in schwer entflammbar erhältlich?',
      answer: 'Ja, wir bieten Ösenbandplanen auch in schwer entflammbarer Ausführung an, ideal für Baustellen mit erhöhten Brandschutzanforderungen.',
    },
  ];

  return (
    <>
      <ProductJsonLd
        name="Gerüstplanen"
        description="Ösenbandplanen und Polybandplanen für jeden Einsatzweck. Schutz vor Regen, Wind und Verschmutzung."
        image="https://toriplanen.de/images/portfolio/geruestplanen.jpg"
        category="Bauplanen"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Startseite', url: 'https://toriplanen.de/de' },
          { name: 'Gerüstplanen', url: 'https://toriplanen.de/de/geruestplanen' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-20">
          <div className="container mx-auto px-4">
            <nav className="text-sm mb-8 text-green-200">
              <Link href="/de" className="hover:text-white">Startseite</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Gerüstplanen</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Gerüstplanen – Professioneller Baustellenschutz
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-3xl mb-8">
              Ösenbandplanen und Polybandplanen für jeden Einsatzweck. 
              Zuverlässiger Schutz vor Regen, Wind und Verschmutzung.
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
            <h2 className="text-3xl font-bold text-center mb-12">Unsere Gerüstplanen-Typen</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Ösenbandplanen</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Verstärkte Ränder mit Ösen
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Auch in schwer entflammbar
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hohe Reißfestigkeit
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Polybandplanen</h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Gittergewebe-Struktur
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Luftdurchlässig
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Leichtgewichtig
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Professionelle Gerüstplanen für Ihre Baustelle</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Unsere <strong>Gerüstplanen</strong> bieten optimalen Schutz für Ihre Baustelle. 
                  Ob Ösenbandplanen oder Polybandplanen – wir haben die passende Lösung für jeden Einsatzweck.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  Mit über <strong>20 Jahren Erfahrung</strong> in der Montage von Planen und Netzen 
                  garantieren wir eine fachgerechte Installation und höchste Qualität.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Häufig gestellte Fragen zu Gerüstplanen</h2>
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
        <section className="py-16 bg-green-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Interesse an Gerüstplanen?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
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
