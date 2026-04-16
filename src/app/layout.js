import Script from 'next/script'
import { Montserrat } from "next/font/google";
import '../styles/globals.scss'
import NextTopLoader from 'nextjs-toploader';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  verification: {
    google: 'qIJsOY1xigg4vy0ECubMnKNfECldc6Doc_p1OdhAWRg',
  },
  title: 'SignLab — Signs, Vehicle Wraps & Digital Signage Adelaide',
  description: 'Adelaide\'s trusted signage company. Custom signs, vehicle wraps, digital signage and banners. Fast turnaround, free on-site quotes. 222 Port Road, Alberton.',
  keywords: 'signage adelaide, vehicle wraps adelaide, signs adelaide, digital signage, banners, signlab, sign company adelaide',
  authors: [{ name: 'SignLab' }],
  openGraph: {
    title: 'SignLab — Signs, Vehicle Wraps & Digital Signage Adelaide',
    description: 'Adelaide\'s trusted signage company. Custom signs, vehicle wraps, digital signage and banners. Fast turnaround, free on-site quotes.',
    type: 'website',
    locale: 'en_AU',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'SignLab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignLab — Signs, Vehicle Wraps & Digital Signage Adelaide',
    description: 'Adelaide\'s trusted signage company. Custom signs, vehicle wraps, digital signage and banners. Fast turnaround, free on-site quotes.',
  },
}

export default async function RootLayout({ children }) {  
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BXQ9NJCXHR"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BXQ9NJCXHR');
          `}
        </Script>
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Signlab",
            "description": "Adelaide's trusted signage company. Custom signs, vehicle wraps, digital signage and banners since 1992.",
            "image": "https://signlab.com.au/signlab-logo.png",
            "telephone": "08 8240 0925",
            "email": "corey@signlab.com.au",
            "url": "https://signlab.com.au",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "222 Port Road",
              "addressLocality": "Alberton",
              "addressRegion": "SA",
              "postalCode": "5014",
              "addressCountry": "AU"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -34.8466,
              "longitude": 138.5537
            },
            "areaServed": { "@type": "City", "name": "Adelaide" },
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "51"
            }
          }) }}
        />
        <NextTopLoader
          color="#fff"
          height={5}
          crawlSpeed={200}
          showSpinner={false}
          zIndex={99999}
        />
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
