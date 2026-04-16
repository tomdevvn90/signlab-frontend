import Script from 'next/script'
import { notFound } from 'next/navigation'
import { getThemeOptions } from '../../../lib/api'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { suburbs } from '../suburbs'

export const revalidate = 60

export async function generateStaticParams() {
  return Object.keys(suburbs).map((suburb) => ({ suburb }))
}

export async function generateMetadata({ params }) {
  const data = suburbs[params.suburb]
  if (!data) return {}

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: 'website',
      locale: 'en_AU',
      url: `https://signlab.com.au/areas/${params.suburb}`,
      siteName: 'SignLab',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
    },
  }
}

export default async function SuburbPage({ params }) {
  const data = suburbs[params.suburb]
  if (!data) notFound()

  const themeOptions = await getThemeOptions()

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Signlab',
    image: 'https://signlab.com.au/signlab-logo.png',
    telephone: '08 8240 0925',
    email: 'corey@signlab.com.au',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '222 Port Road',
      addressLocality: 'Alberton',
      addressRegion: 'SA',
      postalCode: '5014',
      addressCountry: 'AU',
    },
    areaServed: {
      '@type': 'Place',
      name: data.areaServed,
    },
    url: 'https://signlab.com.au',
    priceRange: '$$',
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="page">
      <Header headerData={themeOptions} />

      <main className="site-main min-h-screen">
        {/* Hero */}
        <section
          className="text-white text-center"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #1e3a5f 100%)',
            padding: 'clamp(60px, 8vw, 100px) 24px',
          }}
        >
          <div className="container">
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              {data.title}
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90 mb-8">
              {data.subtitle}
            </p>
            <a
              href="tel:0882400925"
              className="inline-block bg-white font-bold py-3 px-8 rounded-md text-lg transition-transform hover:-translate-y-0.5"
              style={{ color: 'var(--primary-color)' }}
            >
              Call 08 8240 0925
            </a>
          </div>
        </section>

        {/* Content Sections */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {data.sections.map((section, i) => (
                <div key={i} className={i > 0 ? 'mt-12' : ''}>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {section.heading}
                  </h2>
                  <div
                    className="wp-content"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-padding" style={{ background: '#f8fafc' }}>
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-4">
                {data.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-6"
                    style={{ border: '1px solid #e2e8f0' }}
                  >
                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section
          className="text-white text-center"
          style={{
            background: 'var(--primary-color)',
            padding: 'clamp(48px, 6vw, 80px) 24px',
          }}
        >
          <div className="container">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {data.cta.heading}
            </h2>
            <p className="text-lg opacity-90 mb-8">{data.cta.text}</p>
            <a
              href={`mailto:corey@signlab.com.au?subject=${encodeURIComponent(data.cta.emailSubject)}`}
              className="inline-block bg-white font-bold py-3 px-8 rounded-md text-lg"
              style={{ color: 'var(--primary-color)' }}
            >
              Request a Quote
            </a>
            <a
              href="tel:0882400925"
              className="block mt-4 text-xl font-semibold text-white"
            >
              08 8240 0925
            </a>
          </div>
        </section>
      </main>

      <Script
        id={`local-business-${params.suburb}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Script
        id={`faq-schema-${params.suburb}`}
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
