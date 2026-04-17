import Link from 'next/link'

export default function CalculatorComingSoon({ label = 'Our calculator' }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className="rounded-2xl bg-white p-8 sm:p-12 text-center"
        style={{
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
      >
        <div
          className="inline-flex items-center justify-center rounded-full mb-6"
          style={{
            width: 72,
            height: 72,
            background: 'linear-gradient(135deg, rgba(0,81,188,0.12), rgba(0,81,188,0.04))',
            color: 'var(--primary-color, #0051bc)',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <div
          className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
          style={{ background: 'rgba(0,81,188,0.08)', color: 'var(--primary-color, #0051bc)' }}
        >
          Coming Soon
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>
          {label} is being updated
        </h2>

        <p className="text-base leading-relaxed mb-8 mx-auto" style={{ color: '#475569', maxWidth: 480 }}>
          We&apos;re fine-tuning our pricing to make sure every estimate is spot on. In the meantime, our team can give you a proper tailored quote &mdash; usually same day.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg text-sm transition-all"
            style={{
              background: 'var(--primary-color, #0051bc)',
              color: '#fff',
              boxShadow: '0 8px 20px -6px rgba(0,81,188,0.4)',
            }}
          >
            Request a Quote
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="tel:0882400925"
            className="inline-flex items-center justify-center gap-2 font-bold py-3 px-6 rounded-lg text-sm transition-all"
            style={{
              background: '#f1f5f9',
              color: '#0f172a',
              border: '1px solid #e2e8f0',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call 08 8240 0925
          </a>
        </div>
      </div>
    </div>
  )
}
