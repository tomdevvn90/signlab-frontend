import { getPages, getPosts } from '../lib/api'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://signlab.com.au'

export default async function sitemap() {
  const entries = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Fetch all pages from WordPress
  const { data: pages } = await getPages(100, 1)
  if (pages && Array.isArray(pages)) {
    pages.forEach((page) => {
      if (page.slug === 'home') return
      entries.push({
        url: `${SITE_URL}/${page.slug}`,
        lastModified: new Date(page.modified),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    })
  }

  // Fetch all blog posts
  const { data: posts } = await getPosts(100, 1)
  if (posts && Array.isArray(posts)) {
    posts.forEach((post) => {
      entries.push({
        url: `${SITE_URL}/the-latest/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  }

  return entries
}
