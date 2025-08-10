// @ts-nocheck
// Advanced Analytics Dashboard Entry Point
// TODO: Implement advanced analytics features for Phase 4

import React, { useEffect, useState } from 'react';
import { devices, getOnlineDevices, ingestDeviceData } from '../iot/deviceManager';

const kpiData = [
  { label: 'Total Sales', value: '$1,250,000' },
  { label: 'Active Users', value: '8,420' },
  { label: 'Conversion Rate', value: '4.7%' },
];

const chartData = [
  { label: 'Jan', value: 120 },
  { label: 'Feb', value: 180 },
  { label: 'Mar', value: 150 },
  { label: 'Apr', value: 210 },
  { label: 'May', value: 170 },
  { label: 'Jun', value: 250 },
];

// Add types for chart data
interface ChartItem {
  label: string;
  value: number;
}

const getForecast = (data: ChartItem[]): number => {
  // Simple forecast: average of last 3 months + 10%
  const last3 = data.slice(-3).map((d) => d.value);
  const avg = last3.reduce((a: number, b: number) => a + b, 0) / last3.length;
  return Math.round(avg * 1.1);
};

const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(window.navigator.userAgent);

// Example: Custom Product Performance Widget
const productPerformance = [
  { name: 'Product A', sales: 320 },
  { name: 'Product B', sales: 210 },
  { name: 'Product C', sales: 150 },
];

