import Link from 'next/link'
import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GoogleReviews from '../../components/GoogleReviews'
import { allAreas } from './all-areas'

export const metadata = {
  title: 'Signage & Vehicle Wraps Across Adelaide | Signlab',
  description: 'Signlab provides signage, vehicle wraps and fleet graphics across all of Adelaide and regional SA. Workshop at 222 Port Road, Alberton. Free on-site quotes anywhere in Adelaide.',
  openGraph: {
    title: 'Signage & Vehicle Wraps Across Adelaide | Signlab',
    description: 'Signlab provides signage, vehicle wraps and fleet graphics across all of Adelaide and regional SA.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default async function AreasPage() {
  const themeOptions = await getThemeOptions()
  const liveAreas = allAreas.filter((a) => a.status === 'live')

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
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Signage & Vehicle Wraps Across Adelaide
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              From the northern suburbs to the Adelaide Hills, Signlab services all of metropolitan Adelaide and regional South Australia. Our workshop at 222 Port Road, Alberton is centrally located — and we come to you for free on-site quotes.
            </p>
          </div>
        </section>

        {/* What we cover */}
        <section className="section-padding">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                We Come to You — Anywhere in Adelaide
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Whether you&apos;re a tradie in Salisbury, a retailer on Rundle Mall, a cafe owner in Norwood or a fleet operator in Lonsdale — Signlab designs, manufactures and installs signage and vehicle wraps for businesses of every size. Free on-site measure and quote, anywhere in Adelaide.
              </p>
            </div>

            {/* Region grid */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>North Adelaide</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Salisbury, Elizabeth, Parafield Gardens, Mawson Lakes, Smithfield, Davoren Park, Gawler, Modbury, Tea Tree Gully, Ingle Farm, Pooraka</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>Central & City</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Adelaide CBD, Rundle Mall, Hindley Street, North Adelaide, Prospect, Walkerville, Kent Town, Unley, Goodwood, Hyde Park</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>East Adelaide</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Norwood, The Parade, Kensington, Burnside, Magill, St Peters, Payneham, Stepney, Marryatville, Beulah Park, Campbelltown</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>South Adelaide</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Marion, Morphett Vale, Reynella, Lonsdale, Hallett Cove, Brighton, Seacliff, Glenelg, Noarlunga, Aldinga, McLaren Vale</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>West Adelaide</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Port Adelaide, Alberton, Hendon, West Lakes, Seaton, Findon, Woodville, Semaphore, Largs Bay, Cheltenham</p>
              </div>
              <div className="rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: 'var(--primary-color)' }}>Adelaide Hills & Regional</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Mount Barker, Stirling, Hahndorf, Murray Bridge, Victor Harbor, Barossa Valley, Clare Valley, Port Augusta and beyond</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured area pages */}
        {liveAreas.length > 0 && (
          <section className="section-padding" style={{ background: '#f8fafc' }}>
            <div className="container">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 text-center">
                  Local Area Guides
                </h2>
                <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
                  Detailed pricing, FAQs and service information for specific Adelaide suburbs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {liveAreas.map((area) => (
                    <Link
                      key={area.slug}
                      href={`/areas/${area.slug}`}
                      className="group block bg-white rounded-xl overflow-hidden transition-shadow hover:shadow-lg"
                      style={{ border: '1px solid #e2e8f0' }}
                    >
                      <div
                        className="p-4 text-white text-center"
                        style={{ background: 'var(--primary-color)' }}
                      >
                        <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                          {area.region}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">
                          {area.name}
                        </h3>
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-3"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          {area.type}
                        </p>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {area.description}
                        </p>
                        <span
                          className="inline-block mt-4 text-sm font-bold"
                          style={{ color: 'var(--primary-color)' }}
                        >
                          Read more →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

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
              Get a Free Quote — We&apos;ll Come to You
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Wherever you are in Adelaide, Signlab provides free on-site measure and quote for all signage and vehicle wrap projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0882400925"
                className="inline-block bg-white font-bold py-3 px-8 rounded-md text-lg"
                style={{ color: 'var(--primary-color)' }}
              >
                Call 08 8240 0925
              </a>
              <a
                href="mailto:corey@signlab.com.au?subject=Quote Request"
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-white/10 transition-colors"
              >
                Email for a Quote
              </a>
            </div>
          </div>
        </section>

        <GoogleReviews />
      </main>
      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
