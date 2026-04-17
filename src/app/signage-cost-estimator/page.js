import { getThemeOptions } from '../../lib/api'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import CalculatorComingSoon from '../../components/calculators/CalculatorComingSoon'
import GoogleReviews from '../../components/GoogleReviews'
// Temporarily disabled — pricing being updated. Restore by swapping CalculatorComingSoon back to SignageCalculator.
// import SignageCalculator from '../../components/calculators/SignageCalculator'

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
              Our estimator is getting a refresh. In the meantime, our Adelaide team is ready to give you a tailored signage quote — no obligation.
            </p>
          </div>
        </section>

        <section className="section-padding" style={{ background: '#f8fafc' }}>
          <div className="container">
            <CalculatorComingSoon label="Our signage cost estimator" />
          </div>
        </section>

        <GoogleReviews />
      </main>
      <Footer footerData={themeOptions} pageData={{}} />
    </div>
  )
}