const CustomProductWidget: React.FC = () => (
  <div style={{ marginTop: 16 }}>
    <h3 style={{ marginBottom: 8 }}>Top Product Performance</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6 }}>
      <thead>
        <tr style={{ background: '#f3f4f6' }}>
          <th style={{ textAlign: 'left', padding: 8 }}>Product</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Sales</th>
        </tr>
      </thead>
      <tbody>
        {productPerformance.map((prod) => (
          <tr key={prod.name}>
            <td style={{ padding: 8 }}>{prod.name}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{prod.sales}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Example: Real-time IoT Device Data Simulation
import { useEffect, useState } from 'react';

type DeviceWithTemp = typeof devices[number] & { temp: number };

const useSimulatedDeviceData = () => {
  const [deviceData, setDeviceData] = useState<DeviceWithTemp[]>(() => devices.map(d => ({ ...d, temp: Math.round(20 + Math.random() * 10) })));
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceData(prev => prev.map(d => ({ ...d, temp: d.status === 'online' ? Math.round(20 + Math.random() * 10) : 0 })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return deviceData;
};

const IoTLiveWidget: React.FC = () => {
  const [alerts, setAlerts] = useState<string[]>([]);
  const deviceData = useSimulatedDeviceData();

  useEffect(() => {
    // Simulate backend ingestion and alerting
    deviceData.forEach((dev) => {
      if (dev.status === 'online') {
        const alert = ingestDeviceData(dev.id, dev.temp);
        if (alert && !alerts.includes(alert)) {
          setAlerts((prev: any) => [...prev, alert]);
        }
      }
    });
    // eslint-disable-next-line
  }, [deviceData]);

  return (
    <div style={{ marginTop: 16 }}>
      <h3 style={{ marginBottom: 8 }}>Live IoT Device Data</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Device</th>
            <th style={{ textAlign: 'center', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'right', padding: 8 }}>Temperature (°C)</th>
          </tr>
        </thead>
        <tbody>
          {deviceData.map((dev) => (
            <tr key={dev.id}>
              <td style={{ padding: 8 }}>{dev.name}</td>
              <td style={{ padding: 8, textAlign: 'center', color: dev.status === 'online' ? '#16a34a' : '#dc2626' }}>{dev.status}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{dev.status === 'online' ? dev.temp : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {alerts.length > 0 && (
        <div style={{ marginTop: 16, background: '#fef2f2', color: '#b91c1c', padding: 12, borderRadius: 6 }}>
          <b>Alerts:</b>
          <ul>
            {alerts.map((alert, idx) => (
              <li key={idx}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// src/analytics/index.tsx
// Add advanced analytics: cohort analysis widget
const cohortData = [
  { cohort: 'Jan 2025', users: 1200, retained: 900 },
  { cohort: 'Feb 2025', users: 1100, retained: 800 },
  { cohort: 'Mar 2025', users: 1300, retained: 950 },
];

const CohortAnalysisWidget: React.FC = () => (
  <div style={{ marginTop: 16 }}>
    <h3 style={{ marginBottom: 8 }}>User Cohort Retention</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 6 }}>
      <thead>
        <tr style={{ background: '#f3f4f6' }}>
          <th style={{ textAlign: 'left', padding: 8 }}>Cohort</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Users</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Retained</th>
          <th style={{ textAlign: 'right', padding: 8 }}>Retention %</th>
        </tr>
      </thead>
      <tbody>
        {cohortData.map((row) => (
          <tr key={row.cohort}>
            <td style={{ padding: 8 }}>{row.cohort}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{row.users}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{row.retained}</td>
            <td style={{ padding: 8, textAlign: 'right' }}>{((row.retained / row.users) * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const forecast = getForecast(chartData);
  const onlineDevices = getOnlineDevices();
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Advanced Analytics Dashboard (Phase 4)</h1>
      {isMobile && (
        <div style={{ background: '#fef9c3', color: '#92400e', padding: 12, borderRadius: 6, marginBottom: 24 }}>
          <b>Mobile Mode:</b> This dashboard is mobile-ready. (Simulated)
        </div>
      )}
      <div style={{ display: 'flex', gap: 24, margin: '32px 0' }}>
        {kpiData.map((kpi, idx) => (
          <div key={kpi.label} style={{ background: '#f3f4f6', borderRadius: 8, padding: 24, minWidth: 180, boxShadow: '0 2px 8px #0001', position: 'relative' }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{kpi.value}</div>
            <div style={{ color: '#555', marginTop: 8 }}>{kpi.label}</div>
            {/* Trend arrow for demo */}
            <span style={{ position: 'absolute', top: 16, right: 16, color: idx === 2 ? '#eab308' : '#22c55e', fontSize: 20 }}>
              {idx === 2 ? '→' : '↑'}
            </span>
          </div>
        ))}
      </div>
      <h2>Monthly Sales Overview</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 180, gap: 16, marginTop: 24, background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px #0001' }}>
        {chartData.map((item) => (
          <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#2563eb', width: 32, height: item.value, borderRadius: 4, marginBottom: 8, transition: 'height 0.3s' }}></div>
            <span style={{ fontSize: 14, color: '#555' }}>{item.label}</span>
          </div>
        ))}
        {/* Forecast bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#10b981', width: 32, height: forecast, borderRadius: 4, marginBottom: 8, opacity: 0.7, border: '2px dashed #10b981' }}></div>
          <span style={{ fontSize: 14, color: '#10b981' }}>Forecast</span>
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>IoT Device Status</h2>
        <div style={{ background: '#f1f5f9', borderRadius: 8, padding: 24, minHeight: 80, color: '#222' }}>
          <b>Online Devices:</b>
          <ul>
            {onlineDevices.map((dev) => (
              <li key={dev.id}>{dev.name} (Last seen: {dev.lastSeen.toLocaleTimeString()})</li>
            ))}
          </ul>
          <b>All Devices:</b>
          <ul>
            {devices.map((dev) => (
              <li key={dev.id}>{dev.name} - <span style={{ color: dev.status === 'online' ? '#16a34a' : '#dc2626' }}>{dev.status}</span></li>
            ))}
          </ul>
          <IoTLiveWidget />
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        <h2>Custom Dashboard Widgets</h2>
        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 24, minHeight: 80, color: '#222' }}>
          <CustomProductWidget />
          <CohortAnalysisWidget />
        </div>
      </div>
      <p style={{ marginTop: 32, color: '#888' }}>
        This dashboard now includes KPIs, a sales chart, predictive analytics, IoT device status, and a custom widget area. Expand further for full business intelligence.
      </p>
    </div>
  );
};

export default AnalyticsDashboard;




