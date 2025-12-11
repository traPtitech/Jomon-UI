import { expect, test } from '@playwright/test'

test.describe('SearchSelect E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => {
      const text = msg.text()
      if (
        text.includes('[MSW]') ||
        text.includes('[vite]') ||
        text.includes('<Suspense>') ||
        text.startsWith('Request {') ||
        text.startsWith('Handler:') ||
        text.startsWith('Response {') ||
        text === 'console.groupEnd' ||
        text.includes('Documentation:') ||
        text.includes('mswjs.io/docs') ||
        text.includes('Found an issue?') ||
        text.includes('Worker script URL:') ||
        text.includes('Worker scope:') ||
        text.includes('Client ID:')
      )
        return
      console.log(`BROWSER LOG: ${text}`)
    })
    page.on('pageerror', err => {
      console.log(`BROWSER ERROR: ${err.message}`)
    })
    await page.goto('/applications/new')
  })

  test('Clicking input opens dropdown', async ({ page }) => {
    const input = page.getByRole('combobox', { name: 'パーティション' })
    await expect(page.getByRole('listbox')).toBeHidden()
    await input.click()
    // It should open
    await expect(page.getByRole('listbox')).toBeVisible()
    // Blur to close (if configured?) or just check it opened.
  })

  test('Single Select (Partition) filters and selects option', async ({
    page,
  }) => {
    const input = page.getByRole('combobox', { name: 'パーティション' })
    await expect(input).toBeVisible()

    // Open and filter
    await input.click()
    await input.fill('テスト')
    // Wait for filter
    const option = page
      .getByRole('option', { name: 'テストパーティション(指定なし) 0' })
      .first()
    await expect(option).toBeVisible()
    // Use force click to ensure it registers
    await option.click({ force: true })

    // Verify dropdown closes
    await expect(page.getByRole('listbox')).toBeHidden()

    // Check value
    await expect(input).toHaveValue('テストパーティション(指定なし) 0')

    // Since we selected a value, modelValue should update.
    // In this specific component implementation, the input display value updates too.
  })

  test('Multi Select (Tags) selects and removes items', async ({ page }) => {
    const input = page.getByRole('combobox', { name: 'タグ' })
    await expect(input).toBeVisible()

    // Select multiple options
    // Type to open and filter
    await input.click()
    await input.fill('2021')
    await page
      .getByRole('option', { name: '2021講習会' })
      .click({ force: true })

    // Type again for second item (since query might be cleared or persisted)
    // Multi select usually clears query on select if configured.
    await input.fill('2022')
    await page
      .getByRole('option', { name: '2022講習会' })
      .click({ force: true })

    // Check tags are rendered
    // Check tags are rendered
    await expect(
      page.getByLabel('Selection').getByText('2021講習会')
    ).toBeVisible()
    await expect(
      page.getByLabel('Selection').getByText('2022講習会')
    ).toBeVisible()

    // Remove one item
    // A better selector for the remove button of '2021講習会'
    const tag2021 = page
      .locator('div[role="group"] > div')
      .filter({ hasText: '2021講習会' })
    const remove2021 = tag2021.locator('button')
    await remove2021.click({ force: true })

    await expect(
      page.getByLabel('Selection').getByText('2021講習会')
    ).toBeHidden()
    await expect(
      page.getByLabel('Selection').getByText('2022講習会')
    ).toBeVisible()
  })

  test('Single Select (Partition) re-opens dropdown on input click', async ({
    page,
  }) => {
    const input = page.getByRole('combobox', { name: 'パーティション' })
    // Click to open
    await input.click()
    await expect(page.getByRole('listbox')).toBeVisible()

    // Select option to close
    const optionName = 'テストパーティション(指定なし) 0'
    const option = page.getByRole('option', { name: optionName }).first()
    await option.click({ force: true })
    await expect(page.getByRole('listbox')).toBeHidden()

    // Click input again -> should open
    await input.click()
    await expect(page.getByRole('listbox')).toBeVisible()
  })
})
