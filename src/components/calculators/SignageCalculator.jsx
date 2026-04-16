'use client'

import { useState, useEffect } from 'react'

// ============================================================
// DEFAULT PRICING — used until WordPress data loads
// Corey can override these from WordPress (see /api/pricing)
// ============================================================
const DEFAULT_PRICING = {
  shopfront:   { small: [800, 1800], medium: [1500, 3500], large: [3000, 6000] },
  '3d':        { small: [1200, 2500], medium: [2000, 4500], large: [4000, 8000] },
  illuminated: { small: [1500, 3000], medium: [2500, 5500], large: [5000, 10000] },
  window:      { small: [300, 800], medium: [600, 1500], large: [1200, 3000] },
  aframe:      { small: [250, 450], medium: [350, 600], large: [500, 800] },
  banner:      { small: [150, 350], medium: [300, 600], large: [500, 1000] },
}
const DEFAULT_DESIGN_FEE = [200, 400]
const TURNAROUND = {
  shopfront: '5-10 business days',
  '3d': '10-15 business days',
  illuminated: '2-3 weeks',
  window: '3-5 business days',
  aframe: '3-5 business days',
  banner: '2-3 business days',
}
// ============================================================

const SIGN_TYPES = [
  { id: 'shopfront', label: 'Shopfront Sign', desc: 'Fascia, lightbox, or flat panel above your door' },
  { id: '3d', label: '3D Letters', desc: 'Raised individual letters on wall or fascia' },
  { id: 'illuminated', label: 'Illuminated Sign', desc: 'LED-lit shopfront, lightbox, or halo-lit letters' },
  { id: 'window', label: 'Window Graphics', desc: 'Frosted film, vinyl decals, full window wraps' },
  { id: 'aframe', label: 'A-Frame / Sandwich Board', desc: 'Double-sided, sits on the footpath' },
  { id: 'banner', label: 'Banner', desc: 'Pull-up, mesh fence, or PVC printed banner' },
]

const SIZES = [
  { id: 'small', label: 'Small', desc: 'Under 2m wide' },
  { id: 'medium', label: 'Medium', desc: '2-4m wide' },
  { id: 'large', label: 'Large', desc: '4m+ wide' },
]

