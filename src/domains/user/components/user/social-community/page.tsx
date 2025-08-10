"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  Users, MessageSquare, Share2, Heart, Eye, ThumbsUp, 
  Camera, Image, Video, FileText, Building, Wrench,
  Calendar, Clock, Filter, Search, Plus, Tag,
  TrendingUp, Award, Star, Send, Bookmark
} from 'lucide-react';

export const dynamic = 'force-dynamic'

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    level: number;
    badge?: string;
  };
  content: string;
  images?: string[];
  projectType?: string;
  location?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  saved: boolean;
  liked: boolean;
  tags: string[];
  category: 'project-showcase' | 'tips-advice' | 'questions' | 'tools-review' | 'before-after';
}

interface CommunityStats {
  totalMembers: number;
  activeToday: number;
  postsToday: number;
  questionsAnswered: number;
}

export default function CommunityPage() {
  const { user, session, isLoading, error } = useAuth();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'POST001',
      author: {
        name: 'محمد البناء',
        level: 12,
        badge: 'خبير البناء'
      },
      content: 'انتهيت من مشروع فيلا سكنية في الرياض. استخدمت أحدث التقنيات في العزل الحراري. ما رأيكم في النتيجة؟',
      images: [
        '/api/placeholder/400/300',
        '/api/placeholder/400/300'
      ],
      projectType: 'فيلا سكنية',
      location: 'الرياض',
      timestamp: '2025-01-18T14:30:00',
      likes: 45,
      comments: 12,
      shares: 8,
      saved: false,
      liked: true,
      tags: ['عزل_حراري', 'فيلا', 'الرياض'],
      category: 'project-showcase'
    },
    {
      id: 'POST002',
      author: {
        name: 'سارة المعمارية',
        level: 8,
        badge: 'مهندسة معمارية'
      },
      content: 'نصيحة مهمة: عند اختيار الرمل للخرسانة، تأكد من أنه مغسول وخالي من الأملاح. هذا يضمن قوة الخرسانة على المدى الطويل.',
      timestamp: '2025-01-18T11:15:00',
      likes: 32,
      comments: 7,
      shares: 15,
      saved: true,
      liked: false,
      tags: ['نصائح', 'خرسانة', 'رمل'],
      category: 'tips-advice'
    },
    {
      id: 'POST003',
      author: {
        name: 'أحمد الكهربائي',
        level: 6,
        badge: 'فني كهرباء'
      },
      content: 'هل يمكن لأحد مساعدتي في اختيار نوع الكابل المناسب لتمديدات كهرباء منزل بمساحة 300 متر؟',
      timestamp: '2025-01-18T09:45:00',
      likes: 8,
      comments: 18,
      shares: 3,
      saved: false,
      liked: false,
      tags: ['كهرباء', 'كابلات', 'استفسار'],
      category: 'questions'
    },
    {
      id: 'POST004',
      author: {
        name: 'خالد المقاول',
        level: 15,
        badge: 'مقاول خبير'
      },
      content: 'مراجعة أدوات البناء الجديدة من شركة ABC. جودة ممتازة وأسعار منافسة. أنصح بها بشدة للمشاريع الكبيرة.',
      timestamp: '2025-01-17T16:20:00',
      likes: 28,
      comments: 9,
      shares: 12,
      saved: true,
      liked: true,
      tags: ['مراجعة', 'أدوات', 'جودة'],
      category: 'tools-review'
    }
  ]);

  const [communityStats] = useState<CommunityStats>({
    totalMembers: 15420,
    activeToday: 1250,
    postsToday: 89,
    questionsAnswered: 156
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const categoryFilters = [
    { id: 'all', label: 'الكل', icon: <Building className="w-4 h-4" /> },
    { id: 'project-showcase', label: 'معرض المشاريع', icon: <Camera className="w-4 h-4" /> },
    { id: 'tips-advice', label: 'نصائح ومشورة', icon: <Star className="w-4 h-4" /> },
    { id: 'questions', label: 'أسئلة', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'tools-review', label: 'مراجعة الأدوات', icon: <Wrench className="w-4 h-4" /> },
    { id: 'before-after', label: 'قبل وبعد', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesFilter = activeFilter === 'all' || post.category === activeFilter;
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    console.log('Sharing post:', postId);
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: `POST${Date.now()}`,
        author: {
          name: 'أنت',
          level: 5,
          badge: 'عضو جديد'
        },
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        saved: false,
        liked: false,
        tags: [],
        category: 'questions'
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setShowNewPostForm(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ لحظات';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    return `منذ ${Math.floor(diffInHours / 24)} يوم`;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'project-showcase': return <Camera className="w-4 h-4" />;
      case 'tips-advice': return <Star className="w-4 h-4" />;
      case 'questions': return <MessageSquare className="w-4 h-4" />;
      case 'tools-review': return <Wrench className="w-4 h-4" />;
      case 'before-after': return <TrendingUp className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'project-showcase': return 'معرض المشاريع';
      case 'tips-advice': return 'نصائح ومشورة';
      case 'questions': return 'سؤال';
      case 'tools-review': return 'مراجعة الأدوات';
      case 'before-after': return 'قبل وبعد';
      default: return 'منشور';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100';
    if (level >= 5) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          مجتمع البناء
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تواصل مع المهنيين، شارك مشاريعك، واحصل على النصائح من الخبراء
        </Typography>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600 mb-1">
            {communityStats.totalMembers.toLocaleString('en-US')}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">إجمالي الأعضاء</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-green-600 mb-1">
            {communityStats.activeToday.toLocaleString('en-US')}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">نشط اليوم</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-purple-600 mb-1">
            {communityStats.postsToday}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">منشورات اليوم</Typography>
        </EnhancedCard>
        
        <EnhancedCard className="p-4 text-center">
          <Typography variant="subheading" size="2xl" weight="bold" className="text-orange-600 mb-1">
            {communityStats.questionsAnswered}
          </Typography>
          <Typography variant="caption" size="sm" className="text-gray-600">أسئلة مجاب عليها</Typography>
        </EnhancedCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <EnhancedCard className="p-4 mb-6">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">التصنيفات</Typography>
            <div className="space-y-2">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter.icon}
                  {filter.label}
                </button>
              ))}
            </div>
          </EnhancedCard>

          {/* Top Contributors */}
          <EnhancedCard className="p-4">
            <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">المساهمون المميزون</Typography>
            <div className="space-y-3">
              {[
                { name: 'محمد البناء', level: 12, badge: 'خبير البناء', posts: 45 },
                { name: 'سارة المعمارية', level: 8, badge: 'مهندسة معمارية', posts: 32 },
                { name: 'خالد المقاول', level: 15, badge: 'مقاول خبير', posts: 67 }
              ].map((contributor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {contributor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <Typography variant="subheading" size="sm" weight="semibold">{contributor.name}</Typography>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(contributor.level)}`}>
                        مستوى {contributor.level}
                      </span>
                      <Typography variant="caption" size="xs" className="text-gray-500">
                        {contributor.posts} منشور
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </EnhancedCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and New Post */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="البحث في المجتمع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <Button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                منشور جديد
              </Button>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <EnhancedCard className="p-4">
                <Typography variant="subheading" size="lg" weight="semibold" className="mb-3">إنشاء منشور جديد</Typography>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="شارك مشروعك، اطرح سؤالاً، أو قدم نصيحة للمجتمع..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700" onClick={() => alert('Button clicked')}>
                      <Image className="w-4 h-4" />
                      صورة
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 border-gray-300 text-gray-700" onClick={() => alert('Button clicked')}>
                      <Video className="w-4 h-4" />
                      فيديو
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowNewPostForm(false)}
                      className="border-gray-300 text-gray-700"
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleNewPost}
                      disabled={!newPost.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      نشر
                    </Button>
                  </div>
                </div>
              </EnhancedCard>
            )}
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <EnhancedCard key={post.id} className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography variant="subheading" size="lg" weight="semibold">{post.author.name}</Typography>
                        <span className={`px-2 py-1 rounded-full text-xs ${getLevelColor(post.author.level)}`}>
                          مستوى {post.author.level}
                        </span>
                        {post.author.badge && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {post.author.badge}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-gray-500">
                          {getCategoryIcon(post.category)}
                          <span className="text-sm">{getCategoryName(post.category)}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeAgo(post.timestamp)}
                        </span>
                        {post.location && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => handleSave(post.id)}
                    variant="ghost"
                    className={`p-2 ${post.saved ? 'text-yellow-600' : 'text-gray-400'}`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </Button>
                </div>

                {/* Post Content */}
                <Typography variant="body" size="lg" className="text-gray-800 mb-4 leading-relaxed">
                  {post.content}
                </Typography>

                {/* Project Details */}
                {post.projectType && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <Typography variant="caption" size="sm" className="text-gray-600">
                      <Building className="w-4 h-4 inline ml-1" />
                      نوع المشروع: {post.projectType}
                    </Typography>
                  </div>
                )}

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {post.images.map((image, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors ${
                        post.liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors" onClick={() => alert('Button clicked')}>
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                   onClick={() => alert('Button clicked')}>
                    <Send className="w-4 h-4" />
                    رد
                  </Button>
                </div>
              </EnhancedCard>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
                لا توجد منشورات
              </Typography>
              <Typography variant="body" size="lg" className="text-gray-500">
                {searchTerm || activeFilter !== 'all' 
                  ? 'لم يتم العثور على منشورات تطابق البحث' 
                  : 'كن أول من ينشر في المجتمع'}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}



