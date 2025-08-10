export type CurrencyCode = string;

export interface FormatCurrencyOptions {
  currency?: CurrencyCode;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCurrency(
  amount: number | string,
  opts: FormatCurrencyOptions = {}
): string {
  const value = typeof amount === 'string' ? Number(amount) : amount;
  if (!isFinite(value as number)) return String(amount);

  // Detect defaults from document language (ar => SAR/ar-SA, else USD/en-US)
  const docLang = typeof document !== 'undefined' ? document.documentElement.getAttribute('lang') || 'en' : 'en';
  const isArabic = (opts.locale || docLang).startsWith('ar');

  const locale = opts.locale || (isArabic ? 'ar-SA' : 'en-US');
  const currency = opts.currency || (isArabic ? 'SAR' : 'USD');

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: opts.minimumFractionDigits ?? 0,
    maximumFractionDigits: opts.maximumFractionDigits ?? 2,
  }).format(value as number);
}
