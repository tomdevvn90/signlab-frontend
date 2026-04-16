'use client'

import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────
   DEFAULT PRICING — used until WordPress data loads
   Corey can override these from WordPress (see /api/pricing)
   ───────────────────────────────────────────── */
const DEFAULT_PRICING = {
  car:   { full: [2500, 3800],  partial: [1200, 2000], signwriting: [400, 800] },
  suv:   { full: [3000, 4500],  partial: [1500, 2500], signwriting: [500, 900] },
  ute:   { full: [2800, 4200],  partial: [1400, 2300], signwriting: [450, 850] },
  van:   { full: [3500, 6000],  partial: [1800, 3000], signwriting: [600, 1100] },
  truck: { full: [5000, 10000], partial: [2500, 5000], signwriting: [800, 1500] },
  boat:  { full: [2000, 5000],  partial: [1000, 2500], signwriting: [400, 900] },
}
const DEFAULT_DESIGN_FEE = [300, 500]
const DEFAULT_FLEET_DISCOUNT = { 3: 0.10, 5: 0.15, 10: 0.20 }

const VEHICLE_TYPES = [
  { key: 'car',   label: 'Car',           sub: 'Sedan, Hatch, Coupe',          icon: '🚗' },
  { key: 'suv',   label: 'SUV / 4WD',     sub: 'RAV4, Ranger, Prado',          icon: '🚙' },
  { key: 'ute',   label: 'Ute',           sub: 'HiLux, Navara, BT-50',         icon: '🛻' },
  { key: 'van',   label: 'Van',           sub: 'HiAce, Transit, Sprinter',      icon: '🚐' },
  { key: 'truck', label: 'Truck / Bus',   sub: 'Hino, Isuzu, Rosa',            icon: '🚛' },
  { key: 'boat',  label: 'Boat',          sub: 'Runabout, Fishing, Ski',        icon: '🚤' },
]

const COVERAGE_OPTIONS = [
  {
    key: 'full',
    label: 'Full Branded Wrap',
    desc: 'Complete vehicle coverage with branding, graphics, contact details',
  },
  {
    key: 'partial',
    label: 'Partial Wrap',
    desc: 'Key panels only \u2014 sides, rear, bonnet, tailgate. Great for smaller budgets',
  },
  {
    key: 'signwriting',
    label: 'Signwriting / Logos Only',
    desc: 'Vinyl cut logos, phone number, website on existing paint',
  },
]

const DESIGN_OPTIONS = [
  { key: 'design',  label: 'Design it for me', desc: 'We create your wrap design' },
  { key: 'artwork', label: 'I have artwork',   desc: 'Print-ready files supplied' },
]

function getFleetDiscount(qty) {
  if (qty >= 10) return FLEET_DISCOUNT[10]
  if (qty >= 5)  return FLEET_DISCOUNT[5]
  if (qty >= 3)  return FLEET_DISCOUNT[3]
  return 0
}

function calcPrice(vehicle, coverage, fleet, design) {
  if (!vehicle || !coverage) return null
  const base = PRICING[vehicle][coverage]
  const designAdd = design === 'design' ? DESIGN_FEE : [0, 0]
  const discount = getFleetDiscount(fleet)

  const perLow  = Math.round((base[0] + designAdd[0]) * (1 - discount))
  const perHigh = Math.round((base[1] + designAdd[1]) * (1 - discount))

  return {
    perVehicle: [perLow, perHigh],
    total: [perLow * fleet, perHigh * fleet],
    discount,
  }
}

function getTurnaround(coverage, fleet) {
  const baseDays = coverage === 'full' ? 5 : coverage === 'partial' ? 3 : 2
  const extra = Math.ceil((fleet - 1) * 0.5)
  const low = baseDays + extra
  const high = low + 3
  return `${low}\u2013${high} business days`
}

function fmt(n) {
  return n.toLocaleString('en-AU')
}

