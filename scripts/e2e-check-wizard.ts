import puppeteer, { Browser, Page } from 'puppeteer';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3000';

async function run() {
  const browser: Browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page: Page = await browser.newPage();
  page.setDefaultTimeout(20000);

  await page.goto(`${BASE}/user/projects/create`, { waitUntil: 'domcontentloaded' });

  // Basic step
  await page.type('input[placeholder="مشروع سكني في الرياض"]', 'مشروع اختبار تلقائي');
  await page.type('input[placeholder="الرياض - حي الياسمين"]', 'الرياض - النخيل');
  await page.type('textarea[placeholder="وصف المشروع ومتطلباته"]', 'هذا اختبار تلقائي لإنشاء مشروع.');
  await page.$$eval('button', (btns) => {
    const b = btns.find((el) => el.textContent?.includes('التالي')) as HTMLButtonElement | undefined;
    b?.click();
  });

  // Image step (toggle default image selection)
  await page.$$eval('button', (btns) => {
    const b = btns.find((el) => el.textContent?.includes('تحديد صورة')) as HTMLButtonElement | undefined;
    (b || (btns[0] as HTMLButtonElement | undefined))?.click();
  });
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

  // Give it a moment for navigation
  await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
  // eslint-disable-next-line no-console
  console.log('Wizard flow completed. Current URL:', page.url());

  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
