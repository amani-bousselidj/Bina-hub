// Qatar Market Manager
// Specific manager for Qatar market operations

export interface QatarMarketData {
  municipality: string;
  sector: string;
  value: number;
  growth: number;
  marketShare: number;
}

export interface QatarMarketTrends {
  sector: string;
  trend: 'positive' | 'negative' | 'stable';
  confidence: number;
  factors: string[];
}

class QatarMarketManager {
  private marketData: QatarMarketData[] = [];
  private trends: QatarMarketTrends[] = [];

  async getMarketData(filters?: {
    municipality?: string;
    sector?: string;
  }): Promise<QatarMarketData[]> {
    let filtered = [...this.marketData];

    if (filters?.municipality) {
      filtered = filtered.filter(data => 
        data.municipality.toLowerCase() === filters.municipality!.toLowerCase()
      );
    }

    if (filters?.sector) {
      filtered = filtered.filter(data => 
        data.sector.toLowerCase() === filters.sector!.toLowerCase()
      );
    }

    return filtered;
  }

  async addMarketData(data: QatarMarketData): Promise<void> {
    this.marketData.push(data);
  }

  async getMarketTrends(sector?: string): Promise<QatarMarketTrends[]> {
    if (sector) {
      return this.trends.filter(trend => 
        trend.sector.toLowerCase() === sector.toLowerCase()
      );
    }
    return [...this.trends];
  }

  async addTrend(trend: QatarMarketTrends): Promise<void> {
    this.trends.push(trend);
  }

  async getMunicipalityAnalysis(municipality: string): Promise<{
    totalValue: number;
    sectorBreakdown: Array<{ sector: string; value: number; share: number }>;
    topSectors: string[];
  }> {
    const municipalityData = await this.getMarketData({ municipality });
    const totalValue = municipalityData.reduce((sum, data) => sum + data.value, 0);

    const sectorTotals = new Map<string, number>();
    municipalityData.forEach(data => {
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
    const municipalities = ['Doha', 'Al Rayyan', 'Al Wakrah', 'Al Khor', 'Al Shamal', 'Al Daayen', 'Umm Salal', 'Al Shahaniya'];
    const sectors = ['Oil & Gas', 'Finance', 'Construction', 'Sports', 'Tourism', 'Technology', 'Healthcare'];

    for (const municipality of municipalities) {
      for (const sector of sectors) {
        await this.addMarketData({
          municipality,
          sector,
          value: Math.random() * 4000 + 800,
          growth: (Math.random() - 0.5) * 18,
          marketShare: Math.random() * 25 + 8
        });
      }
    }

    for (const sector of sectors) {
      await this.addTrend({
        sector,
        trend: ['positive', 'negative', 'stable'][Math.floor(Math.random() * 3)] as any,
        confidence: Math.random() * 40 + 60,
        factors: ['FIFA World Cup legacy', 'Vision 2030', 'Energy transition']
      });
    }
  }
}

export const qatarMarketManager = new QatarMarketManager();

if (process.env.NODE_ENV === 'development') {
  qatarMarketManager.seedData().catch(console.error);
}

export { QatarMarketManager };
export default qatarMarketManager;


