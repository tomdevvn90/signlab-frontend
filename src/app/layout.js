import { Montserrat } from "next/font/google";
import '../styles/globals.scss'
import Header from '../components/Header'
import { getPageBySlug, getPages } from '../lib/api'

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

// Function to get header data from theme_options embedded in page responses
async function getHeaderData() {
  try {
    // Prefer a known slug, then fallback to the first available page
    let themeOptions = null;

    try {
      const { data: homePages } = await getPageBySlug('home-page');
      if (Array.isArray(homePages) && homePages[0]?.theme_options) {
        themeOptions = homePages[0].theme_options;
      }
    } catch {}

    if (!themeOptions) {
      const { data: pages } = await getPages();
      if (Array.isArray(pages) && pages[0]?.theme_options) {
        themeOptions = pages[0].theme_options;
      }
    }

    if (!themeOptions) {
      return { logo: null, menu: null };
    }

    // header_logo is a URL string per new contract
    const logoData = themeOptions.header_logo || null;
    const menuData = themeOptions.main_menu || null;

    return { logo: logoData, menu: menuData };
  } catch (error) {
    console.error('Error in getHeaderData:', error);
    return { logo: null, menu: null };
  }
}

export default async function RootLayout({ children }) {
  const { logo, menu } = await getHeaderData();  

  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">
          <Header logoData={logo} menuData={menu} />
          
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
