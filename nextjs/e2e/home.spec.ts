import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test('should display the welcome heading', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /welcome to example for react design patterns/i }),
    ).toBeVisible()
  })

  test('should list all design pattern links', async ({ page }) => {
    await page.goto('/')

    const links = page.getByRole('link')
    await expect(links).toHaveCount(7)
  })

  test('should navigate to the lorem pages from the home link', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /lorem ipsum pages/i }).click()

    await expect(page).toHaveURL('/lorem/about')
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible()
  })
})
