import React from 'react';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private static metrics: PerformanceMetric[] = [];
  private static timers: Map<string, number> = new Map();

  static startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  static endTimer(name: string): number | null {
    const startTime = this.timers.get(name);
    if (!startTime) return null;

    const duration = performance.now() - startTime;
    this.timers.delete(name);
    
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    });

    return duration;
  }

  static getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  static clearMetrics(): void {
    this.metrics = [];
  }

  static getAverageTime(name: string): number {
    const nameMetrics = this.metrics.filter(m => m.name === name);
    if (nameMetrics.length === 0) return 0;
    
    const total = nameMetrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / nameMetrics.length;
  }
}

// React hook for performance monitoring
export function usePerformanceTimer(name: string) {
  const start = () => PerformanceMonitor.startTimer(name);
  const end = () => PerformanceMonitor.endTimer(name);
  
  return { start, end };
}

export default PerformanceMonitor;


