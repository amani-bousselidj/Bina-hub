import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

describe('Project Wizard flow', () => {
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

  it('creates a minimal project via wizard', async () => {
    await page.goto(`${BASE}/user/projects/create`, { waitUntil: 'networkidle0' });

    // Basic step
    await page.type('input[placeholder="مشروع سكني في الرياض"]', 'مشروع اختبار تلقائي');
    await page.type('input[placeholder="الرياض - حي الياسمين"]', 'الرياض - النخيل');
    await page.type('textarea[placeholder="وصف المشروع ومتطلباته"]', 'هذا اختبار تلقائي لإنشاء مشروع.');
  // click Next (التالي)
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Image step
  const anyBtn = await page.$('button');
  if (anyBtn) await anyBtn.click();
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Sale step
    await page.click('#forSale');
    await page.type('input[placeholder="مثال: 1234-ABCD"]', 'TEST-1234');
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Selection step
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('إضافة عنصر وهمي')) as HTMLButtonElement | undefined;
      b?.click();
    });
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Execution step
    await page.type('input[placeholder="05xxxxxxxx"]', '0555555555');
    await page.keyboard.press('Enter');
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Report step
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Publish step -> finish
    await page.$$eval('button', (btns) => {
      const b = btns.find((el) => el.textContent?.includes('إنهاء وحفظ')) as HTMLButtonElement | undefined;
      b?.click();
    });

    // Redirect back to projects list
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    expect(page.url()).toMatch(/\/user\/projects/);
  });
});
