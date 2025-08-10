"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Star, MapPin, Phone, Mail, CheckCircle, Clock, User } from 'lucide-react';

interface Supervisor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  completedProjects: number;
  hourlyRate: string;
  description: string;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  verified: boolean;
}

// Mock data for public display
const publicSupervisors: Supervisor[] = [
  {
    id: '1',
    name: 'أحمد محمد الأحمد',
    specialization: 'مهندس إنشائي',
    rating: 4.9,
    reviewCount: 87,
    location: 'الرياض',
    experience: 12,
    completedProjects: 156,
    hourlyRate: '150',
    description: 'مهندس إنشائي مع خبرة 12 عام في إدارة مشاريع البناء السكنية والتجارية. متخصص في التصميم الإنشائي والإشراف على التنفيذ.',
    skills: ['التصميم الإنشائي', 'إدارة المشاريع', 'الإشراف الفني', 'مراقبة الجودة'],
    availability: 'available',
    verified: true
  },
  {
    id: '2',
    name: 'فاطمة عبدالله',
    specialization: 'مهندسة معمارية',
    rating: 4.8,
    reviewCount: 64,
    location: 'جدة',
    experience: 8,
    completedProjects: 92,
    hourlyRate: '120',
    description: 'مهندسة معمارية متخصصة في التصميم الداخلي والخارجي للمباني السكنية. خبرة واسعة في استخدام أحدث برامج التصميم.',
    skills: ['التصميم المعماري', 'التصميم الداخلي', 'AutoCAD', '3D Max'],
    availability: 'busy',
    verified: true
  },
  {
    id: '3',
    name: 'خالد السعيد',
    specialization: 'مقاول عام',
    rating: 4.7,
    reviewCount: 128,
    location: 'الدمام',
    experience: 15,
    completedProjects: 203,
    hourlyRate: '100',
    description: 'مقاول عام معتمد مع خبرة 15 عام في تنفيذ مشاريع البناء من الأساسات حتى التشطيب. فريق عمل مدرب ومعدات حديثة.',
    skills: ['البناء العام', 'إدارة الموقع', 'التشطيبات', 'السباكة'],
    availability: 'available',
    verified: true
  },
  {
    id: '4',
    name: 'سارة الزهراني',
    specialization: 'مصممة ديكور',
    rating: 4.9,
    reviewCount: 76,
    location: 'الرياض',
    experience: 6,
    completedProjects: 89,
    hourlyRate: '80',
    description: 'مصممة ديكور محترفة متخصصة في التصميم الداخلي العصري والكلاسيكي. خبرة في اختيار الألوان والأثاث والإضاءة.',
    skills: ['التصميم الداخلي', 'اختيار الألوان', 'الإضاءة', 'الأثاث'],
    availability: 'available',
    verified: false
  },
  {
    id: '5',
    name: 'محمد الغامدي',
    specialization: 'كهربائي معتمد',
    rating: 4.6,
    reviewCount: 94,
    location: 'مكة المكرمة',
    experience: 10,
    completedProjects: 167,
    hourlyRate: '90',
    description: 'كهربائي معتمد متخصص في التمديدات الكهربائية للمباني السكنية والتجارية. خبرة في أنظمة الإضاءة الذكية والأمان.',
    skills: ['التمديدات الكهربائية', 'الإضاءة الذكية', 'أنظمة الأمان', 'الصيانة'],
    availability: 'busy',
    verified: true
  },
  {
    id: '6',
    name: 'نورا القحطاني',
    specialization: 'مهندسة مدنية',
    rating: 4.8,
    reviewCount: 52,
    location: 'الطائف',
    experience: 7,
    completedProjects: 73,
    hourlyRate: '130',
    description: 'مهندسة مدنية متخصصة في حساب الكميات وإعداد المواصفات الفنية. خبرة في إدارة المشاريع والتحكم في التكاليف.',
    skills: ['حساب الكميات', 'إدارة التكاليف', 'المواصفات الفنية', 'مراقبة الجودة'],
    availability: 'available',
    verified: true
  }
];

const getAvailabilityBadge = (status: string) => {
  switch (status) {
    case 'available':
      return <Badge className="bg-green-100 text-green-800">متاح</Badge>;
    case 'busy':
      return <Badge className="bg-yellow-100 text-yellow-800">مشغول</Badge>;
    case 'unavailable':
      return <Badge className="bg-red-100 text-red-800">غير متاح</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">غير محدد</Badge>;
  }
};

export default function PublicSupervisorsPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            المشرفين والخبراء
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            تعرف على أفضل المشرفين والخبراء في مجال البناء والتشييد
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/login">
              <Button size="lg" onClick={() => alert('Button clicked')}>
                سجل دخولك للتواصل مع المشرفين
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" onClick={() => alert('Button clicked')}>
                إنشاء حساب جديد
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
              <p className="text-gray-600">مشرف معتمد</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <p className="text-gray-600">مشروع مكتمل</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
              <p className="text-gray-600">متوسط التقييم</p>
            </CardContent>
          </Card>
        </div>

        {/* Supervisors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {publicSupervisors.map((supervisor) => (
            <Card key={supervisor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{supervisor.name}</h3>
                      {supervisor.verified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{supervisor.specialization}</p>
                    {getAvailabilityBadge(supervisor.availability)}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(supervisor.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {supervisor.rating} ({supervisor.reviewCount} تقييم)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{supervisor.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{supervisor.experience} سنوات خبرة • {supervisor.completedProjects} مشروع</span>
                  </div>

                  <div className="text-blue-600 font-semibold">
                    {supervisor.hourlyRate} ريال/ساعة
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {supervisor.description}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">المهارات:</p>
                  <div className="flex flex-wrap gap-1">
                    {supervisor.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {supervisor.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{supervisor.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full" onClick={() => alert('Button clicked')}>
                      سجل دخولك للتواصل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-blue-50 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              هل أنت مشرف بناء؟
            </h2>
            <p className="text-gray-600 mb-6">
              انضم إلى منصة بنّاء واحصل على مشاريع جديدة وزد دخلك
            </p>
            <Link href="/auth/signup">
              <Button size="lg" onClick={() => alert('Button clicked')}>
                انضم كمشرف بناء
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}









