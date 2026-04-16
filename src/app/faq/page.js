import Script from 'next/script'
import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoogleReviews from '../../components/GoogleReviews'

const FAQS = [
  {
    category: 'Vehicle Wraps',
    questions: [
      {
        q: 'How much does a vehicle wrap cost in Adelaide?',
        a: 'Vehicle wrap pricing depends on the size of your vehicle and the coverage you need. Full wraps start from around $2,200 for a car, with van wraps ranging from $3,500 to $6,000. Partial wraps and signwriting start from $400. All our wraps come with a 36-month guarantee.',
      },
      {
        q: 'How long does a vehicle wrap last?',
        a: "A quality vehicle wrap installed by Signlab will last 5 to 7 years in Adelaide's climate. We use premium cast vinyl that resists UV fading, which is important given the harsh South Australian sun. Every wrap comes with our 36-month workmanship guarantee.",
      },
      {
        q: 'Can a wrap be removed without damaging the paint?',
        a: 'Yes. We use 3M and Avery Dennison cast vinyl which is designed to be removed cleanly without damaging your vehicle\'s paint. This makes wraps a great option for leased vehicles or if you want to update your branding down the track.',
      },
      {
        q: 'Do you offer fleet discounts?',
        a: 'Yes. Signlab offers discounts for 3 or more vehicles, with larger savings for bigger fleets. Fleet wrapping creates a consistent, professional look across all your vehicles and costs less per vehicle. Contact us for a fleet quote.',
      },
    ],
  },
  {
    category: 'Signage',
    questions: [
      {
        q: 'How much does a shop sign cost in Adelaide?',
        a: 'Shop signage varies based on size, materials, and whether it\'s illuminated. A basic flat panel sign starts from around $800, while illuminated shopfront signage can range from $1,500 to $8,000+. We provide free on-site measure and quote for all signage projects.',
      },
      {
        q: 'Do I need council approval for my sign?',
        a: 'Most external signage requires council approval. The requirements vary by council area — the City of Adelaide, for example, has specific rules for heritage zones and high-traffic areas like Rundle Mall. Signlab handles the entire council application process for you.',
      },
      {
        q: 'How long does a shopfront sign take?',
        a: 'Standard shopfront signage takes 5 to 10 business days from design approval to installation. Illuminated signs and 3D fabricated letters typically take 2 to 3 weeks. We can arrange rush jobs if you have a tight deadline.',
      },
      {
        q: 'Can you match my existing branding?',
        a: 'Absolutely. We work from your existing brand guidelines, logos and colour specifications to ensure your signage matches your branding perfectly. If you don\'t have a style guide, our in-house design team can help create a cohesive look.',
      },
    ],
  },
  {
    category: 'General',
    questions: [
      {
        q: 'Do you do design work or do I need to supply artwork?',
        a: 'Both. Our in-house graphic designers can create your signage or wrap design from scratch, or we can work from your supplied artwork. Design is included in most of our quotes, and we always provide mockups for your approval before production.',
      },
      {
        q: 'What areas of Adelaide do you cover?',
        a: 'We service all of metropolitan Adelaide and regional South Australia. Our workshop is at 222 Port Road, Alberton, and we offer free on-site measure and quote anywhere in Adelaide. For regional jobs, we can arrange site visits.',
      },
    ],
  },
]

const allQuestions = FAQS.flatMap((cat) => cat.questions)

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allQuestions.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export const metadata = {
  title: 'FAQ — Signlab Adelaide | Signs & Vehicle Wraps',
  description: 'Frequently asked questions about signage and vehicle wraps in Adelaide. Pricing, turnaround times, materials and more. Get answers from Signlab.',
  openGraph: {
    title: 'FAQ — Signlab Adelaide | Signs & Vehicle Wraps',
    description: 'Frequently asked questions about signage and vehicle wraps in Adelaide.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default async function FAQPage() {
  const themeOptions = await getThemeOptions()

  return (
    <div className="page">
      <Header headerData={themeOptions} />
      <main className="site-main min-h-screen">
        <section
          className="text-white text-center"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e3a5f 100%)',
            padding: 'clamp(48px, 6vw, 80px) 24px',
          }}
        >
          <div className="container">
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Everything you need to know about signage and vehicle wraps in Adelaide.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {FAQS.map((category, ci) => (
                <div key={ci} className={ci > 0 ? 'mt-12' : ''}>
                  <h2
                    className="text-sm font-bold uppercase tracking-widest mb-6"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    {category.category}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {category.questions.map((faq, qi) => (
                      <div
                        key={qi}
                        className="bg-white rounded-lg p-6"
                        style={{ border: '1px solid #e2e8f0' }}
                      >
                        <h3 className="text-lg font-semibold mb-3">{faq.q}</h3>
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="text-white text-center"
          style={{
            background: 'var(--primary-color)',
            padding: 'clamp(48px, 6vw, 80px) 24px',
          }}
        >
          <div className="container">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              We&apos;re happy to chat. Call us or send an enquiry anytime.
            </p>
            <a
              href="tel:0882400925"
              className="inline-block bg-white font-bold py-3 px-8 rounded-md text-lg"
              style={{ color: 'var(--primary-color)' }}
            >
              Call 08 8240 0925
            </a>
          </div>
        </section>

        <GoogleReviews />
      </main>

      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