/* ── Reusable sub-components ── */

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
              i + 1 <= current
                ? 'text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
            style={i + 1 <= current ? { backgroundColor: 'var(--primary-color, #0051bc)' } : {}}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`w-8 h-0.5 ${
                i + 1 < current ? 'bg-[color:var(--primary-color,#0051bc)]' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function RadioCard({ selected, onClick, children, className = '' }) {
  const isSelected = selected
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left border-2 rounded-xl p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-[color:var(--primary-color,#0051bc)] bg-blue-50/60 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      } ${className}`}
    >
      {/* radio dot */}
      <span
        className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          isSelected ? 'border-[color:var(--primary-color,#0051bc)]' : 'border-gray-300'
        }`}
      >
        {isSelected && (
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'var(--primary-color, #0051bc)' }}
          />
        )}
      </span>
      {children}
    </button>
  )
}

/* ── Main component ── */

export default function WrapCalculator() {
  const [step, setStep] = useState(1)
  const [vehicle, setVehicle] = useState('')
  const [coverage, setCoverage] = useState('')
  const [fleet, setFleet] = useState(1)
  const [design, setDesign] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
  const [PRICING, setPricing] = useState(DEFAULT_PRICING)
  const [DESIGN_FEE, setDesignFee] = useState(DEFAULT_DESIGN_FEE)
  const [FLEET_DISCOUNT, setFleetDiscount] = useState(DEFAULT_FLEET_DISCOUNT)

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(data => {
        if (data.wraps) setPricing(data.wraps)
        if (data.wrapDesignFee) setDesignFee(data.wrapDesignFee)
        if (data.wrapFleetDiscount) setFleetDiscount(data.wrapFleetDiscount)
      })
      .catch(() => {})
  }, [])

  const totalSteps = 4
  const canProceed =
    (step === 1 && vehicle) ||
    (step === 2 && coverage) ||
    (step === 3) ||
    (step === 4 && design)

  const result = calcPrice(vehicle, coverage, fleet, design)

  async function handleSubmit(e) {
    e.preventDefault()
    const vehicleNames = { car: 'Car', suv: 'SUV/4WD', ute: 'Ute', van: 'Van', truck: 'Truck/Bus', boat: 'Boat' }
    const coverageNames = { full: 'Full Branded Wrap', partial: 'Partial Wrap', signwriting: 'Signwriting/Logos' }
    const details = [
      `Vehicle: ${vehicleNames[vehicle] || vehicle}`,
      `Coverage: ${coverageNames[coverage] || coverage}`,
      `Fleet size: ${fleet}`,
      `Design: ${design === 'yes' ? 'Design included' : 'Artwork supplied'}`,
      `Estimate: ${result}`,
    ].join('\n')
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, type: 'Vehicle Wrap Calculator', details }),
      })
    } catch (err) {
      console.error('Lead submission failed:', err)
    }
    setSubmitted(true)
  }

  /* ── Step renderers ── */

  function renderStep1() {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">What type of vehicle?</h3>
        <p className="text-sm text-gray-500 mb-4">Select the vehicle you want wrapped</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {VEHICLE_TYPES.map((v) => (
            <RadioCard key={v.key} selected={vehicle === v.key} onClick={() => setVehicle(v.key)}>
              <span className="text-2xl block mb-1">{v.icon}</span>
              <span className="font-semibold text-gray-900 block text-sm">{v.label}</span>
              <span className="text-xs text-gray-500">{v.sub}</span>
            </RadioCard>
          ))}
        </div>
      </div>
    )
  }

  function renderStep2() {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">How much coverage?</h3>
        <p className="text-sm text-gray-500 mb-4">Choose the level of wrap for your vehicle</p>
        <div className="flex flex-col gap-3">
          {COVERAGE_OPTIONS.map((c) => (
            <RadioCard key={c.key} selected={coverage === c.key} onClick={() => setCoverage(c.key)}>
              <span className="font-semibold text-gray-900 block pr-8">{c.label}</span>
              <span className="text-sm text-gray-500 block mt-0.5 pr-8">{c.desc}</span>
            </RadioCard>
          ))}
        </div>
      </div>
    )
  }

  function renderStep3() {
    const discount = getFleetDiscount(fleet)
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">How many vehicles?</h3>
        <p className="text-sm text-gray-500 mb-6">Fleet discounts apply for 3+ vehicles</p>

        <div className="text-center mb-4">
          <span
            className="text-5xl font-bold"
            style={{ color: 'var(--primary-color, #0051bc)' }}
          >
            {fleet}
          </span>
          <span className="text-gray-500 ml-2 text-lg">
            {fleet === 1 ? 'vehicle' : 'vehicles'}
          </span>
        </div>

        <input
          type="range"
          min={1}
          max={20}
          value={fleet}
          onChange={(e) => setFleet(Number(e.target.value))}
          className="w-full accent-[color:var(--primary-color,#0051bc)] h-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>

        {discount > 0 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
            <span className="text-green-700 font-semibold text-sm">
              {Math.round(discount * 100)}% fleet discount applied!
            </span>
          </div>
        )}
      </div>
    )
  }

  function renderStep4() {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Do you need design?</h3>
        <p className="text-sm text-gray-500 mb-4">Let us know if you need artwork created</p>
        <div className="flex flex-col gap-3">
          {DESIGN_OPTIONS.map((d) => (
            <RadioCard key={d.key} selected={design === d.key} onClick={() => setDesign(d.key)}>
              <span className="font-semibold text-gray-900 block pr-8">{d.label}</span>
              <span className="text-sm text-gray-500 block mt-0.5 pr-8">{d.desc}</span>
            </RadioCard>
          ))}
        </div>
      </div>
    )
  }

  function renderResult() {
    if (!result) return null

    const vehicleLabel = VEHICLE_TYPES.find((v) => v.key === vehicle)?.label || ''
    const coverageLabel = COVERAGE_OPTIONS.find((c) => c.key === coverage)?.label || ''
    const designLabel = DESIGN_OPTIONS.find((d) => d.key === design)?.label || ''
    const turnaround = getTurnaround(coverage, fleet)

    /* ROI estimates */
    const dailyEyeballs = coverage === 'full' ? 3000 : coverage === 'partial' ? 2000 : 800
    const wrapLifespanYears = 5
    const totalImpressions = dailyEyeballs * 365 * wrapLifespanYears
    const avgCost = (result.total[0] + result.total[1]) / 2
    const costPer1000 = ((avgCost / totalImpressions) * 1000).toFixed(2)

    const included = []
    if (coverage === 'full') {
      included.push('Full vehicle coverage', 'Custom branded graphics', 'Contact details & logos', '3M premium vinyl', 'Professional installation')
    } else if (coverage === 'partial') {
      included.push('Key panel coverage (sides, rear, bonnet)', 'Custom branded graphics', 'Contact details & logos', '3M premium vinyl', 'Professional installation')
    } else {
      included.push('Vinyl cut lettering & logos', 'Contact details', 'Professional application', 'Colour-matched vinyl')
    }
    if (design === 'design') included.push('Custom design service')

    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Estimate</h3>

        {/* Price card */}
        <div
          className="rounded-xl p-6 text-white mb-6"
          style={{ backgroundColor: 'var(--primary-color, #0051bc)' }}
        >
          <p className="text-blue-100 text-sm uppercase tracking-wide mb-1">Estimated Price</p>
          <p className="text-3xl sm:text-4xl font-bold mb-1">
            ${fmt(result.total[0])} &ndash; ${fmt(result.total[1])}
          </p>
          {fleet > 1 && (
            <p className="text-blue-200 text-sm">
              ${fmt(result.perVehicle[0])} &ndash; ${fmt(result.perVehicle[1])} per vehicle &times; {fleet} vehicles
              {result.discount > 0 && (
                <span className="ml-2 bg-white/20 rounded px-2 py-0.5 text-xs font-semibold">
                  {Math.round(result.discount * 100)}% fleet discount
                </span>
              )}
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-white/20 text-sm text-blue-100 space-y-0.5">
            <p>{vehicleLabel} &middot; {coverageLabel}</p>
            <p>{designLabel}</p>
          </div>
        </div>

        {/* What's included */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h4 className="font-semibold text-gray-900 text-sm mb-3">What&apos;s Included</h4>
          <ul className="space-y-1.5">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--primary-color, #0051bc)' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Turnaround */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0" style={{ color: 'var(--primary-color, #0051bc)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-gray-900">Estimated Turnaround</p>
            <p className="text-sm text-gray-600">{turnaround}</p>
          </div>
        </div>

        {/* ROI strip */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h4 className="font-semibold text-gray-900 text-sm mb-3">Return on Investment</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-color, #0051bc)' }}>
                {fmt(dailyEyeballs)}+
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Daily eyeballs</p>
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-color, #0051bc)' }}>
                ${costPer1000}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Cost per 1,000 impressions</p>
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-color, #0051bc)' }}>
                {wrapLifespanYears} yrs
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Wrap lifespan</p>
            </div>
          </div>
        </div>

        {/* Lead form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 mb-6">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Get Your Detailed Quote</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color,#0051bc)] focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone number"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color,#0051bc)] focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email address"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color,#0051bc)] focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 rounded-lg transition-opacity hover:opacity-90 text-sm"
                style={{ backgroundColor: 'var(--primary-color, #0051bc)' }}
              >
                Send My Estimate
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-center">
            <svg className="w-10 h-10 mx-auto text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-green-800">Thanks {form.name}!</p>
            <p className="text-sm text-green-700 mt-1">We&apos;ll be in touch shortly with your detailed quote.</p>
          </div>
        )}

        {/* Phone CTA */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">or call for a free on-site measure & quote</p>
          <a href="tel:0882400925" className="text-xl font-bold" style={{ color: 'var(--primary-color, #0051bc)' }}>
            08 8240 0925
          </a>
        </div>

        {/* Guarantee badges */}
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '🛡️', text: '36-Month Guarantee' },
            { icon: '✅', text: '3M Preferred Installer' },
            { icon: '💎', text: 'No Peeling or Fading' },
          ].map((badge, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4">
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Main render ── */

  const showResult = step > totalSteps

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div
          className="px-6 py-5 text-white"
          style={{ backgroundColor: 'var(--primary-color, #0051bc)' }}
        >
          <h2 className="text-xl font-bold">Vehicle Wrap Cost Calculator</h2>
          <p className="text-blue-100 text-sm mt-0.5">
            Get an instant estimate for your vehicle wrap
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {!showResult && <StepIndicator current={step} total={totalSteps} />}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {showResult && renderResult()}

          {/* Navigation */}
          {!showResult && (
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={!canProceed}
                onClick={() => setStep((s) => s + 1)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg text-white transition-all ${
                  canProceed ? 'hover:opacity-90 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                }`}
                style={{ backgroundColor: 'var(--primary-color, #0051bc)' }}
              >
                {step === totalSteps ? 'See My Estimate' : 'Next'}
              </button>
            </div>
          )}

          {/* Start over */}
          {showResult && (
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setVehicle('')
                setCoverage('')
                setFleet(1)
                setDesign('')
                setForm({ name: '', phone: '', email: '' })
                setSubmitted(false)
              }}
              className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
