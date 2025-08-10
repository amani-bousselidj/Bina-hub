// Global regions configuration
export const globalRegions = [
  {
    id: 'us',
    name: 'United States',
    currency: 'USD',
    timezone: 'America/New_York',
  },
  {
    id: 'eu',
    name: 'European Union',
    currency: 'EUR',
    timezone: 'Europe/London',
  },
  {
    id: 'asia',
    name: 'Asia Pacific',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
  },
];

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};



