import { test, expect } from '@playwright/test'

test.describe('Product category page', () => {
  test('should display the electronics category', async ({ page }) => {
    await page.goto('/products/electronics')

    await expect(page.getByRole('heading', { name: 'Electronics' })).toBeVisible()
    await expect(page.getByText('Latest gadgets, devices, and tech accessories.')).toBeVisible()
  })

  test('should render product cards', async ({ page }) => {
    await page.goto('/products/electronics')

    const cards = page.locator('[class*="rounded-lg"]').filter({ hasText: 'Add to Cart' })
    await expect(cards).toHaveCount(6)
  })

  test('should navigate between categories via pills', async ({ page }) => {
    await page.goto('/products/electronics')

    await page.getByRole('link', { name: 'Books' }).click()

    await expect(page).toHaveURL('/products/books')
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible()
  })

  test('should show breadcrumb navigation', async ({ page }) => {
    await page.goto('/products/clothing')

    await expect(page.getByRole('navigation').getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.getByText('Clothing')).toBeVisible()
  })

  test('should return 404 for unknown category', async ({ page }) => {
    const response = await page.goto('/products/unknown-category')
    expect(response?.status()).toBe(404)
  })
})
