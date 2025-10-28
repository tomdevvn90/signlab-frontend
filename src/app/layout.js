import { Montserrat } from "next/font/google";
import '../styles/globals.scss'
import NextTopLoader from 'nextjs-toploader';

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  title: 'SignLab - Digital Signage Solutions',
  description: 'Professional digital signage solutions for businesses',
  keywords: 'digital signage, display solutions, business technology',
  authors: [{ name: 'SignLab Team' }],
  openGraph: {
    title: 'SignLab - Digital Signage Solutions',
    description: 'Professional digital signage solutions for businesses',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'SignLab',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SignLab - Digital Signage Solutions',
    description: 'Professional digital signage solutions for businesses',
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
