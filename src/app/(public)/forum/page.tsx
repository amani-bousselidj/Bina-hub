'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Card } from '@/components/ui';
import { LoadingSpinner, EmptyState } from '@/components/ui/enhanced-components';
import ClientIcon from '@/components/ui/ClientIcon';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';


export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  author_type: 'user' | 'store' | 'expert';
  created_at: string;
  updated_at: string;
  category: string;
  replies_count: number;
  likes_count: number;
  is_pinned: boolean;
  tags: string[];
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  posts_count: number;
  icon: string;
  color: string;
}

interface ForumStats {
  total_posts: number;
  total_users: number;
  active_topics: number;
  expert_answers: number;
}

export default function ForumPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [stats, setStats] = useState<ForumStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const supabase = createClientComponentClient();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const loadForumData = async () => {
      try {
        setLoading(true);

        // Check if user is logged in (optional for public forum)
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // Mock forum data - in a real app, this would come from the database
        const mockStats: ForumStats = {
          total_posts: 1247,
          total_users: 892,
          active_topics: 156,
          expert_answers: 423,
        };

        const mockCategories: ForumCategory[] = [
          {
            id: 'construction',
            name: 'البناء والتشييد',
            description: 'مناقشات حول تقنيات البناء والمشاريع',
            posts_count: 342,
            icon: 'construction',
            color: 'blue',
          },
          {
            id: 'materials',
            name: 'المواد والأسعار',
            description: 'أسعار المواد ومقارنة الجودة',
            posts_count: 278,
            icon: 'calculator',
            color: 'green',
          },
          {
            id: 'design',
            name: 'التصميم والديكور',
            description: 'أفكار التصميم والديكور الداخلي',
            posts_count: 189,
            icon: 'design',
            color: 'purple',
          },
          {
            id: 'contractors',
            name: 'المقاولون والحرفيون',
            description: 'تقييمات وتوصيات المقاولين',
            posts_count: 156,
            icon: 'users',
            color: 'orange',
          },
          {
            id: 'legal',
            name: 'القانونية والتراخيص',
            description: 'الاستفسارات القانونية والتراخيص',
            posts_count: 134,
            icon: 'legal',
            color: 'red',
          },
          {
            id: 'general',
            name: 'عام',
            description: 'مناقشات عامة ومتنوعة',
            posts_count: 148,
            icon: 'chat',
            color: 'gray',
          },
        ];

        const mockPosts: ForumPost[] = [
          {
            id: '1',
            title: 'ما هي أفضل أنواع الأسمنت للبناء السكني؟',
            content:
              'أبحث عن نصيحة حول أفضل أنواع الأسمنت المناسبة للبناء السكني. هل هناك فرق في الجودة بين الماركات المختلفة؟',
            author: 'أحمد محمد',
            author_type: 'user',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            category: 'materials',
            replies_count: 12,
            likes_count: 8,
            is_pinned: true,
            tags: ['أسمنت', 'مواد_بناء', 'جودة'],
          },
          {
            id: '2',
            title: 'تجربتي مع مقاول البناء - نصائح مهمة',
            content:
              'أشارككم تجربتي مع مقاول البناء وأهم النصائح التي تعلمتها خلال رحلة بناء منزلي...',
            author: 'سارة الأحمد',
            author_type: 'user',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 5400000).toISOString(),
            category: 'contractors',
            replies_count: 24,
            likes_count: 31,
            is_pinned: false,
            tags: ['مقاولون', 'تجربة', 'نصائح'],
          },
          {
            id: '3',
            title: 'أحدث اتجاهات التصميم الداخلي لعام 2024',
            content: 'نظرة على أحدث اتجاهات التصميم الداخلي والألوان الرائجة هذا العام...',
            author: 'م. خالد الراشد',
            author_type: 'expert',
            created_at: new Date(Date.now() - 10800000).toISOString(),
            updated_at: new Date(Date.now() - 9000000).toISOString(),
            category: 'design',
            replies_count: 18,
            likes_count: 45,
            is_pinned: false,
            tags: ['تصميم', 'ديكور', 'اتجاهات'],
          },
          {
            id: '4',
            title: 'كيفية الحصول على رخصة البناء في الرياض؟',
            content: 'دليل شامل للحصول على رخصة البناء في مدينة الرياض والأوراق المطلوبة...',
            author: 'مكتب الاستشارات القانونية',
            author_type: 'expert',
            created_at: new Date(Date.now() - 14400000).toISOString(),
            updated_at: new Date(Date.now() - 12600000).toISOString(),
            category: 'legal',
            replies_count: 9,
            likes_count: 22,
            is_pinned: true,
            tags: ['رخصة_بناء', 'قانونية', 'الرياض'],
          },
          {
            id: '5',
            title: 'مقارنة بين أنواع العزل المختلفة',
            content: 'ما هي أفضل أنواع العزل للمنازل في المناخ السعودي؟ عزل حراري أم مائي؟',
            author: 'فهد العنزي',
            author_type: 'user',
            created_at: new Date(Date.now() - 18000000).toISOString(),
            updated_at: new Date(Date.now() - 16200000).toISOString(),
            category: 'construction',
            replies_count: 15,
            likes_count: 19,
            is_pinned: false,
            tags: ['عزل', 'حراري', 'مائي'],
          },
        ];

        setStats(mockStats);
        setCategories(mockCategories);
        setPosts(mockPosts);

        console.log('✅ [Forum] Data loaded successfully');
      } catch (err) {
        console.error('❌ [Forum] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadForumData();
  }, [isHydrated, supabase]);

  const getAuthorBadge = (authorType: string) => {
    switch (authorType) {
      case 'expert':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gold-100 text-gold-800">
            خبير
          </span>
        );
      case 'store':
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            متجر
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            عضو
          </span>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat?.color || 'gray';
  };

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (!isHydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">منتدى بننا للبناء</h1>
          <p className="text-xl text-gray-600 mb-6">
            مجتمعك لتبادل الخبرات والمعرفة في مجال البناء والتشييد
          </p>
          {!user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-blue-800 mb-3">انضم إلى مجتمعنا لتتمكن من المشاركة والتفاعل</p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-colors"
                >
                  إنشاء حساب
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Forum Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6">
              <ClientIcon type="chart" size={32} className="mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-gray-800">{stats.total_posts}</div>
              <div className="text-sm text-gray-600">إجمالي المشاركات</div>
            </Card>
            <Card className="text-center p-6">
              <ClientIcon type="marketing" size={32} className="mx-auto mb-3 text-green-600" />
              <div className="text-2xl font-bold text-gray-800">{stats.total_users}</div>
              <div className="text-sm text-gray-600">الأعضاء المسجلين</div>
            </Card>
            <Card className="text-center p-6">
              <ClientIcon type="conversion" size={32} className="mx-auto mb-3 text-purple-600" />
              <div className="text-2xl font-bold text-gray-800">{stats.active_topics}</div>
              <div className="text-sm text-gray-600">المواضيع النشطة</div>
            </Card>
            <Card className="text-center p-6">
              <ClientIcon type="shield" size={32} className="mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-gray-800">{stats.expert_answers}</div>
              <div className="text-sm text-gray-600">إجابات الخبراء</div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">الأقسام</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-right p-3 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>جميع الأقسام</span>
                    <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                      {posts.length}
                    </span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-right p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ClientIcon
                        type={category.icon as any}
                        size={20}
                        className={`text-${category.color}-600`}
                      />
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                            {category.posts_count}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            {user && (
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">إجراءات سريعة</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors" onClick={() => alert('Button clicked')}>
                    <div className="flex items-center gap-2">
                      <ClientIcon type="settings" size={16} />
                      <span>موضوع جديد</span>
                    </div>
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 p-3 rounded-lg transition-colors" onClick={() => alert('Button clicked')}>
                    <div className="flex items-center gap-2">
                      <ClientIcon type="cart" size={16} />
                      <span>مواضيعي المحفوظة</span>
                    </div>
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 p-3 rounded-lg transition-colors" onClick={() => alert('Button clicked')}>
                    <div className="flex items-center gap-2">
                      <ClientIcon type="chart" size={16} />
                      <span>مشاركاتي</span>
                    </div>
                  </button>
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="البحث في المنتدى..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>الأحدث</option>
                    <option>الأكثر تفاعلاً</option>
                    <option>الأكثر إعجاباً</option>
                  </select>
                  {user && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors" onClick={() => alert('Button clicked')}>
                      موضوع جديد
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <EmptyState
                icon={
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                }
                title="لا توجد مشاركات"
                description="لم يتم العثور على مشاركات في هذا القسم أو بهذا البحث"
                action={{
                  label: user ? 'إنشاء موضوع جديد' : 'تسجيل الدخول للمشاركة',
                  onClick: () =>
                    user ? console.log('Create new post') : (window.location.href = '/login')
                }}
              />
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {post.is_pinned && (
                          <svg
                            className="w-5 h-5 text-orange-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <div
                          className={`w-3 h-3 rounded-full bg-${getCategoryColor(post.category)}-500`}
                        ></div>
                        <span className="text-sm text-gray-500">
                          {categories.find((c) => c.id === post.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAuthorBadge(post.author_type)}
                        <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">{post.author}</span>
                        <div className="flex items-center gap-1">
                          <ClientIcon type="chart" size={16} />
                          <span>{post.replies_count} رد</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClientIcon type="money" size={16} />
                          <span>{post.likes_count} إعجاب</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}







