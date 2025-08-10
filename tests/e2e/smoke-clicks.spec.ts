import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

const PATHS: string[] = [
  '/',
  '/marketplace',
  '/user',
  '/user/projects',
  '/user/projects/create',
  '/user/expenses',
];

async function clickAllVisibleButtons(page: Page) {
  const buttons = await page.$$('button, a[role="button"], [data-test="btn"]');
  for (const el of buttons) {
    try {
      const box = await el.boundingBox();
      if (!box) continue;
      await el.click({ delay: 10 });
  await page.evaluate(() => new Promise(res => setTimeout(res, 100)));
    } catch {}
  }
}

describe('Smoke clicks across key pages', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
  browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    page = await browser.newPage();
    page.setDefaultTimeout(15000);
  });

  afterAll(async () => {
    await browser.close();
  });

  for (const p of PATHS) {
    it(`visits ${p} and clicks buttons`, async () => {
      await page.goto(`${BASE}${p}`, { waitUntil: 'networkidle0' });
      await clickAllVisibleButtons(page);
      // basic assertion: page is still responsive
      const title = await page.title();
      expect(title).toBeDefined();
    });
  }
});
