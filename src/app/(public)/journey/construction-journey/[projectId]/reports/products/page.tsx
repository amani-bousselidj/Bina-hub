'use client';

import React, { useState, useEffect } from 'react';
import { ProjectProductReport } from '@components/project/ProjectProductReport';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from '@/components/ui/enhanced-components';

interface ProjectProductReportPageProps {}

export default function ProjectProductReportPage({}: ProjectProductReportPageProps) {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.projectId as string;
  
  const [project, setProject] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock project data
      const mockProject = {
        id: projectId,
        name: 'مشروع فيلا الرياض الحديثة',
        description: 'بناء فيلا عصرية بمساحة 400 متر مربع في حي الملقا',
        startDate: new Date('2024-01-15'),
        expectedEndDate: new Date('2024-12-15'),
        completedDate: null,
      };

      // Mock products data
      const mockProducts = [
        {
          id: 'prod-1',
          name: 'خرسانة عالية الجودة C30',
          description: 'خرسانة مقاومة للضغط 30 نيوتن/مم²',
          price: 450,
          quantity: 50,
          phase: 'مرحلة الأساسات',
          phaseOrder: 1,
          storeId: 'store-1',
          storeName: 'متجر مواد البناء الحديث',
          storeContact: {
            phone: '+966 50 123 4567',
            email: 'info@modern-construction.com',
          },
          category: 'خرسانة ومواد بناء',
          warranty: {
            duration: 5,
            type: 'years' as const,
            details: 'ضمان ضد العيوب في التصنيع',
            startDate: new Date('2024-01-20'),
            endDate: new Date('2029-01-20'),
          },
          invoiceId: 'inv-001',
          invoiceDate: new Date('2024-01-20'),
          addedAt: new Date('2024-01-18'),
          deliveredAt: new Date('2024-01-25'),
          specifications: {
            'نوع الخرسانة': 'C30',
            'المقاومة': '30 نيوتن/مم²',
            'وقت التصلب': '28 يوم',
          }
        },
        {
          id: 'prod-2',
          name: 'حديد تسليح عالي الكربون 12مم',
          description: 'حديد تسليح مطابق للمواصفات السعودية',
          price: 2800,
          quantity: 100,
          phase: 'مرحلة الأساسات',
          phaseOrder: 1,
          storeId: 'store-2',
          storeName: 'شركة الحديد المتين',
          storeContact: {
            phone: '+966 50 987 6543',
            email: 'sales@steel-strong.com',
          },
          category: 'حديد وصلب',
          warranty: {
            duration: 10,
            type: 'years' as const,
            details: 'ضمان ضد الصدأ والتآكل',
            startDate: new Date('2024-01-22'),
            endDate: new Date('2034-01-22'),
          },
          invoiceId: 'inv-002',
          invoiceDate: new Date('2024-01-22'),
          addedAt: new Date('2024-01-20'),
          deliveredAt: new Date('2024-01-28'),
          specifications: {
            'القطر': '12 مم',
            'النوع': 'عالي الكربون',
            'الطول': '12 متر',
          }
        },
        {
          id: 'prod-3',
          name: 'بلاط الأرضيات الرخامي الفاخر',
          description: 'بلاط رخامي إيطالي فاخر للأرضيات',
          price: 180,
          quantity: 200,
          phase: 'مرحلة التشطيب والديكور',
          phaseOrder: 3,
          storeId: 'store-3',
          storeName: 'معرض الرخام الملكي',
          storeContact: {
            phone: '+966 50 555 7777',
            email: 'info@royal-marble.com',
          },
          category: 'أرضيات وتبليط',
          warranty: {
            duration: 3,
            type: 'years' as const,
            details: 'ضمان ضد الكسر والخدش',
            startDate: new Date('2024-06-15'),
            endDate: new Date('2027-06-15'),
          },
          invoiceId: 'inv-015',
          invoiceDate: new Date('2024-06-15'),
          addedAt: new Date('2024-06-10'),
          deliveredAt: new Date('2024-06-20'),
          specifications: {
            'المقاس': '60×60 سم',
            'السماكة': '12 مم',
            'اللون': 'أبيض كراري',
            'المنشأ': 'إيطاليا',
          }
        },
        {
          id: 'prod-4',
          name: 'دهان خارجي مقاوم للعوامل الجوية',
          description: 'دهان أكريليك عالي الجودة للواجهات الخارجية',
          price: 95,
          quantity: 24,
          phase: 'مرحلة التشطيب والديكور',
          phaseOrder: 3,
          storeId: 'store-4',
          storeName: 'مستودع الدهانات الحديث',
          storeContact: {
            phone: '+966 50 444 8888',
            email: 'sales@modern-paints.com',
          },
          category: 'دهانات وتشطيبات',
          warranty: {
            duration: 2,
            type: 'years' as const,
            details: 'ضمان ضد التقشر والبهتان',
            startDate: new Date('2024-08-01'),
            endDate: new Date('2026-08-01'),
          },
          invoiceId: 'inv-023',
          invoiceDate: new Date('2024-08-01'),
          addedAt: new Date('2024-07-25'),
          deliveredAt: new Date('2024-08-05'),
          specifications: {
            'الحجم': '20 لتر',
            'النوع': 'أكريليك',
            'التطبيق': 'خارجي',
            'اللون': 'بيج فاتح',
          }
        },
        {
          id: 'prod-5',
          name: 'نوافذ الألمنيوم الحرارية',
          description: 'نوافذ ألمنيوم عازلة للحرارة والصوت',
          price: 1200,
          quantity: 15,
          phase: 'مرحلة البناء الخرساني',
          phaseOrder: 2,
          storeId: 'store-5',
          storeName: 'مصنع النوافذ الذكية',
          storeContact: {
            phone: '+966 50 333 9999',
            email: 'orders@smart-windows.com',
          },
          category: 'نوافذ وأبواب',
          warranty: {
            duration: 7,
            type: 'years' as const,
            details: 'ضمان شامل ضد العيوب والتآكل',
            startDate: new Date('2024-04-10'),
            endDate: new Date('2031-04-10'),
          },
          invoiceId: 'inv-008',
          invoiceDate: new Date('2024-04-10'),
          addedAt: new Date('2024-04-05'),
          deliveredAt: new Date('2024-04-15'),
          specifications: {
            'المقاس': '120×150 سم',
            'النوع': 'ألمنيوم حراري',
            'العزل': 'زجاج مزدوج',
            'اللون': 'بني غامق',
          }
        }
      ];

      setProject(mockProject);
      setProducts(mockProducts);
      setLoading(false);
    };

    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: 'عرض الفاتورة',
      description: `سيتم فتح الفاتورة رقم: ${invoiceId}`,
    });
    // TODO: Implement invoice viewing logic
  };

  const handleDownloadReport = (format: 'pdf' | 'excel') => {
    toast({
      title: 'تنزيل التقرير',
      description: `سيتم تنزيل التقرير بصيغة ${format.toUpperCase()}`,
    });
    // TODO: Implement report download logic
  };

  const handleSendReport = (email: string) => {
    toast({
      title: 'إرسال التقرير',
      description: `سيتم إرسال التقرير إلى: ${email}`,
    });
    // TODO: Implement email sending logic
  };

  const handlePrintReport = () => {
    toast({
      title: 'طباعة التقرير',
      description: 'سيتم فتح نافذة الطباعة',
    });
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تقرير المنتجات...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">المشروع غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على المشروع المطلوب</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            العودة للوحة التحكم
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectProductReport
          projectId={projectId}
          projectName={project.name}
          projectStartDate={project.startDate}
          projectEndDate={project.completedDate}
          products={products}
          onViewInvoice={handleViewInvoice}
          onDownloadReport={handleDownloadReport}
          onSendReport={handleSendReport}
          onPrintReport={handlePrintReport}
        />
      </div>
    </div>
  );
}

