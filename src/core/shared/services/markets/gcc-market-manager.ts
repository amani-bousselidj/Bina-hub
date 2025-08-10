// GCC Market Manager
// Manages Gulf Cooperation Council market data, trends, and analysis

export interface GCCCountry {
  code: string;
  name: string;
  currency: string;
  capital: string;
  population: number;
  gdp: number; // in billions USD
  mainIndustries: string[];
}

export interface MarketData {
  country: string;
  sector: string;
  value: number; // in millions USD
  growth: number; // percentage
  date: Date;
  marketShare: number; // percentage of GCC total
}

export interface MarketTrend {
  sector: string;
  country: string;
  period: string;
  trend: 'bullish' | 'bearish' | 'stable';
  confidence: number; // 0-100
  factors: string[];
}

export interface EconomicIndicator {
  country: string;
  indicator: string;
  value: number;
  unit: string;
  quarter: string;
  year: number;
  comparison: {
    previousQuarter: number;
    previousYear: number;
  };
}

class GCCMarketManager {
  private readonly gccCountries: GCCCountry[] = [
    {
      code: 'SAU',
      name: 'Saudi Arabia',
      currency: 'SAR',
      capital: 'Riyadh',
      population: 35000000,
      gdp: 780,
      mainIndustries: ['Oil & Gas', 'Construction', 'Finance', 'Technology']
    },
    {
      code: 'UAE',
      name: 'United Arab Emirates',
      currency: 'AED',
      capital: 'Abu Dhabi',
      population: 10000000,
      gdp: 450,
      mainIndustries: ['Oil & Gas', 'Tourism', 'Finance', 'Real Estate']
    },
    {
      code: 'QAT',
      name: 'Qatar',
      currency: 'QAR',
      capital: 'Doha',
      population: 3000000,
      gdp: 180,
      mainIndustries: ['Oil & Gas', 'Construction', 'Finance', 'Sports']
    },
    {
      code: 'KWT',
      name: 'Kuwait',
      currency: 'KWD',
      capital: 'Kuwait City',
      population: 4500000,
      gdp: 140,
      mainIndustries: ['Oil & Gas', 'Finance', 'Real Estate']
    },
    {
      code: 'BHR',
      name: 'Bahrain',
      currency: 'BHD',
      capital: 'Manama',
      population: 1700000,
      gdp: 40,
      mainIndustries: ['Finance', 'Oil & Gas', 'Tourism', 'Manufacturing']
    },
    {
      code: 'OMN',
      name: 'Oman',
      currency: 'OMR',
      capital: 'Muscat',
      population: 5200000,
      gdp: 85,
      mainIndustries: ['Oil & Gas', 'Tourism', 'Mining', 'Agriculture']
    }
  ];

  private marketData: MarketData[] = [];
  private trends: MarketTrend[] = [];
  private economicIndicators: EconomicIndicator[] = [];

  // Country Information
  getGCCCountries(): GCCCountry[] {
    return [...this.gccCountries];
  }

  getCountryByCode(code: string): GCCCountry | null {
    return this.gccCountries.find(country => country.code === code) || null;
  }

  getCountryByName(name: string): GCCCountry | null {
    return this.gccCountries.find(country => 
      country.name.toLowerCase() === name.toLowerCase()
    ) || null;
  }

  // Market Data Management
  async addMarketData(data: MarketData): Promise<void> {
    this.marketData.push(data);
  }

