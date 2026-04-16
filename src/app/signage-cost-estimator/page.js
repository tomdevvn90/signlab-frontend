import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SignageCalculator from '../../components/calculators/SignageCalculator'
import GoogleReviews from '../../components/GoogleReviews'

export const metadata = {
  title: 'Signage Cost Estimator Adelaide | Signlab',
  description: 'Get an instant estimate for your business signage in Adelaide. Shopfront signs, 3D letters, illuminated signs and more. Free detailed quotes from Signlab.',
  openGraph: {
    title: 'Signage Cost Estimator Adelaide | Signlab',
    description: 'Get an instant estimate for your business signage in Adelaide. Shopfront signs, 3D letters, illuminated signs and more.',
    type: 'website',
    locale: 'en_AU',
  },
}

export default async function SignageCalculatorPage() {
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
              Signage Cost Estimator
            </h1>
            <p className="text-lg lg:text-xl max-w-2xl mx-auto opacity-90">
              Get an instant ballpark price for your business signage. Choose your options below and we&apos;ll show you estimates based on Adelaide market rates.
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: '#f8fafc' }}>
          <div className="container">
            <SignageCalculator />
          </div>
        </section>

        <GoogleReviews />
      </main>
      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
