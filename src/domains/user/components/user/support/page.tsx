'use client';

import React, { useState } from 'react';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Search,
  Bot,
  Users,
  Headphones,
  Book,
  ExternalLink,
  Send,
  ArrowLeft
} from 'lucide-react';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  lastUpdate: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

export default function UserSupportPage() {
  const { user, session, isLoading, error } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const supportStats = {
    totalTickets: 12,
    openTickets: 3,
    resolvedTickets: 8,
    avgResponseTime: '2 ساعة'
  };

  const recentTickets: SupportTicket[] = [
    {
      id: 'T001',
      subject: 'مشكلة في تسجيل الدخول',
      status: 'resolved',
      priority: 'medium',
      category: 'حساب المستخدم',
      createdAt: '2025-01-20',
      lastUpdate: '2025-01-21'
    },
    {
      id: 'T002', 
      subject: 'خطأ في حساب التكاليف',
      status: 'pending',
      priority: 'high',
      category: 'الحاسبة',
      createdAt: '2025-01-22',
      lastUpdate: '2025-01-23'
    }
  ];

  const faqItems: FAQItem[] = [
    {
      id: 'F001',
      question: 'كيف يمكنني إنشاء مشروع جديد؟',
      answer: 'اذهب إلى قسم المشاريع، اضغط على "مشروع جديد"، املأ البيانات المطلوبة وانقر حفظ.',
      category: 'المشاريع',
      helpful: 45
    },
    {
      id: 'F002',
      question: 'كيف أقوم بإضافة ضمان جديد؟',
      answer: 'من صفحة الضمانات، اضغط "إضافة ضمان"، أدخل بيانات المنتج وتاريخ الشراء.',
      category: 'الضمانات',
      helpful: 32
    }
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-600" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'open': return 'مفتوحة';
      case 'pending': return 'قيد المراجعة';
      case 'resolved': return 'تم الحل';
      case 'closed': return 'مغلقة';
      default: return 'غير معروف';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal" dir="rtl">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header with Gradient Background */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Typography variant="heading" size="3xl" weight="bold" className="text-white mb-3 flex items-center gap-3">
                <Headphones className="w-10 h-10" />
                مركز الدعم الفني
              </Typography>
              <Typography variant="body" size="lg" className="text-blue-100">
                نحن هنا لمساعدتك في حل أي مشكلة أو الإجابة على استفساراتك
              </Typography>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setActiveTab('new-ticket')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                تذكرة جديدة
              </Button>
            </div>
          </div>
          
          {/* Statistics Cards in Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-200" />
                <div>
                  <Typography variant="subheading" size="xl" weight="bold" className="text-white">
                    {supportStats.totalTickets}
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-blue-100">إجمالي التذاكر</Typography>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-orange-200" />
                <div>
                  <Typography variant="subheading" size="xl" weight="bold" className="text-white">
                    {supportStats.openTickets}
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-blue-100">تذاكر مفتوحة</Typography>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-200" />
                <div>
                  <Typography variant="subheading" size="xl" weight="bold" className="text-white">
                    {supportStats.resolvedTickets}
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-blue-100">تم الحل</Typography>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-200" />
                <div>
                  <Typography variant="subheading" size="xl" weight="bold" className="text-white">
                    {supportStats.avgResponseTime}
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-blue-100">متوسط الرد</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'contact', label: 'طرق التواصل', icon: Phone },
            { id: 'tickets', label: 'تذاكري', icon: FileText },
            { id: 'faq', label: 'الأسئلة الشائعة', icon: Book },
            { id: 'new-ticket', label: 'تذكرة جديدة', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EnhancedCard className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <Typography variant="subheading" size="lg" weight="bold" className="mb-2">الهاتف</Typography>
              <Typography variant="body" className="text-gray-600 mb-4">
                للحالات العاجلة والمساعدة الفورية
              </Typography>
              <Typography variant="body" weight="bold" className="text-blue-600">
                920000123
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-500">
                متاح 24/7
              </Typography>
            </EnhancedCard>

            <EnhancedCard className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <Typography variant="subheading" size="lg" weight="bold" className="mb-2">البريد الإلكتروني</Typography>
              <Typography variant="body" className="text-gray-600 mb-4">
                للاستفسارات والمتابعة
              </Typography>
              <Typography variant="body" weight="bold" className="text-green-600">
                support@binna.com
              </Typography>
              <Typography variant="caption" size="sm" className="text-gray-500">
                الرد خلال 2-4 ساعات
              </Typography>
            </EnhancedCard>

            <EnhancedCard className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-purple-600" />
              </div>
              <Typography variant="subheading" size="lg" weight="bold" className="mb-2">الدردشة المباشرة</Typography>
              <Typography variant="body" className="text-gray-600 mb-4">
                تحدث مع مستشار مباشرة
              </Typography>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Bot className="w-4 h-4 mr-2" />
                ابدأ المحادثة
              </Button>
            </EnhancedCard>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="lg" weight="bold" className="mb-4">تذاكري الأخيرة</Typography>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <Typography variant="body" weight="bold">#{ticket.id}</Typography>
                        <Typography variant="body">{ticket.subject}</Typography>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === 'high' ? 'عالية' : ticket.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </Badge>
                        <Badge variant="outline">
                          {getStatusText(ticket.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>الفئة: {ticket.category}</span>
                      <span>آخر تحديث: {ticket.lastUpdate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqItems.map((item) => (
              <EnhancedCard key={item.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Typography variant="subheading" weight="bold" className="text-gray-800">
                    {item.question}
                  </Typography>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <Typography variant="body" className="text-gray-600 mb-3">
                  {item.answer}
                </Typography>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    مفيد ({item.helpful})
                  </span>
                </div>
              </EnhancedCard>
            ))}
          </div>
        )}

        {activeTab === 'new-ticket' && (
          <EnhancedCard className="p-6">
            <Typography variant="subheading" size="lg" weight="bold" className="mb-6">إنشاء تذكرة دعم جديدة</Typography>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">موضوع التذكرة</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اكتب موضوع المشكلة..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الفئة</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الفئة</option>
                    <option value="account">حساب المستخدم</option>
                    <option value="projects">المشاريع</option>
                    <option value="warranties">الضمانات</option>
                    <option value="calculator">الحاسبة</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="billing">الفواتير والدفع</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">الأولوية</label>
                <div className="flex gap-4">
                  {[
                    { value: 'low', label: 'منخفضة', color: 'green' },
                    { value: 'medium', label: 'متوسطة', color: 'yellow' },
                    { value: 'high', label: 'عالية', color: 'orange' },
                    { value: 'urgent', label: 'عاجلة', color: 'red' }
                  ].map((priority) => (
                    <label key={priority.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value={priority.value}
                        checked={newTicket.priority === priority.value}
                        onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span className={`px-3 py-1 rounded-full text-sm bg-${priority.color}-100 text-${priority.color}-800`}>
                        {priority.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">وصف المشكلة</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="اشرح المشكلة بالتفصيل..."
                />
              </div>

              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  إرسال التذكرة
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('tickets')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  العودة للتذاكر
                </Button>
              </div>
            </form>
          </EnhancedCard>
        )}
      </div>
    </main>
  );
}



