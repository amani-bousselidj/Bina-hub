// UAE Market Manager
// Specific manager for United Arab Emirates market operations

export interface UAEMarketData {
  emirate: string;
  sector: string;
  value: number;
  growth: number;
  marketShare: number;
}

export interface UAEMarketTrends {
  sector: string;
  trend: 'positive' | 'negative' | 'stable';
  confidence: number;
  factors: string[];
}

class UAEMarketManager {
  private marketData: UAEMarketData[] = [];
  private trends: UAEMarketTrends[] = [];

  async getMarketData(filters?: {
    emirate?: string;
    sector?: string;
  }): Promise<UAEMarketData[]> {
    let filtered = [...this.marketData];

    if (filters?.emirate) {
      filtered = filtered.filter(data => 
        data.emirate.toLowerCase() === filters.emirate!.toLowerCase()
      );
    }

    if (filters?.sector) {
      filtered = filtered.filter(data => 
        data.sector.toLowerCase() === filters.sector!.toLowerCase()
      );
    }

    return filtered;
  }

  async addMarketData(data: UAEMarketData): Promise<void> {
    this.marketData.push(data);
  }

  async getMarketTrends(sector?: string): Promise<UAEMarketTrends[]> {
    if (sector) {
      return this.trends.filter(trend => 
        trend.sector.toLowerCase() === sector.toLowerCase()
      );
    }
    return [...this.trends];
  }

  async addTrend(trend: UAEMarketTrends): Promise<void> {
    this.trends.push(trend);
  }

  async getEmirateAnalysis(emirate: string): Promise<{
    totalValue: number;
    sectorBreakdown: Array<{ sector: string; value: number; share: number }>;
    topSectors: string[];
  }> {
    const emirateData = await this.getMarketData({ emirate });
    const totalValue = emirateData.reduce((sum, data) => sum + data.value, 0);

    const sectorTotals = new Map<string, number>();
    emirateData.forEach(data => {
      const current = sectorTotals.get(data.sector) || 0;
      sectorTotals.set(data.sector, current + data.value);
    });

    const sectorBreakdown = Array.from(sectorTotals.entries())
      .map(([sector, value]) => ({
        sector,
        value,
        share: totalValue > 0 ? (value / totalValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    const topSectors = sectorBreakdown.slice(0, 5).map(item => item.sector);

    return {
      totalValue,
      sectorBreakdown,
      topSectors
    };
  }

  async seedData(): Promise<void> {
    const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];
    const sectors = ['Tourism', 'Real Estate', 'Finance', 'Oil & Gas', 'Technology', 'Retail'];

    for (const emirate of emirates) {
      for (const sector of sectors) {
        await this.addMarketData({
          emirate,
          sector,
          value: Math.random() * 5000 + 1000,
          growth: (Math.random() - 0.5) * 20,
          marketShare: Math.random() * 25 + 5
        });
      }
    }

    for (const sector of sectors) {
      await this.addTrend({
        sector,
        trend: ['positive', 'negative', 'stable'][Math.floor(Math.random() * 3)] as any,
        confidence: Math.random() * 40 + 60,
        factors: ['Government initiatives', 'International investment', 'Economic diversification']
      });
    }
  }
}

export const uaeMarketManager = new UAEMarketManager();

if (process.env.NODE_ENV === 'development') {
  uaeMarketManager.seedData().catch(console.error);
}

export { UAEMarketManager };
export default uaeMarketManager;


