import '../styles/globals.scss'

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          <header
            className="bg-transparent absolute left-0 right-0"
          >
            <div className="container">
              <nav className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <a href="/" className="text-4xl font-black text-white uppercase">
                    SignLab
                  </a>
                </div>
                <div className="">
                  <button className="text-white hover:text-blue-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="square" strokeLinejoin="square" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </nav>
            </div>
          </header>
          
          <main className="min-h-screen">
            {children}
          </main>
          
          <footer className="bg-gray-900 text-white">
            <div className="container section-padding">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">SignLab</h3>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
