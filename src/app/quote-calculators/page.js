import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CalculatorToggle from '../../components/calculators/CalculatorToggle'
import GoogleReviews from '../../components/GoogleReviews'

export const metadata = {
  title: 'Free Quote Calculators — Vehicle Wraps & Signage | Signlab Adelaide',
  description: 'Get an instant estimate for vehicle wraps or signage in Adelaide. Choose your options, see pricing, and request a detailed quote from Signlab. Free, no sign-up needed.',
  openGraph: {
    title: 'Free Quote Calculators — Vehicle Wraps & Signage | Signlab Adelaide',
    description: 'Get an instant estimate for vehicle wraps or signage in Adelaide. Free, no sign-up needed.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default async function QuoteCalculatorsPage() {
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
              Get an Instant Quote
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Choose your options below and get a ballpark estimate in under 60 seconds. No sign-up, no obligation — just honest Adelaide pricing.
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: '#f8fafc' }}>
          <div className="container">
            <CalculatorToggle />
          </div>
        </section>

        <GoogleReviews />
      </main>
      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
