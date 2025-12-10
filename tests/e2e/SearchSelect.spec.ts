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

  test('Focusing input opens dropdown', async ({ page }) => {
    const input = page.getByLabel('パーティション')
    await expect(page.getByRole('listbox')).toBeHidden()
    await input.focus()
    // It should open
    await expect(page.getByRole('listbox')).toBeVisible()
    // Blur to close (if configured?) or just check it opened.
  })

  test('Single Select (Partition) filters and selects option', async ({
    page,
  }) => {
    const input = page.getByLabel('パーティション')
    await expect(input).toBeVisible()

    // Open and filter
    await input.click()
    await input.fill('テスト')

    // Select option
    const optionName = 'テストパーティション(指定なし) 0'
    const option = page.getByRole('option', { name: optionName }).first()
    await expect(option).toBeVisible()
    // Use force click to ensure it registers
    await option.click({ force: true })

    // Verify dropdown closes
    await expect(page.getByRole('listbox')).toBeHidden()

    // Verify selection
    await expect(input).toHaveValue(optionName)
  })

  test('Multi Select (Tags) selects and removes items', async ({ page }) => {
    const input = page.getByLabel('タグ')
    await expect(input).toBeVisible()

    // Select multiple options
    // Type to open and filter
    await input.click()
    await input.fill('2021')
    await page.getByRole('option', { name: '2021講習会' }).click()

    // Type again for second item (since query might be cleared or persisted)
    // Multi select usually clears query on select if configured.
    // SearchMultiSelect.vue has query = '' in handleUpdate if resetOnClose (default true).
    await input.fill('2022')
    await page.getByRole('option', { name: '2022講習会' }).click()

    // Press escape to close dropdown to clearly see chips if they are overlapped by dropdown (though dropdown usually below)
    await page.keyboard.press('Escape')

    // Verify chips are displayed
    await expect(
      page.getByRole('button', { name: '2021講習会 を削除' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: '2022講習会 を削除' })
    ).toBeVisible()

    // Remove one item
    await page.getByRole('button', { name: '2021講習会 を削除' }).click()

    // Verify removal
    await expect(
      page.getByRole('button', { name: '2021講習会 を削除' })
    ).not.toBeVisible()
    await expect(
      page.getByRole('button', { name: '2022講習会 を削除' })
    ).toBeVisible()
  })

  test('Single Select (Partition) re-opens dropdown on input click', async ({
    page,
  }) => {
    const input = page.getByLabel('パーティション')
    // Click to open
    await input.click()
    await expect(page.getByRole('listbox')).toBeVisible()

    // Select option to close
    const optionName = 'テストパーティション(指定なし) 0'
    const option = page.getByRole('option', { name: optionName }).first()
    await option.click({ force: true })
    await expect(page.getByRole('listbox')).toBeHidden()

    // Click again to re-open
    await input.click()
    await expect(page.getByRole('listbox')).toBeVisible()
  })
})
