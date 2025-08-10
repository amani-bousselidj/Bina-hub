import PerformanceMonitor from '../performance'

describe('Performance utilities', () => {
  describe('PerformanceMonitor', () => {
    beforeEach(() => {
      PerformanceMonitor.clearMetrics()
    })

    it('starts and ends timers', () => {
      PerformanceMonitor.startTimer('test')
      const duration = PerformanceMonitor.endTimer('test')
      expect(duration).toBeGreaterThanOrEqual(0)
    })

    it('returns null for non-existent timers', () => {
      expect(PerformanceMonitor.endTimer('nonexistent')).toBeNull()
    })

    it('clears all metrics', () => {
      PerformanceMonitor.startTimer('test1')
      PerformanceMonitor.endTimer('test1')
      PerformanceMonitor.clearMetrics()
      expect(PerformanceMonitor.getMetrics()).toHaveLength(0)
    })

    it('calculates average time', () => {
      PerformanceMonitor.startTimer('test')
      PerformanceMonitor.endTimer('test')
      PerformanceMonitor.startTimer('test')
      PerformanceMonitor.endTimer('test')
      
      const average = PerformanceMonitor.getAverageTime('test')
      expect(average).toBeGreaterThanOrEqual(0)
    })

    it('returns 0 average for non-existent metric', () => {
      expect(PerformanceMonitor.getAverageTime('nonexistent')).toBe(0)
    })
  })
})


