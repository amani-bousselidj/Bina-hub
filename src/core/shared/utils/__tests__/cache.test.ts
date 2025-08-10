import CacheManager from '../cache'

describe('CacheManager', () => {
  let cache: CacheManager

  beforeEach(() => {
    cache = new CacheManager()
  })

  afterEach(() => {
    cache.clear()
  })

  it('stores and retrieves values', () => {
    cache.set('key1', 'value1')
    expect(cache.get('key1')).toBe('value1')
  })

  it('respects TTL expiration', (done) => {
    cache.set('key1', 'value1', 100) // 100ms TTL
    
    expect(cache.get('key1')).toBe('value1')
    
    setTimeout(() => {
      expect(cache.get('key1')).toBeUndefined()
      done()
    }, 150)
  })

  it('checks if key exists', () => {
    cache.set('key1', 'value1')
    expect(cache.has('key1')).toBe(true)
    expect(cache.has('key2')).toBe(false)
  })

  it('deletes specific keys', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    
    cache.delete('key1')
    
    expect(cache.has('key1')).toBe(false)
    expect(cache.has('key2')).toBe(true)
  })

  it('clears all cache', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    
    cache.clear()
    
    expect(cache.has('key1')).toBe(false)
    expect(cache.has('key2')).toBe(false)
  })

  it('returns cache size', () => {
    expect(cache.size()).toBe(0)
    
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    
    expect(cache.size()).toBe(2)
  })

  it('cleans up expired entries', (done) => {
    cache.set('key1', 'value1', 50)
    cache.set('key2', 'value2', 200)
    
    expect(cache.size()).toBe(2)
    
    setTimeout(() => {
      cache.cleanup()
      expect(cache.size()).toBe(1)
      expect(cache.has('key2')).toBe(true)
      done()
    }, 100)
  })
})


