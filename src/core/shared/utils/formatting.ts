/**
 * Number and Date Formatting Utilities
 * Ensures consistent English numerals and Georgian calendar dates
 */

// Format numbers with English numerals and commas
export const formatNumber = (num: number | string, options: Intl.NumberFormatOptions = {}): string => {
  const numericValue = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(numericValue)) {
    return '0';
  }
  
  // Always use English locale to ensure English numerals
  return numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  });
};

// Format currency with English numerals
export const formatCurrency = (amount: number | string, currency: string = 'SAR'): string => {
  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericValue)) {
    return '0 ر.س';
  }
  
  const formatted = formatNumber(numericValue);
  
  switch (currency.toLowerCase()) {
    case 'sar':
    case 'riyal':
      return `${formatted} ر.س`;
    case 'usd':
    case 'dollar':
      return `$${formatted}`;
    case 'eur':
    case 'euro':
      return `€${formatted}`;
    default:
      return `${formatted} ${currency}`;
  }
};

// Format percentage with English numerals
export const formatPercentage = (value: number | string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '0%';
  }
  
  return `${formatNumber(numericValue)}%`;
};

// Format dates using Georgian calendar with English numerals
export const formatDate = (date: string | Date | null | undefined, options: Intl.DateTimeFormatOptions = {}): string => {
  if (!date) {
    return '';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // Default format: MM/DD/YYYY
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  };
  
  // Use English locale for Georgian calendar with English numerals
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

// Format date and time with English numerals
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) {
    return '';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format phone numbers with English numerals
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) {
    return '';
  }
  
  // Remove any non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Saudi phone number format: +966 50 123 4567
  if (cleaned.startsWith('+966')) {
    const number = cleaned.substring(4);
    if (number.length === 9) {
      return `+966 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`;
    }
  }
  
  return cleaned;
};

// Convert Arabic numerals to English numerals
export const arabicToEnglishNumerals = (text: string): string => {
  const arabicNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const englishNumerals = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  let result = text;
  arabicNumerals.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), englishNumerals[index]);
  });
  
  return result;
};

// Format large numbers with appropriate suffixes (K, M, B)
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return `${formatNumber(num / 1000000000)}B`;
  }
  if (num >= 1000000) {
    return `${formatNumber(num / 1000000)}M`;
  }
  if (num >= 1000) {
    return `${formatNumber(num / 1000)}K`;
  }
  return formatNumber(num);
};

// Format area measurements
export const formatArea = (area: number | string, unit: string = 'sqm'): string => {
  const numericValue = typeof area === 'string' ? parseFloat(area) : area;
  
  if (isNaN(numericValue)) {
    return '0 متر مربع';
  }
  
  const formatted = formatNumber(numericValue);
  
  switch (unit.toLowerCase()) {
    case 'sqm':
    case 'متر مربع':
      return `${formatted} متر مربع`;
    case 'sqft':
    case 'قدم مربع':
      return `${formatted} قدم مربع`;
    default:
      return `${formatted} ${unit}`;
  }
};

// Format construction measurements
export const formatMeasurement = (value: number | string, unit: string): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return `0 ${unit}`;
  }
  
  return `${formatNumber(numericValue)} ${unit}`;
};

// Format loyalty points with English numerals
export const formatLoyaltyPoints = (points: number | string): string => {
  const numericValue = typeof points === 'string' ? parseFloat(points) : points;
  
  if (isNaN(numericValue)) {
    return '0';
  }
  
  return formatNumber(numericValue);
};

// Format any text to ensure English numerals
export const ensureEnglishNumerals = (text: string | number): string => {
  if (typeof text === 'number') {
    return formatNumber(text);
  }
  
  return arabicToEnglishNumerals(text);
};


