// Kuwait Market Manager
// Specific manager for Kuwait market operations

export interface KuwaitMarketData {
  governorate: string;
  sector: string;
  value: number;
  growth: number;
  marketShare: number;
}

export interface KuwaitMarketTrends {
  sector: string;
  trend: 'positive' | 'negative' | 'stable';
  confidence: number;
  factors: string[];
}

class KuwaitMarketManager {
  private marketData: KuwaitMarketData[] = [];
  private trends: KuwaitMarketTrends[] = [];

  async getMarketData(filters?: {
    governorate?: string;
    sector?: string;
  }): Promise<KuwaitMarketData[]> {
    let filtered = [...this.marketData];

    if (filters?.governorate) {
      filtered = filtered.filter(data => 
        data.governorate.toLowerCase() === filters.governorate!.toLowerCase()
      );
    }

    if (filters?.sector) {
      filtered = filtered.filter(data => 
        data.sector.toLowerCase() === filters.sector!.toLowerCase()
      );
    }

    return filtered;
  }

  async addMarketData(data: KuwaitMarketData): Promise<void> {
    this.marketData.push(data);
  }

  async getMarketTrends(sector?: string): Promise<KuwaitMarketTrends[]> {
    if (sector) {
      return this.trends.filter(trend => 
        trend.sector.toLowerCase() === sector.toLowerCase()
      );
    }
    return [...this.trends];
  }

  async addTrend(trend: KuwaitMarketTrends): Promise<void> {
    this.trends.push(trend);
  }

  async getGovernorateAnalysis(governorate: string): Promise<{
    totalValue: number;
    sectorBreakdown: Array<{ sector: string; value: number; share: number }>;
    topSectors: string[];
  }> {
    const governorateData = await this.getMarketData({ governorate });
    const totalValue = governorateData.reduce((sum, data) => sum + data.value, 0);

    const sectorTotals = new Map<string, number>();
    governorateData.forEach(data => {
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
    const governorates = ['Capital', 'Hawalli', 'Farwaniya', 'Mubarak Al-Kabeer', 'Ahmadi', 'Jahra'];
    const sectors = ['Oil & Gas', 'Finance', 'Real Estate', 'Retail', 'Technology', 'Healthcare'];

    for (const governorate of governorates) {
      for (const sector of sectors) {
        await this.addMarketData({
          governorate,
          sector,
          value: Math.random() * 3000 + 500,
          growth: (Math.random() - 0.5) * 15,
          marketShare: Math.random() * 30 + 10
        });
      }
    }

    for (const sector of sectors) {
      await this.addTrend({
        sector,
        trend: ['positive', 'negative', 'stable'][Math.floor(Math.random() * 3)] as any,
        confidence: Math.random() * 40 + 60,
        factors: ['Oil price stability', 'Government reforms', 'Regional cooperation']
      });
    }
  }
}

export const kuwaitMarketManager = new KuwaitMarketManager();

if (process.env.NODE_ENV === 'development') {
  kuwaitMarketManager.seedData().catch(console.error);
}

export { KuwaitMarketManager };
export default kuwaitMarketManager;


