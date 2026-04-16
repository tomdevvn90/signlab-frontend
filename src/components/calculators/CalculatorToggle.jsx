'use client'

import { useState } from 'react'
import WrapCalculator from './WrapCalculator'
import SignageCalculator from './SignageCalculator'

export default function CalculatorToggle() {
  const [active, setActive] = useState('wraps')

  return (
    <div>
      {/* Toggle */}
      <div className="flex justify-center mb-8">
        <div
          className="inline-flex rounded-xl p-1.5 gap-1.5"
          style={{ background: '#e2e8f0' }}
        >
          <button
            onClick={() => setActive('wraps')}
            className="px-6 py-3 rounded-lg text-sm font-bold transition-all"
            style={
              active === 'wraps'
                ? { background: 'var(--primary-color, #0051bc)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                : { background: 'transparent', color: '#64748b' }
            }
          >
            <span className="hidden sm:inline">Vehicle Wraps</span>
            <span className="sm:hidden">Wraps</span>
          </button>
          <button
            onClick={() => setActive('signage')}
            className="px-6 py-3 rounded-lg text-sm font-bold transition-all"
            style={
              active === 'signage'
                ? { background: 'var(--primary-color, #0051bc)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                : { background: 'transparent', color: '#64748b' }
            }
          >
            Signage
          </button>
        </div>
      </div>

      {/* Calculator */}
      {active === 'wraps' ? <WrapCalculator /> : <SignageCalculator />}
    </div>
  )
}
