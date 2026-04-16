import { NextResponse } from 'next/server'

// Default pricing — used as fallback if WordPress page isn't found
// This is the same structure the calculators use
const DEFAULT_PRICING = {
  wraps: {
    car:   { full: [2500, 3800], partial: [1200, 2000], signwriting: [400, 800] },
    suv:   { full: [3000, 4500], partial: [1500, 2500], signwriting: [500, 900] },
    ute:   { full: [2800, 4200], partial: [1400, 2300], signwriting: [450, 850] },
    van:   { full: [3500, 6000], partial: [1800, 3000], signwriting: [600, 1100] },
    truck: { full: [5000, 10000], partial: [2500, 5000], signwriting: [800, 1500] },
    boat:  { full: [2000, 5000], partial: [1000, 2500], signwriting: [400, 900] },
  },
  wrapDesignFee: [300, 500],
  wrapFleetDiscount: { 3: 0.10, 5: 0.15, 10: 0.20 },
  signage: {
    shopfront:   { small: [800, 1800], medium: [1500, 3500], large: [3000, 6000] },
    '3d':        { small: [1200, 2500], medium: [2000, 4500], large: [4000, 8000] },
    illuminated: { small: [1500, 3000], medium: [2500, 5500], large: [5000, 10000] },
    window:      { small: [300, 800], medium: [600, 1500], large: [1200, 3000] },
    aframe:      { small: [250, 450], medium: [350, 600], large: [500, 800] },
    banner:      { small: [150, 350], medium: [300, 600], large: [500, 1000] },
  },
  signageDesignFee: [200, 400],
}

// Fetches pricing from a WordPress page called "calculator-pricing"
// If Corey updates that page, pricing updates automatically
async function fetchWordPressPricing() {
  try {
    const wpUrl = process.env.NEXT_PUBLIC_WP_API_URL
    if (!wpUrl) return null

    const res = await fetch(`${wpUrl}/pages?slug=calculator-pricing&_fields=content`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!res.ok) return null
    const pages = await res.json()
    if (!pages || pages.length === 0) return null

    // Parse the JSON from the page content
    const content = pages[0].content.rendered
    // Strip HTML tags to get raw JSON
    const stripped = content.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&#8221;/g, '"').replace(/&#8220;/g, '"').replace(/&amp;/g, '&').trim()
    const pricing = JSON.parse(stripped)
    return pricing
  } catch (err) {
    console.error('Failed to fetch WP pricing:', err.message)
    return null
  }
}

export async function GET() {
  const wpPricing = await fetchWordPressPricing()
  const pricing = wpPricing || DEFAULT_PRICING

  return NextResponse.json(pricing, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
