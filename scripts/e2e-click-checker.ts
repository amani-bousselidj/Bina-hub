import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';
const ROUTES = (process.env.E2E_ROUTES || '/,/marketplace,/user,/user/projects,/user/projects/create,/user/expenses').split(',');

async function clickAll(page: Page) {
  const selectors = ['button', 'a[role="button"]', '[data-test="btn"]'];
  for (const sel of selectors) {
    const els = await page.$$(sel);
    for (const el of els) {
      try {
        const box = await el.boundingBox();
        if (!box) continue;
        await el.click();
        await page.evaluate(() => new Promise(res => setTimeout(res, 50)));
      } catch {}
    }
  }
}

async function main() {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page: Page = await browser.newPage();
  page.setDefaultTimeout(15000);
  const results: Record<string, string> = {};

  for (const r of ROUTES) {
    const url = `${BASE}${r}`;
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await clickAll(page);
      results[r] = 'OK';
    } catch (e: any) {
      results[r] = `FAIL: ${e?.message || 'unknown'}`;
    }
  }

  await browser.close();
  // eslint-disable-next-line no-console
  console.log('Click check results:', results);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