const DESIGN_OPTIONS = [
  { id: 'design', label: 'Design it for me', desc: 'We create the design' },
  { id: 'artwork', label: 'I have artwork', desc: 'Print-ready files supplied' },
]

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`text-left rounded-lg border-2 p-4 transition-all cursor-pointer ${
            value === opt.id
              ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5 shadow-sm'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                value === opt.id
                  ? 'border-[var(--primary-color)] bg-[var(--primary-color)]'
                  : 'border-gray-300'
              }`}
            >
              {value === opt.id && (
                <span className="block h-2 w-2 rounded-full bg-white" />
              )}
            </span>
            <div>
              <p className="font-semibold text-gray-900">{opt.label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{opt.desc}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              i + 1 <= current
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-12 transition-colors ${
                i + 1 < current ? 'bg-[var(--primary-color)]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default function SignageCalculator() {
  const [step, setStep] = useState(1)
  const [signType, setSignType] = useState('')
  const [size, setSize] = useState('')
  const [design, setDesign] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [PRICING, setPricing] = useState(DEFAULT_PRICING)
  const [DESIGN_FEE, setDesignFee] = useState(DEFAULT_DESIGN_FEE)

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => {
        if (data.signage) setPricing(data.signage)
        if (data.signageDesignFee) setDesignFee(data.signageDesignFee)
      })
      .catch(() => {})
  }, [])

  const showResult = signType && size && design

  function getEstimate() {
    if (!signType || !size) return null
    const base = PRICING[signType][size]
    const designAdd = design === 'design' ? DESIGN_FEE : [0, 0]
    return [base[0] + designAdd[0], base[1] + designAdd[1]]
  }

  function getIncludes() {
    const parts = []
    const typeLabel = SIGN_TYPES.find((t) => t.id === signType)?.label || ''
    const sizeLabel = SIZES.find((s) => s.id === size)?.label.toLowerCase() || ''
    parts.push(`${sizeLabel}-sized ${typeLabel.toLowerCase()}`)
    parts.push('professional installation')
    if (design === 'design') parts.push('custom graphic design')
    parts.push('site measure & quote')
    return parts
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const typeNames = { shopfront: 'Shopfront Sign', '3d': '3D Letters', illuminated: 'Illuminated Sign', window: 'Window Graphics', aframe: 'A-Frame', banner: 'Banner' }
    const sizeNames = { small: 'Small (under 2m)', medium: 'Medium (2-4m)', large: 'Large (4m+)' }
    const [low, high] = getEstimate()
    const details = [
      `Sign type: ${typeNames[signType] || signType}`,
      `Size: ${sizeNames[size] || size}`,
      `Design: ${design === 'design' ? 'Design included' : 'Artwork supplied'}`,
      `Estimate: $${low.toLocaleString()} – $${high.toLocaleString()}`,
      `Turnaround: ${TURNAROUND[signType]}`,
    ].join('\n')
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, type: 'Signage Cost Estimator', details }),
      })
    } catch (err) {
      console.error('Lead submission failed:', err)
    }
    setSubmitted(true)
  }

  function handleNext() {
    if (step < 3) setStep(step + 1)
  }

  function handleBack() {
    if (step > 1) setStep(step - 1)
  }

  function canAdvance() {
    if (step === 1) return !!signType
    if (step === 2) return !!size
    if (step === 3) return !!design
    return false
  }

  const estimate = getEstimate()

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--primary-color)] px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">Signage Cost Estimator</h2>
          <p className="text-white/80 mt-1 text-sm">
            Get an instant ballpark price for your sign project
          </p>
        </div>

        <div className="p-6">
          {!showResult ? (
            <>
              <StepIndicator current={step} total={3} />

              {/* Step 1 */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    What type of sign do you need?
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select the option that best fits your project.
                  </p>
                  <RadioGroup
                    options={SIGN_TYPES}
                    value={signType}
                    onChange={setSignType}
                  />
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    What size are you after?
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Approximate width of the finished sign.
                  </p>
                  <RadioGroup
                    options={SIZES}
                    value={size}
                    onChange={setSize}
                  />
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Do you need design work?
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Let us know if you have print-ready artwork or need us to
                    create it.
                  </p>
                  <RadioGroup
                    options={DESIGN_OPTIONS}
                    value={design}
                    onChange={setDesign}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    step === 1
                      ? 'invisible'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--primary-color)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            /* Result */
            <div>
              {!submitted ? (
                <>
                  {/* Estimate card */}
                  <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 mb-6">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Your Estimated Price
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-[var(--primary-color)]">
                      ${estimate[0].toLocaleString()} &ndash; $
                      {estimate[1].toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Inc. GST &middot; Final price confirmed after site measure
                    </p>
                  </div>

                  {/* What's included */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      What&apos;s included
                    </h4>
                    <ul className="space-y-1.5">
                      {getIncludes().map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <svg
                            className="h-4 w-4 shrink-0 text-[var(--primary-color)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="capitalize">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Turnaround */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 bg-blue-50 rounded-lg px-4 py-3">
                    <svg
                      className="h-5 w-5 shrink-0 text-[var(--primary-color)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Estimated turnaround:{' '}
                      <strong className="text-gray-900">
                        {TURNAROUND[signType]}
                      </strong>
                    </span>
                  </div>

                  {/* Lead form */}
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Get your estimate emailed to you
                    </h4>
                    <input
                      type="text"
                      placeholder="Your name"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none transition"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      required
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none transition"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 focus:outline-none transition"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[var(--primary-color)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Send My Estimate
                    </button>
                  </form>

                  {/* Phone CTA */}
                  <p className="text-center text-sm text-gray-500 mt-4">
                    or call for a free on-site measure &amp; quote{' '}
                    <a
                      href="tel:0882400925"
                      className="font-semibold text-[var(--primary-color)] hover:underline"
                    >
                      08 8240 0925
                    </a>
                  </p>

                  {/* Start over */}
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1)
                        setSignType('')
                        setSize('')
                        setDesign('')
                        setForm({ name: '', phone: '', email: '' })
                      }}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Start over
                    </button>
                  </div>
                </>
              ) : (
                /* Success message */
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-7 w-7 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Estimate sent!
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    We&apos;ll be in touch within 1 business day.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Need it sooner? Call us on{' '}
                    <a
                      href="tel:0882400925"
                      className="font-semibold text-[var(--primary-color)] hover:underline"
                    >
                      08 8240 0925
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1)
                      setSignType('')
                      setSize('')
                      setDesign('')
                      setForm({ name: '', phone: '', email: '' })
                      setSubmitted(false)
                    }}
                    className="text-sm font-medium text-[var(--primary-color)] hover:underline"
                  >
                    Get another estimate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
