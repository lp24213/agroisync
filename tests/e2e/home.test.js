const puppeteer = require('puppeteer')

test('Homepage load', async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000')
  const title = await page.title()
  expect(title).toMatch(/AGROTM/i)
  await browser.close()
})