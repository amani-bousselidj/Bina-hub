"use client";

import React, { useState, useEffect } from 'react';

interface MarketData {
  region: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface MarketAnalyticsProps {
  className?: string;
}

const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({ className = "" }) => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for market data
    const fetchMarketData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      
      const mockData: MarketData[] = [
        { region: 'Saudi Arabia', value: 125000, change: 8.5, trend: 'up' },
        { region: 'UAE', value: 98000, change: 5.2, trend: 'up' },
        { region: 'Qatar', value: 45000, change: -2.1, trend: 'down' },
        { region: 'Kuwait', value: 38000, change: 3.7, trend: 'up' },
        { region: 'Bahrain', value: 22000, change: 0.8, trend: 'stable' },
        { region: 'Oman', value: 31000, change: 4.2, trend: 'up' }
      ];
      
      setMarketData(mockData);
      setLoading(false);
    };

    fetchMarketData();
  }, []);

  const formatValue = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTrendColor = (trend: string): string => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-6">GCC Market Analytics</h3>
      
      <div className="space-y-4">
        {marketData.map((market, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-800">{market.region}</h4>
              <p className="text-sm text-gray-600">Market Value</p>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-gray-800">
                {formatValue(market.value)}
              </p>
              <div className={`flex items-center justify-end text-sm ${getTrendColor(market.trend)}`}>
                <span className="mr-1">{getTrendIcon(market.trend)}</span>
                <span>{Math.abs(market.change).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Key Insights</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Saudi Arabia leads with highest market value</li>
          <li>• Strong growth across most GCC markets</li>
          <li>• Construction sector showing positive trends</li>
        </ul>
      </div>
    </div>
  );
};

export { MarketAnalytics };
export default MarketAnalytics;



