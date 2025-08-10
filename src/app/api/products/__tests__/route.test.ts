// Mock Next.js server module early to avoid Request/Response issues in Jest
jest.mock('next/server', () => ({
  NextResponse: { json: (body: any) => ({ __json: body }) },
}))

const { GET } = require('../route')

// Mock Supabase client to capture query builder calls
jest.mock('@/lib/supabase/client', () => {
  const calls: any = { view: { eq: [], gt: [], or: [] }, base: { eq: [], gt: [], or: [] } }
  const makeThenable = (which: 'view' | 'base') => {
    const qb: any = {
      _which: which,
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      eq: jest.fn((col: string, val: any) => { calls[which].eq.push([col, val]); return qb }),
      gt: jest.fn((col: string, val: any) => { calls[which].gt.push([col, val]); return qb }),
      or: jest.fn((expr: string) => { calls[which].or.push(expr); return qb }),
      then: (resolve: any) => resolve({ data: [], error: null }),
    }
    return qb
  }
  const client = {
    from: (table: string) => table === 'products_with_store' ? makeThenable('view') : makeThenable('base'),
  }
  const reset = () => {
    calls.view.eq = []
    calls.view.gt = []
    calls.view.or = []
    calls.base.eq = []
    calls.base.gt = []
    calls.base.or = []
  }
  const get = () => calls
  return { createClient: () => client, __getCalls: get, __resetCalls: reset }
})

describe('/api/products GET param handling', () => {
  const supabaseMock = require('@/lib/supabase/client')
  beforeEach(() => {
    supabaseMock.__resetCalls()
  })
  const makeReq = (qs: Record<string, string | undefined>) => {
    const p = new URLSearchParams()
    Object.entries(qs).forEach(([k,v]) => { if (typeof v !== 'undefined') p.set(k, v) })
    const url = `http://localhost/api/products${p.toString() ? `?${p.toString()}` : ''}`
    return { url } as any
  }

  test('applies storeId and inStock filters to the view query', async () => {
    const req = makeReq({ storeId: 'store-123', inStock: 'true' })
    await GET(req)
  const calls = supabaseMock.__getCalls()
    expect(calls.view.eq).toContainEqual(['store_id', 'store-123'])
    expect(calls.view.gt).toContainEqual(['quantity_in_stock', 0])
  })

  test('applies freeShipping filter only on the view when requested', async () => {
    const req = makeReq({ freeShipping: 'true' })
    await GET(req)
    const calls = supabaseMock.__getCalls()
    expect(calls.view.eq).toContainEqual(['free_shipping', true])
  })

  test('does not add storeId/inStock when params absent', async () => {
    const req = makeReq({})
    await GET(req)
  const calls = supabaseMock.__getCalls()
  expect(calls.view.eq.find((c: any[]) => c[0] === 'store_id')).toBeUndefined()
  expect(calls.view.gt.find((c: any[]) => c[0] === 'quantity_in_stock')).toBeUndefined()
  })
})
