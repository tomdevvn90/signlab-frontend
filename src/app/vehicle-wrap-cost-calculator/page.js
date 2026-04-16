import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import WrapCalculator from '../../components/calculators/WrapCalculator'
import GoogleReviews from '../../components/GoogleReviews'

export const metadata = {
  title: 'Vehicle Wrap Cost Calculator Adelaide | Signlab',
  description: 'Get an instant estimate for your vehicle wrap in Adelaide. Choose your vehicle type, coverage and see pricing. Free detailed quotes from Signlab. Call 08 8240 0925.',
  openGraph: {
    title: 'Vehicle Wrap Cost Calculator Adelaide | Signlab',
    description: 'Get an instant estimate for your vehicle wrap in Adelaide. Choose your vehicle type, coverage and see pricing.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default async function WrapCalculatorPage() {
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
              Vehicle Wrap Cost Calculator
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Get an instant ballpark estimate for your vehicle wrap. Choose your options below and we&apos;ll show you pricing based on Adelaide market rates.
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: '#f8fafc' }}>
          <div className="container">
            <WrapCalculator />
          </div>
        </section>

        <GoogleReviews />
      </main>
      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
