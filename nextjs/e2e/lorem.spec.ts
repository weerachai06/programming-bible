import { test, expect } from '@playwright/test'

const LOREM_PAGES = [
  { slug: 'about', heading: 'About Us' },
  { slug: 'blog', heading: 'Blog' },
  { slug: 'contact', heading: 'Contact Us' },
  { slug: 'faq', heading: 'Frequently Asked Questions' },
  { slug: 'pricing', heading: 'Pricing' },
  { slug: 'services', heading: 'Services' },
  { slug: 'team', heading: 'Our Team' },
  { slug: 'terms', heading: 'Terms of Service' },
  { slug: 'privacy', heading: 'Privacy Policy' },
  { slug: 'careers', heading: 'Careers' },
]

test.describe('Lorem pages', () => {
  for (const { slug, heading } of LOREM_PAGES) {
    test(`/lorem/${slug} should render the correct heading`, async ({ page }) => {
      await page.goto(`/lorem/${slug}`)

      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible()
    })
  }

  test('shared nav should be visible on all lorem pages', async ({ page }) => {
    await page.goto('/lorem/about')

    const nav = page.getByRole('navigation')
    await expect(nav.getByRole('link', { name: '← Home' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Blog' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Pricing' })).toBeVisible()
  })

  test('should navigate between lorem pages via the nav bar', async ({ page }) => {
    await page.goto('/lorem/about')

    await page.getByRole('navigation').getByRole('link', { name: 'Careers' }).click()

    await expect(page).toHaveURL('/lorem/careers')
    await expect(page.getByRole('heading', { name: 'Careers', level: 1 })).toBeVisible()
  })

  test('nav Home link should return to the root page', async ({ page }) => {
    await page.goto('/lorem/pricing')

    await page.getByRole('navigation').getByRole('link', { name: '← Home' }).click()

    await expect(page).toHaveURL('/')
  })
})
