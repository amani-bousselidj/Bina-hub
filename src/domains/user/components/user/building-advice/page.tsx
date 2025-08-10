// صفحة نصائح البناء التفاعلية الشاملة
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/Progress';
import { constructionGuidanceService } from '@/services';
import type { ConstructionLevel } from '@/services/construction';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  Lightbulb, 
  ArrowUpCircle, 
  Home, 
  Building2, 
  Factory, 
  ChevronLeft, 
  ChevronRight, 
  Calculator, 
  Video, 
  FileText,
  Download,
  Eye,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Clock,
  Users,
  Shield,
  Star,
  Bookmark,
  Hammer,
  Settings,
  Camera,
  BarChart3,
  MapPin,
  ExternalLink,
  TrendingUp
} from 'lucide-react';

export const dynamic = 'force-dynamic'
// Force dynamic rendering to avoid SSG auth context issues


// --- أنواع المشاريع ---
const PROJECT_TYPES = [
  { key: 'residential', labelAr: 'سكني', labelEn: 'Residential', icon: <Home className="inline w-6 h-6 mr-1" /> },
  { key: 'commercial', labelAr: 'تجاري', labelEn: 'Commercial', icon: <Building2 className="inline w-6 h-6 mr-1" /> },
  { key: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial', icon: <Factory className="inline w-6 h-6 mr-1" /> },
];

// --- مراحل البناء ---
const STAGES = [
  { key: 'planning', labelAr: 'مرحلة التخطيط', labelEn: 'Planning Stage' },
  { key: 'design', labelAr: 'مرحلة التصميم', labelEn: 'Design Stage' },
  { key: 'execution', labelAr: 'مرحلة التنفيذ', labelEn: 'Execution Stage' },
  { key: 'handover', labelAr: 'مرحلة التسليم', labelEn: 'Handover Stage' },
];

// --- نصائح المجتمع (موجودة سابقًا) ---
interface Advice {
  id: number;
  text: string;
  author: string;
  upvotes: number;
}
const initialAdvice: Advice[] = [
  { id: 1, text: 'ابدأ بتخطيط ميزانيتك بدقة قبل الشروع في البناء.', author: 'م. أحمد', upvotes: 7 },
  { id: 2, text: 'تأكد من اختيار مقاول موثوق واطلب عروض أسعار من أكثر من جهة.', author: 'م. سارة', upvotes: 5 },
  { id: 3, text: 'راجع كود البناء السعودي وتأكد من مطابقة جميع المخططات.', author: 'م. فهد', upvotes: 3 },
];


// --- PDF Guidance Data ---
interface PDFGuide {
  id: string;
  title: string;
  description: string;
  author: string;
  pages: number;
  downloads: number;
  rating: number;
  category: string;
  fileSize: string;
  officialSource?: boolean;
  previewUrl?: string;
}

const constructionPDFGuides: PDFGuide[] = [
  {
    id: 'sbc-foundations',
    title: 'الكود السعودي للبناء - دليل الأساسات',
    description: 'دليل شامل لتصميم وتنفيذ الأساسات وفقاً للمعايير السعودية',
    author: 'الهيئة السعودية للمواصفات والمقاييس والجودة',
    pages: 156,
    downloads: 12450,
    rating: 4.9,
    category: 'هيكلي',
    fileSize: '12.4 MB',
    officialSource: true,
    previewUrl: '/pdf-previews/sbc-foundations.jpg'
  },
  {
    id: 'residential-permits',
    title: 'دليل استخراج رخص البناء السكنية',
    description: 'خطوات مفصلة لاستخراج رخص البناء للمباني السكنية',
    author: 'وزارة الشؤون البلدية والقروية',
    pages: 89,
    downloads: 8920,
    rating: 4.7,
    category: 'تراخيص',
    fileSize: '8.1 MB',
    officialSource: true
  },
  {
    id: 'electrical-safety',
    title: 'معايير السلامة الكهربائية في المباني',
    description: 'دليل شامل لتنفيذ التمديدات الكهربائية بأمان',
    author: 'الشركة السعودية للكهرباء',
    pages: 124,
    downloads: 6780,
    rating: 4.6,
    category: 'كهرباء',
    fileSize: '9.8 MB',
    officialSource: true
  },
  {
    id: 'green-building',
    title: 'دليل المباني الخضراء والاستدامة',
    description: 'إرشادات لتصميم مباني صديقة للبيئة وموفرة للطاقة',
    author: 'مجلس المباني الخضراء السعودي',
    pages: 98,
    downloads: 5420,
    rating: 4.8,
    category: 'استدامة',
    fileSize: '15.2 MB',
    officialSource: true
  },
  {
    id: 'project-management',
    title: 'إدارة مشاريع البناء الحديثة',
    description: 'أفضل الممارسات في إدارة مشاريع البناء والتشييد',
    author: 'م. خالد الأحمد',
    pages: 67,
    downloads: 4580,
    rating: 4.4,
    category: 'إدارة',
    fileSize: '5.7 MB',
    officialSource: false
  }
];

// --- Enhanced Stage Advice ---
function getStageAdvice(stageKey: string, projectType: string) {
  const guidancePromise = constructionGuidanceService.getConstructionPhases();

  // Await the promise before using .find
  return guidancePromise.then(guidance => {
    const phase = guidance.find((p: any) => p.id === stageKey);
    if (!phase) {
      return {
        title: 'نصائح عامة',
        tips: ['تأكد من جودة العمل', 'اتبع المعايير السعودية', 'استشر خبير إذا لزم الأمر'],
        checklist: ['مراجعة الجودة', 'التأكد من المطابقة', 'توثيق المرحلة'],
        resources: []
      };
    }

    return {
      title: `نصائح مرحلة ${phase.title}`,
      tips: (phase as any).tips || ['اتبع خطة العمل المحددة', 'تأكد من توفر جميع المواد', 'راجع مع المهندس المشرف'],
      checklist: ((phase as any).checkpoints || []).map((checkpoint: any) => checkpoint.name || checkpoint),
      resources: (phase as any).documents || []
    };
  });
}

export default function BuildingAdvicePage() {
  // --- State Management ---
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [projectType, setProjectType] = useState<string | null>('residential');
  const [stageIdx, setStageIdx] = useState(0);
  const [adviceList, setAdviceList] = useState<Advice[]>(initialAdvice);
  const [form, setForm] = useState({ text: '', author: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedPDFs, setBookmarkedPDFs] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side rendering for locale-dependent content
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Consistent number formatting function
  const formatNumber = (num: number): string => {
    if (!isMounted) return num.toString();
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Get construction phases for selected project type
  const [constructionPhases, setConstructionPhases] = useState<ConstructionLevel[]>([]);
  
  useEffect(() => {
    if (projectType) {
      constructionGuidanceService.getConstructionPhases().then((phases: any) => setConstructionPhases(phases));
    }
  }, [projectType]);

  // Filter PDFs by category
  const filteredPDFs = selectedCategory === 'all' 
    ? constructionPDFGuides 
    : constructionPDFGuides.filter(pdf => pdf.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(constructionPDFGuides.map(pdf => pdf.category)))];

  // Toggle bookmark
  const toggleBookmark = (pdfId: string) => {
    setBookmarkedPDFs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pdfId)) {
        newSet.delete(pdfId);
      } else {
        newSet.add(pdfId);
      }
      return newSet;
    });
  };

  // Community advice functions
  const handleUpvote = (id: number) => {
    setAdviceList((prev: Advice[]) => prev.map((a: Advice) => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim() || !form.author.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setAdviceList((prev: Advice[]) => [
        { id: Math.floor(Math.random() * 1000000), text: form.text, author: form.author, upvotes: 0 },
        ...prev,
      ]);
      setForm({ text: '', author: '' });
      setSubmitting(false);
    }, 600);
  };

  // --- محتوى المراحل ---
  const renderStageContent = () => {
    const stage = STAGES[stageIdx];
    if (lang === 'ar') {
      switch (stage.key) {
        case 'planning':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التخطيط</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>تحديد الميزانية بدقة ومراعاة التكاليف الخفية.</li>
                <li>الاطلاع على كود البناء السعودي (SBC) والتأكد من متطلبات الأرض.</li>
                <li>استشارة مهندس مختص قبل اتخاذ أي قرار.</li>
              </ul>
              {/* حاسبة ارتدادات تفاعلية */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Calculator className="w-5 h-5 ml-1" />حاسبة الارتدادات</h4>
                <SetbackCalculator lang="ar" />
              </div>
              {/* قائمة مرجعية */}
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل الأرض مسجلة نظاميًا؟</li>
                  <li>هل تم استخراج كروكي الأرض؟</li>
                  <li>هل تم تحديد نوع المشروع بوضوح؟</li>
                </ul>
              </div>
            </div>
          );
        case 'design':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التصميم</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>الالتزام بمتطلبات كود البناء السعودي للمخططات.</li>
                <li>مراعاة التهوية والإضاءة الطبيعية.</li>
                <li>مراجعة المخططات مع مكتب هندسي معتمد.</li>
              </ul>
              {/* Placeholder: حاسبة مواقف السيارات */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Calculator className="w-5 h-5 ml-1" />حاسبة مواقف السيارات (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل التصميم يحقق متطلبات الارتدادات والارتفاعات؟</li>
                  <li>هل تم توفير مخارج طوارئ حسب الكود؟</li>
                  <li>هل تم مراجعة العزل الحراري والصوتي؟</li>
                </ul>
              </div>
            </div>
          );
        case 'execution':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التنفيذ</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>العمل مع مقاول معتمد ووجود إشراف هندسي دائم.</li>
                <li>الالتزام بجدول زمني واضح ومكتوب.</li>
                <li>توثيق جميع مراحل التنفيذ بالصور والتقارير.</li>
              </ul>
              {/* Placeholder: محاكاة 3D */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><Video className="w-5 h-5 ml-1" />محاكاة ثلاثية الأبعاد (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل تم فحص جودة المواد قبل الاستخدام؟</li>
                  <li>هل تم الالتزام بإجراءات السلامة؟</li>
                  <li>هل تم توثيق التعديلات أثناء التنفيذ؟</li>
                </ul>
              </div>
            </div>
          );
        case 'handover':
          return (
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">نصائح التسليم</h3>
              <ul className="list-disc pr-6 text-right mb-4 text-gray-700">
                <li>إجراء فحص نهائي شامل للمبنى.</li>
                <li>الحصول على شهادة إتمام البناء من البلدية.</li>
                <li>توثيق جميع الضمانات والصيانة الدورية.</li>
              </ul>
              {/* Placeholder: نموذج استلام وتسليم */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-bold mb-2 flex items-center"><FileText className="w-5 h-5 ml-1" />نموذج استلام وتسليم (قريبًا)</h4>
              </div>
              <div className="bg-white border border-blue-100 rounded-lg p-4 mb-2">
                <h5 className="font-bold mb-2">قائمة مرجعية:</h5>
                <ul className="list-check pr-6 text-sm text-gray-600">
                  <li>هل تم استلام جميع الوثائق الرسمية؟</li>
                  <li>هل تم التأكد من عمل جميع الأنظمة (كهرباء، سباكة، إلخ)؟</li>
                  <li>هل تم توثيق الضمانات؟</li>
                </ul>
              </div>
            </div>
          );
        default:
          return null;
      }
    } else {
      // English content (placeholder)
      return <div className="text-center text-gray-500">English version coming soon.</div>;
    }
  };

  // --- مكون حاسبة الارتدادات ---
  function SetbackCalculator({ lang }: { lang: 'ar' | 'en' }) {
    const [landWidth, setLandWidth] = useState('');
    const [landDepth, setLandDepth] = useState('');
    const [frontSetback, setFrontSetback] = useState('');
    const [sideSetback, setSideSetback] = useState('');
    const [rearSetback, setRearSetback] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const handleCalc = () => {
      if (!landWidth || !landDepth || !frontSetback || !sideSetback || !rearSetback) return;
      const w = parseFloat(landWidth), d = parseFloat(landDepth), f = parseFloat(frontSetback), s = parseFloat(sideSetback), r = parseFloat(rearSetback);
      if (isNaN(w) || isNaN(d) || isNaN(f) || isNaN(s) || isNaN(r)) return;
      const buildWidth = w - 2 * s;
      const buildDepth = d - f - r;
      setResult(`${lang === 'ar' ? 'المساحة المتاحة للبناء:' : 'Buildable area:'} ${Math.max(0, buildWidth * buildDepth)} م²`);
    };
    return (
      <div className="flex flex-col md:flex-row md:items-end gap-2 text-sm">
        <input type="number" min="1" placeholder={lang === 'ar' ? 'عرض الأرض (م)' : 'Land width (m)'} value={landWidth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLandWidth(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="1" placeholder={lang === 'ar' ? 'عمق الأرض (م)' : 'Land depth (m)'} value={landDepth} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLandDepth(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد أمامي (م)' : 'Front setback (m)'} value={frontSetback} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFrontSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد جانبي (م)' : 'Side setback (m)'} value={sideSetback} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSideSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <input type="number" min="0" placeholder={lang === 'ar' ? 'ارتداد خلفي (م)' : 'Rear setback (m)'} value={rearSetback} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRearSetback(e.target.value)} className="border rounded p-1 w-28 text-right" />
        <button type="button" onClick={handleCalc} className="bg-blue-600 text-white rounded px-3 py-1 font-bold">{lang === 'ar' ? 'احسب' : 'Calculate'}</button>
        {result && <span className="font-bold text-green-700 ml-2">{result}</span>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link href="/user/dashboard" className="hover:text-blue-600 transition-colors">
            لوحة التحكم
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href="/user/projects" className="hover:text-blue-600 transition-colors">
            المشاريع
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900 font-medium">نصائح البناء</span>
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            نصائح البناء التفاعلية والأدلة الشاملة
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            احصل على نصائح عملية من خبراء البناء وأدلة PDF رسمية لضمان نجاح مشروعك
          </p>
          
          {/* Language Toggle */}
          <div className="flex justify-center mt-4">
            <Button
              variant={lang === 'ar' ? 'default' : 'outline'}
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              size="sm"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="interactive" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              نصائح تفاعلية
            </TabsTrigger>
            <TabsTrigger value="pdf-guides" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              أدلة PDF
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              نصائح المجتمع
            </TabsTrigger>
            <TabsTrigger value="construction-steps" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              خطوات البناء
            </TabsTrigger>
          </TabsList>

          {/* Interactive Advice Tab */}
          <TabsContent value="interactive">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project Type Selection */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    اختر نوع مشروعك
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PROJECT_TYPES.map((type) => (
                      <Button
                        key={type.key}
                        variant={projectType === type.key ? 'default' : 'outline'}
                        onClick={() => setProjectType(type.key)}
                        className="p-6 h-auto flex-col gap-2"
                      >
                        {type.icon}
                        <span className="font-semibold">{type.labelAr}</span>
                        <span className="text-sm opacity-75">{type.labelEn}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Construction Phases */}
              {projectType && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      مراحل البناء
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {constructionPhases.map((phase: ConstructionLevel, index: number) => {
                        const [advice, setAdvice] = React.useState<any>(null);
                        React.useEffect(() => {
                          getStageAdvice(phase.id, projectType).then(setAdvice);
                        }, [phase.id, projectType]);
                        const isActive = index === stageIdx;
                        return (
                          <div key={phase.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`} onClick={() => setStageIdx(index)}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {index + 1}
                              </div>
                              <h3 className="font-semibold">{phase.title}</h3>
                              <Badge variant="outline">{(phase as any).duration || '30'} يوم</Badge>
                            </div>
                            {isActive && advice && (
                              <div className="mt-4 space-y-3">
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    النصائح الأساسية
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                    {advice.tips.map((tip: any, i: number) => (
                                      <li key={i}>{tip}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                    قائمة المراجعة
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {advice.checklist.map((item: any, i: number) => (
                                      <div key={i} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        {item}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Setback Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    حاسبة الارتدادات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SetbackCalculator lang={lang} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PDF Guides Tab */}
          <TabsContent value="pdf-guides">
            <div className="space-y-6">
              {/* Category Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>تصنيف الأدلة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category)}
                        size="sm"
                      >
                        {category === 'all' ? 'جميع الأدلة' : category}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* PDF Guides Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPDFs.map(pdf => (
                  <Card key={pdf.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight mb-2">
                            {pdf.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={pdf.officialSource ? 'default' : 'secondary'}>
                              {pdf.officialSource ? 'رسمي' : 'خبراء'}
                            </Badge>
                            <Badge variant="outline">{pdf.category}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(pdf.id)}
                          className={bookmarkedPDFs.has(pdf.id) ? 'text-yellow-500' : ''}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {pdf.description}
                      </p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {pdf.author}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {pdf.pages} صفحة
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {formatNumber(pdf.downloads)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            {pdf.rating}
                          </div>
                        </div>
                        <div className="text-gray-400">
                          حجم الملف: {pdf.fileSize}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        {pdf.previewUrl && (
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                            <Eye className="w-4 h-4 mr-2" />
                            معاينة
                          </Button>
                        )}
                        <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                          <Download className="w-4 h-4 mr-2" />
                          تحميل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Community Advice Tab */}
          <TabsContent value="community">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add New Advice */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>شارك نصيحتك</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                      name="text"
                      value={form.text}
                      onChange={handleChange}
                      placeholder="اكتب نصيحتك هنا..."
                      className="w-full p-3 border rounded-lg resize-none"
                      rows={4}
                    />
                    <input
                      type="text"
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      placeholder="اسمك"
                      className="w-full p-3 border rounded-lg"
                    />
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full"
                    >
                      {submitting ? 'جاري الإضافة...' : 'إضافة النصيحة'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Advice List */}
              <div className="lg:col-span-2 space-y-4">
                {adviceList.map(advice => (
                  <Card key={advice.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpvote(advice.id)}
                          className="flex-col gap-1 px-3"
                        >
                          <ArrowUpCircle className="w-5 h-5" />
                          <span className="text-xs">{advice.upvotes}</span>
                        </Button>
                        <div className="flex-1">
                          <p className="text-gray-800 mb-2">{advice.text}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>بواسطة: {advice.author}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Construction Steps Tab */}
          <TabsContent value="construction-steps">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  دليل خطوات البناء الشامل
                </CardTitle>
                <p className="text-gray-600">
                  للحصول على دليل مفصل لجميع خطوات البناء مع الوثائق الرسمية
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">
                    دليل شامل لخطوات البناء
                  </h3>
                  <p className="text-gray-600 mb-6">
                    يحتوي على جميع المراحل التفصيلية والوثائق الرسمية المطلوبة
                  </p>
                  <Link href="/construction-data">
                    <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
                      <BookOpen className="w-4 h-4" />
                      عرض الدليل الكامل
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}





