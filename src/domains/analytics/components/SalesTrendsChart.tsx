// @ts-nocheck
'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface SalesTrendsChartProps {
  data?: SalesData[];
}

export function SalesTrendsChart({ data }: SalesTrendsChartProps) {
  // Sample data if none provided
  const sampleData: SalesData[] = [
    { date: '1 يناير', sales: 15000, orders: 25 },
    { date: '2 يناير', sales: 22000, orders: 35 },
    { date: '3 يناير', sales: 18000, orders: 28 },
    { date: '4 يناير', sales: 28000, orders: 42 },
    { date: '5 يناير', sales: 25000, orders: 38 },
    { date: '6 يناير', sales: 32000, orders: 48 },
    { date: '7 يناير', sales: 29000, orders: 44 },
  ];

  const chartData = data || sampleData;

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => [
              `${value} ${name === 'sales' ? 'ريال' : 'طلب'}`,
              name === 'sales' ? 'المبيعات' : 'الطلبات'
            ]}
            labelStyle={{ color: '#374151' }}
            contentStyle={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}