  async getMarketData(filters: {
    country?: string;
    sector?: string;
    dateFrom?: Date;
    dateTo?: Date;
  } = {}): Promise<MarketData[]> {
    let filtered = [...this.marketData];

    if (filters.country) {
      filtered = filtered.filter(data => 
        data.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.sector) {
      filtered = filtered.filter(data => 
        data.sector.toLowerCase() === filters.sector!.toLowerCase()
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(data => data.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(data => data.date <= filters.dateTo!);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Market Analysis
  async getSectorAnalysis(sector: string): Promise<{
    totalValue: number;
    averageGrowth: number;
    topCountries: Array<{ country: string; value: number; share: number }>;
    trends: MarketTrend[];
  }> {
    const sectorData = await this.getMarketData({ sector });
    
    const totalValue = sectorData.reduce((sum, data) => sum + data.value, 0);
    const averageGrowth = sectorData.length > 0 
      ? sectorData.reduce((sum, data) => sum + data.growth, 0) / sectorData.length 
      : 0;

    // Group by country and calculate totals
    const countryTotals = new Map<string, number>();
    sectorData.forEach(data => {
      const current = countryTotals.get(data.country) || 0;
      countryTotals.set(data.country, current + data.value);
    });

    const topCountries = Array.from(countryTotals.entries())
      .map(([country, value]) => ({
        country,
        value,
        share: totalValue > 0 ? (value / totalValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    const trends = this.trends.filter(trend => 
      trend.sector.toLowerCase() === sector.toLowerCase()
    );

    return {
      totalValue,
      averageGrowth,
      topCountries,
      trends
    };
  }

  async getCountryAnalysis(country: string): Promise<{
    totalMarketValue: number;
    sectorBreakdown: Array<{ sector: string; value: number; share: number }>;
    economicIndicators: EconomicIndicator[];
    marketPosition: number; // Rank among GCC countries
  }> {
    const countryData = await this.getMarketData({ country });
    
    const totalMarketValue = countryData.reduce((sum, data) => sum + data.value, 0);

    // Group by sector
    const sectorTotals = new Map<string, number>();
    countryData.forEach(data => {
      const current = sectorTotals.get(data.sector) || 0;
      sectorTotals.set(data.sector, current + data.value);
    });

    const sectorBreakdown = Array.from(sectorTotals.entries())
      .map(([sector, value]) => ({
        sector,
        value,
        share: totalMarketValue > 0 ? (value / totalMarketValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    const economicIndicators = this.economicIndicators.filter(indicator =>
      indicator.country.toLowerCase() === country.toLowerCase()
    );

    // Calculate market position
    const allCountryTotals = new Map<string, number>();
    this.marketData.forEach(data => {
      const current = allCountryTotals.get(data.country) || 0;
      allCountryTotals.set(data.country, current + data.value);
    });

    const sortedCountries = Array.from(allCountryTotals.entries())
      .sort((a, b) => b[1] - a[1]);
    
    const marketPosition = sortedCountries.findIndex(([name]) => 
      name.toLowerCase() === country.toLowerCase()
    ) + 1;

    return {
      totalMarketValue,
      sectorBreakdown,
      economicIndicators,
      marketPosition
    };
  }

  // Trend Analysis
  async addTrend(trend: MarketTrend): Promise<void> {
    this.trends.push(trend);
  }

  async getTrends(filters: {
    sector?: string;
    country?: string;
    trend?: MarketTrend['trend'];
  } = {}): Promise<MarketTrend[]> {
    let filtered = [...this.trends];

    if (filters.sector) {
      filtered = filtered.filter(trend => 
        trend.sector.toLowerCase() === filters.sector!.toLowerCase()
      );
    }

    if (filters.country) {
      filtered = filtered.filter(trend => 
        trend.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.trend) {
      filtered = filtered.filter(trend => trend.trend === filters.trend);
    }

    return filtered.sort((a, b) => b.confidence - a.confidence);
  }

  // Economic Indicators
  async addEconomicIndicator(indicator: EconomicIndicator): Promise<void> {
    this.economicIndicators.push(indicator);
  }

  async getEconomicIndicators(filters: {
    country?: string;
    indicator?: string;
    year?: number;
  } = {}): Promise<EconomicIndicator[]> {
    let filtered = [...this.economicIndicators];

    if (filters.country) {
      filtered = filtered.filter(indicator => 
        indicator.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.indicator) {
      filtered = filtered.filter(indicator => 
        indicator.indicator.toLowerCase().includes(filters.indicator!.toLowerCase())
      );
    }

    if (filters.year) {
      filtered = filtered.filter(indicator => indicator.year === filters.year);
    }

    return filtered.sort((a, b) => b.year - a.year);
  }

  // Market Comparison
  async compareMarkets(countries: string[], sector?: string): Promise<{
    comparison: Array<{
      country: string;
      totalValue: number;
      growth: number;
      marketShare: number;
    }>;
    insights: string[];
  }> {
    const results: Array<{
      country: string;
      totalValue: number;
      growth: number;
      marketShare: number;
    }> = [];
    let totalGCCValue = 0;

    // Calculate total GCC value for market share calculation
    const allData = await this.getMarketData({ sector });
    totalGCCValue = allData.reduce((sum, data) => sum + data.value, 0);

    for (const country of countries) {
      const countryData = await this.getMarketData({ country, sector });
      const totalValue = countryData.reduce((sum, data) => sum + data.value, 0);
      const averageGrowth = countryData.length > 0 
        ? countryData.reduce((sum, data) => sum + data.growth, 0) / countryData.length 
        : 0;
      const marketShare = totalGCCValue > 0 ? (totalValue / totalGCCValue) * 100 : 0;

      results.push({
        country,
        totalValue,
        growth: averageGrowth,
        marketShare
      });
    }

    // Generate insights
    const insights = this.generateMarketInsights(results, sector);

    return {
      comparison: results.sort((a, b) => b.totalValue - a.totalValue),
      insights
    };
  }

  private generateMarketInsights(
    comparison: Array<{ country: string; totalValue: number; growth: number; marketShare: number }>,
    sector?: string
  ): string[] {
    const insights: string[] = [];

    if (comparison.length === 0) return insights;

    const leader = comparison[0];
    const fastest = comparison.reduce((prev, current) => 
      current.growth > prev.growth ? current : prev
    );

    insights.push(`${leader.country} leads the market with ${leader.marketShare.toFixed(1)}% market share`);

    if (fastest.country !== leader.country) {
      insights.push(`${fastest.country} shows fastest growth at ${fastest.growth.toFixed(1)}%`);
    }

    const avgGrowth = comparison.reduce((sum, c) => sum + c.growth, 0) / comparison.length;
    if (avgGrowth > 5) {
      insights.push(`Strong regional growth with average of ${avgGrowth.toFixed(1)}%`);
    }

    if (sector) {
      insights.push(`${sector} sector shows varied performance across GCC markets`);
    }

    return insights;
  }

  // Seed data for development
  async seedData(): Promise<void> {
    const currentDate = new Date();
    const sectors = ['Construction', 'Technology', 'Finance', 'Oil & Gas', 'Tourism', 'Real Estate'];

    // Generate sample market data
    for (const country of this.gccCountries) {
      for (const sector of sectors) {
        const baseValue = Math.random() * 10000 + 1000;
        const growth = (Math.random() - 0.5) * 20; // -10% to +10%
        
        await this.addMarketData({
          country: country.name,
          sector,
          value: baseValue,
          growth,
          date: currentDate,
          marketShare: Math.random() * 30 + 5 // 5% to 35%
        });
      }
    }

    // Generate sample trends
    const trendTypes: MarketTrend['trend'][] = ['bullish', 'bearish', 'stable'];
    for (let i = 0; i < 20; i++) {
      await this.addTrend({
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        country: this.gccCountries[Math.floor(Math.random() * this.gccCountries.length)].name,
        period: '2024 Q4',
        trend: trendTypes[Math.floor(Math.random() * trendTypes.length)],
        confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
        factors: ['Economic diversification', 'Government initiatives', 'Regional stability']
      });
    }

    // Generate sample economic indicators
    const indicators = ['GDP Growth', 'Inflation Rate', 'Unemployment Rate', 'Oil Production'];
    for (const country of this.gccCountries) {
      for (const indicator of indicators) {
        await this.addEconomicIndicator({
          country: country.name,
          indicator,
          value: Math.random() * 10,
          unit: indicator.includes('Rate') ? '%' : indicator.includes('GDP') ? '%' : 'Million Barrels',
          quarter: 'Q4',
          year: 2024,
          comparison: {
            previousQuarter: Math.random() * 2 - 1, // -1% to +1%
            previousYear: Math.random() * 4 - 2 // -2% to +2%
          }
        });
      }
    }
  }
}

// Export singleton instance
export const gccMarketManager = new GCCMarketManager();

// Initialize with seed data in development
if (process.env.NODE_ENV === 'development') {
  gccMarketManager.seedData().catch(console.error);
}

export default gccMarketManager;


export { GCCMarketManager };


