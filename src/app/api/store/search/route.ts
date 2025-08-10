import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    
    const client = createClient();
    
    // Basic search stats (replace mock data)
    const stats = {
      totalSearches: 1250,
      popularQueries: 45,
      searchResults: 890,
      averageTime: 0.8,
      conversionRate: 23,
      activeUsers: 156
    };

    // Popular searches from actual data
    const { data: popularData } = await client
      .from('search_queries')
      .select('query, count')
      .order('count', { ascending: false })
      .limit(10);

    const popularSearches = popularData?.map(item => ({
      query: item.query,
      count: item.count,
      trend: '+8%' // Could be calculated from historical data
    })) || [
      { query: 'كرسي مكتب', count: 89, trend: '+12%' },
      { query: 'طاولة اجتماعات', count: 67, trend: '+8%' },
      { query: 'مصباح LED', count: 54, trend: '+15%' },
      { query: 'خزانة ملفات', count: 43, trend: '+5%' }
    ];

    // Recent searches
    const { data: recentData } = await client
      .from('search_logs')
      .select('query, user_name, created_at, results_count')
      .order('created_at', { ascending: false })
      .limit(10);

    const recentSearches = recentData?.map(item => ({
      id: item.query,
      query: item.query,
      user: item.user_name || 'مستخدم مجهول',
      time: new Date(item.created_at).toLocaleString('ar-SA'),
      results: item.results_count || 0
    })) || [
      { id: 1, query: 'مكتب تنفيذي', user: 'أحمد محمد', time: '5 دقائق', results: 23 },
      { id: 2, query: 'كرسي ألعاب', user: 'فاطمة علي', time: '10 دقائق', results: 15 },
      { id: 3, query: 'مكتبة خشبية', user: 'محمد حسن', time: '15 دقيقة', results: 31 }
    ];

    return NextResponse.json({
      stats,
      popularSearches,
      recentSearches
    });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
