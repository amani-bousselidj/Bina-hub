'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { 
  Store, 
  User, 
  Wrench, 
  Shield, 
  ArrowRight,
  Users,
  Package,
  Settings,
  BarChart3
} from 'lucide-react';

interface QuickAccessLinksProps {
  currentSection: 'user' | 'store' | 'service-provider' | 'admin';
}

export default function QuickAccessLinks({ currentSection }: QuickAccessLinksProps) {
  
  const getLinksForSection = () => {
    switch (currentSection) {
      case 'user':
        return [
          {
            title: 'إدارة المتجر',
            description: 'إنشاء وإدارة متجرك الإلكتروني',
            href: '/store/dashboard',
            icon: Store,
            color: 'bg-green-50 border-green-200 hover:bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            title: 'الخدمات المتخصصة',
            description: 'اطلب خدمات احترافية لمشروعك',
            href: '/service-provider/dashboard',
            icon: Wrench,
            color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ];
      
      case 'store':
        return [
          {
            title: 'إدارة العملاء',
            description: 'عرض وإدارة بيانات العملاء',
            href: '/user/dashboard',
            icon: Users,
            color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            title: 'الخدمات المساندة',
            description: 'خدمات إضافية لتطوير المتجر',
            href: '/service-provider/dashboard',
            icon: Wrench,
            color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            iconColor: 'text-purple-600'
          },
          {
            title: 'لوحة الإدارة',
            description: 'إعدادات المتجر المتقدمة',
            href: '/admin/dashboard',
            icon: Shield,
            color: 'bg-red-50 border-red-200 hover:bg-red-100',
            iconColor: 'text-red-600'
          }
        ];
      
      case 'service-provider':
        return [
          {
            title: 'إدارة العملاء',
            description: 'عرض وإدارة طلبات العملاء',
            href: '/user/dashboard',
            icon: Users,
            color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            title: 'متاجر الشركاء',
            description: 'التعاون مع المتاجر الإلكترونية',
            href: '/store/dashboard',
            icon: Store,
            color: 'bg-green-50 border-green-200 hover:bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            title: 'لوحة الإدارة',
            description: 'إعدادات مقدم الخدمة المتقدمة',
            href: '/admin/dashboard',
            icon: Shield,
            color: 'bg-red-50 border-red-200 hover:bg-red-100',
            iconColor: 'text-red-600'
          }
        ];
      
      case 'admin':
        return [
          {
            title: 'إدارة المستخدمين',
            description: 'مراقبة وإدارة جميع المستخدمين',
            href: '/user/dashboard',
            icon: Users,
            color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            title: 'إدارة المتاجر',
            description: 'مراقبة ومراجعة المتاجر الإلكترونية',
            href: '/store/dashboard',
            icon: Store,
            color: 'bg-green-50 border-green-200 hover:bg-green-100',
            iconColor: 'text-green-600'
          },
          {
            title: 'إدارة مقدمي الخدمة',
            description: 'مراقبة ومراجعة مقدمي الخدمات',
            href: '/service-provider/dashboard',
            icon: Wrench,
            color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
            iconColor: 'text-purple-600'
          }
        ];
      
      default:
        return [];
    }
  };

  const links = getLinksForSection();

  if (links.length === 0) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          الوصول السريع للأقسام الأخرى
        </CardTitle>
        <CardDescription>
          انتقل بسرعة إلى الأقسام المختلفة في النظام
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className={`transition-all duration-200 cursor-pointer ${link.color}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white ${link.iconColor}`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1">{link.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{link.description}</p>
                      <div className="flex items-center text-sm font-medium text-gray-700">
                        <span>انتقال</span>
                        <ArrowRight className="h-4 w-4 mr-1" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


