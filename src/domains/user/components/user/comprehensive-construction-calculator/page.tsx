'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/Progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProjectPurchasesWarranties from '@/components/ui/ProjectPurchasesWarranties';
import { projectTrackingService } from '@/services';
import { Project, ProjectEstimation, MaterialEstimation, LightingEstimation } from '@/types/types';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { 
  Calculator, 
  FileText, 
  Lightbulb, 
  Home, 
  Hammer,
  Package,
  PaintBucket,
  Zap,
  Upload,
  Download,
  Eye,
  Grid,
  ChevronLeft,
  Ruler,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  Plus,
  DollarSign,
  Clock,
  TrendingUp,
  Trash2,
  Edit,
  Building,
  MapPin,
  Users,
  Calendar,
  Award,
  Globe,
  Shield,
  ShoppingCart
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Material {
  id: string;
  name: string;
  nameEn: string;
  unit: string;
  category: string;
  standardQuantity: number;
  price: number;
  specifications: string[];
  suppliers: string[];
}

interface LightCalculation {
  roomType: string;
  roomName: string;
  length: number;
  width: number;
  area: number;
  requiredLux: number;
  rowCount: number;
  hiddenLighting: boolean;
  hiddenLightDistance: number;
  firstRowLights: {
    widthCount: number;
    lengthCount: number;
    widthSpacing: number;
    lengthSpacing: number;
    product: string;
  };
  secondRowLights: {
    widthCount: number;
    lengthCount: number;
    widthSpacing: number;
    lengthSpacing: number;
    product: string;
  };
}

interface PDFAnalysis {
  fileName: string;
  extractedData: {
    projectType: string;
    totalArea: number;
    rooms: Array<{
      name: string;
      area: number;
      type: string;
    }>;
    specifications: string[];
    materials: string[];
  };
  calculations: {
    [key: string]: {
      quantity: number;
      unit: string;
      totalCost: number;
    };
  };
}

export default function ComprehensiveConstructionCalculator() {
  const { user, session, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = searchParams?.get('projectId');
  
  const [activeTab, setActiveTab] = useState(projectId ? 'overview' : 'materials');
  const [projectArea, setProjectArea] = useState<number>(200);
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [floorCount, setFloorCount] = useState<number>(1);
  const [roomCount, setRoomCount] = useState<number>(4);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    try {
      const project = await projectTrackingService.getProjectById(projectId);
      if (project) {
        setCurrentProject(project as any);
        // Handle placeholder service structure
        setProjectArea(100); // Default area since placeholder doesn't have it
        setProjectType('residential'); // Default type
        setFloorCount(1); // Default floor count
        setRoomCount(4); // Default room count
        setProjectName(project.name);
        setProjectDescription(project.description || '');
        
        setEditProjectData({
          name: project.name,
          description: project.description || '',
          area: 100, // Default area
          projectType: 'residential', // Default type
          floorCount: 1, // Default floor count
          roomCount: 4, // Default room count
          location: '' // Default location
        });
        
        const summary = await projectTrackingService.calculateProjectSummary(projectId);
        if (summary) {
          setProjectSummary(summary);
        }
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };
  
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projectSummary, setProjectSummary] = useState<any>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    name: '',
    description: '',
    area: 0,
    projectType: 'residential',
    floorCount: 1,
    roomCount: 4,
    location: ''
  });
  
  const [lightCalc, setLightCalc] = useState<LightCalculation>({
    roomType: 'living',
    roomName: '',
    length: 5,
    width: 4,
    area: 20,
    requiredLux: 150,
    rowCount: 2,
    hiddenLighting: false,
    hiddenLightDistance: 30,
    firstRowLights: {
      widthCount: 0,
      lengthCount: 0,
      widthSpacing: 0,
      lengthSpacing: 0,
      product: 'LED-18W'
    },
    secondRowLights: {
      widthCount: 0,
      lengthCount: 0,
      widthSpacing: 0,
      lengthSpacing: 0,
      product: 'LED-24W'
    }
  });

  const [savedRooms, setSavedRooms] = useState<LightCalculation[]>([]);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfAnalysis, setPdfAnalysis] = useState<PDFAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  const [materials] = useState<Material[]>([
    {
      id: 'cement',
      name: 'أسمنت بورتلاند',
      nameEn: 'Portland Cement',
      unit: 'كيس 50كغ',
      category: 'خرسانة',
      standardQuantity: 7.5,
      price: 18,
      specifications: ['مقاومة 42.5N/mm²', 'مطابق للمواصفات السعودية', 'سريع التصلب'],
      suppliers: ['شركة أسمنت الرياض', 'أسمنت اليمامة', 'أسمنت الشرقية']
    },
    {
      id: 'steel',
      name: 'حديد التسليح',
      nameEn: 'Reinforcement Steel',
      unit: 'طن',
      category: 'حديد',
      standardQuantity: 0.18,
      price: 2800,
      specifications: ['درجة 60', 'قطر 8-32 مم', 'مقاوم للصدأ'],
      suppliers: ['حديد السعودية', 'الراجحي للحديد', 'صناعات الحديد المتطورة']
    },
    {
      id: 'blocks',
      name: 'بلوك خرساني',
      nameEn: 'Concrete Blocks',
      unit: 'قطعة',
      category: 'بناء',
      standardQuantity: 15,
      price: 2.5,
      specifications: ['20×20×40 سم', 'مقاومة ضغط 5N/mm²', 'عازل حراري'],
      suppliers: ['مصنع البلوك الحديث', 'شركة الخرسانة السعودية', 'مصانع البناء المتقدمة']
    },
    {
      id: 'tiles',
      name: 'بلاط سيراميك',
      nameEn: 'Ceramic Tiles',
      unit: 'متر مربع',
      category: 'تشطيبات',
      standardQuantity: 1.1,
      price: 45,
      specifications: ['60×60 سم', 'مقاوم للماء', 'مضاد للانزلاق'],
      suppliers: ['الجوهرة للسيراميك', 'شركة السيراميك السعودية', 'مصانع الفخار الحديثة']
    },
    {
      id: 'paint',
      name: 'دهان أكريليك',
      nameEn: 'Acrylic Paint',
      unit: 'جالون 4 لتر',
      category: 'دهانات',
      standardQuantity: 0.15,
      price: 120,
      specifications: ['مقاوم للطقس', 'سهل التنظيف', 'متوفر بجميع الألوان'],
      suppliers: ['دهانات الجزيرة', 'شركة الدهانات السعودية', 'بويات ناشيونال']
    },
    {
      id: 'sand',
      name: 'رمل بناء',
      nameEn: 'Construction Sand',
      unit: 'متر مكعب',
      category: 'خرسانة',
      standardQuantity: 0.5,
      price: 35,
      specifications: ['مغسول ومنخل', 'خالي من الشوائب', 'حبيبات متوسطة'],
      suppliers: ['محاجر الرياض', 'شركة الرمل المتخصصة', 'مقاولو الحفر والردم']
    },
    {
      id: 'gravel',
      name: 'حصى مدرج',
      nameEn: 'Graded Gravel',
      unit: 'متر مكعب',
      category: 'خرسانة',
      standardQuantity: 0.7,
      price: 40,
      specifications: ['مدرج 5-20 مم', 'نظيف ومغسول', 'مقاوم للتآكل'],
      suppliers: ['محاجر الشرقية', 'شركة الحصى السعودية', 'مصانع الخرسانة الجاهزة']
    },
    {
      id: 'insulation',
      name: 'عازل حراري',
      nameEn: 'Thermal Insulation',
      unit: 'متر مربع',
      category: 'عزل',
      standardQuantity: 1.0,
      price: 25,
      specifications: ['سماكة 5 سم', 'مقاوم للحريق', 'صديق للبيئة'],
      suppliers: ['شركة العزل المتطور', 'مصانع العزل الحراري', 'تقنيات البناء الحديثة']
    }
  ]);

  const [calculatedMaterials, setCalculatedMaterials] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

  const roomTypes = [
    { value: 'living', label: 'صالة معيشة', lux: 150 },
    { value: 'bedroom', label: 'غرفة نوم', lux: 100 },
    { value: 'kitchen', label: 'مطبخ', lux: 300 },
    { value: 'bathroom', label: 'حمام', lux: 200 },
    { value: 'office', label: 'مكتب', lux: 500 },
    { value: 'dining', label: 'غرفة طعام', lux: 150 },
    { value: 'corridor', label: 'ممر', lux: 75 }
  ];

  const lightProducts = [
    { value: 'LED-9W', label: 'LED 9W - 900 لومن', lumens: 900, price: 45 },
    { value: 'LED-12W', label: 'LED 12W - 1200 لومن', lumens: 1200, price: 60 },
    { value: 'LED-18W', label: 'LED 18W - 1800 لومن', lumens: 1800, price: 85 },
    { value: 'LED-24W', label: 'LED 24W - 2400 لومن', lumens: 2400, price: 110 },
    { value: 'LED-36W', label: 'LED 36W - 3600 لومن', lumens: 3600, price: 150 }
  ];

interface UnifiedMaterial {
  id: string;
  name: string;
  nameEn: string;
  quantity: number;
  unit: string;
  category: string;
  categoryAr: string;
  description: string;
  totalCost: number;
  purchased?: number;
  remaining?: number;
  remainingCost?: number;
}

interface UnifiedMaterialsMap {
  [key: string]: UnifiedMaterial;
}

  const calculateUnifiedMaterials = (area: number, projectType: 'residential' | 'commercial' | 'industrial' = 'residential', floorCount: number = 1): UnifiedMaterialsMap => {
    const baseCalculations = {
      'concrete': {
        name: 'خرسانة',
        nameEn: 'concrete',
        quantityPerSqm: 0.3,
        unitPrice: 350,
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'أساسات',
        description: 'خرسانة للأساسات والأعمدة والسقف'
      },
      'steel': {
        name: 'حديد التسليح',
        nameEn: 'steel',
        quantityPerSqm: 120,
        unitPrice: 4.5,
        unit: 'كيلوجرام',
        category: 'structure',
        categoryAr: 'هيكل',
        description: 'حديد التسليح للمنشأ'
      },
      'cement': {
        name: 'إسمنت بورتلاند',
        nameEn: 'cement',
        quantityPerSqm: 2,
        unitPrice: 18,
        unit: 'كيس 50كغ',
        category: 'foundation',
        categoryAr: 'أساسات',
        description: 'إسمنت بورتلاندي للبناء'
      },
      'blocks': {
        name: 'بلوك خرساني',
        nameEn: 'blocks',
        quantityPerSqm: 45,
        unitPrice: 3.5,
        unit: 'قطعة',
        category: 'structure',
        categoryAr: 'بناء',
        description: 'بلوك خرساني للجدران'
      },
      'sand': {
        name: 'رمل بناء',
        nameEn: 'sand',
        quantityPerSqm: 0.5,
        unitPrice: 80,
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'خرسانة',
        description: 'رمل للملاط والخرسانة'
      },
      'gravel': {
        name: 'حصى مدرج',
        nameEn: 'gravel',
        quantityPerSqm: 0.4,
        unitPrice: 90,
        unit: 'متر مكعب',
        category: 'foundation',
        categoryAr: 'خرسانة',
        description: 'حصى للخرسانة والأساسات'
      },
      'tiles': {
        name: 'بلاط سيراميك',
        nameEn: 'tiles',
        quantityPerSqm: 1.1,
        unitPrice: 45,
        unit: 'متر مربع',
        category: 'finishing',
        categoryAr: 'تشطيبات',
        description: 'بلاط للأرضيات'
      },
      'paint': {
        name: 'دهان أكريليك',
        nameEn: 'paint',
        quantityPerSqm: 0.5,
        unitPrice: 80,
        unit: 'جالون 4 لتر',
        category: 'finishing',
        categoryAr: 'دهانات',
        description: 'دهان للجدران الداخلية والخارجية'
      }
    };

    const calculatedMaterials: UnifiedMaterialsMap = {};
    
    Object.entries(baseCalculations).forEach(([key, material]) => {
      let quantity = Math.ceil(area * material.quantityPerSqm);
      if (['concrete', 'steel', 'cement'].includes(key)) {
        quantity = quantity * floorCount;
      }
      let typeMultiplier = 1;
      if (projectType === 'commercial') {
        typeMultiplier = 1.3;
      } else if (projectType === 'industrial') {
        typeMultiplier = 1.5;
      }
      quantity = Math.ceil(quantity * typeMultiplier);
      const totalCost = quantity * material.unitPrice;
      calculatedMaterials[key] = {
        id: key,
        name: material.name,
        nameEn: material.nameEn,
        quantity: quantity,
        unit: material.unit,
        category: material.category,
        categoryAr: material.categoryAr,
        description: material.description,
        totalCost: totalCost,
        purchased: 0,
        remaining: quantity,
        remainingCost: totalCost
      };
    });

    return calculatedMaterials;
  };

  const calculateMaterials = () => {
    const area = projectArea || 0;
    const type = projectType;
    const floors = floorCount || 1;
    const unifiedMaterialsData = calculateUnifiedMaterials(area, type, floors);
    const calculated = Object.values(unifiedMaterialsData).map((material, index) => ({
      ...materials[index],
      id: material.id,
      name: material.name,
      calculatedQuantity: material.quantity,
      totalCost: material.totalCost,
      formattedCost: formatNumber(material.totalCost),
      unit: material.unit,
      category: material.category,
      description: material.description
    }));

    setCalculatedMaterials(calculated);
    setTotalCost(calculated.reduce((sum, material) => sum + (material.totalCost || 0), 0));
  };

  const calculateLighting = () => {
    const area = lightCalc.length * lightCalc.width;
    const roomTypeData = roomTypes.find(rt => rt.value === lightCalc.roomType);
    const requiredLux = roomTypeData?.lux || 150;
    const firstRowProduct = lightProducts.find(p => p.value === lightCalc.firstRowLights.product);
    const secondRowProduct = lightProducts.find(p => p.value === lightCalc.secondRowLights.product);
    const totalLumensNeeded = area * requiredLux;
    const firstRowLumens = firstRowProduct?.lumens || 1800;
    const secondRowLumens = secondRowProduct?.lumens || 2400;
    const firstRowCount = Math.ceil(totalLumensNeeded * 0.6 / firstRowLumens);
    const secondRowCount = Math.ceil(totalLumensNeeded * 0.4 / secondRowLumens);
    const firstRowWidthCount = Math.ceil(Math.sqrt(firstRowCount * (lightCalc.width / lightCalc.length)));
    const firstRowLengthCount = Math.ceil(firstRowCount / firstRowWidthCount);
    const firstRowWidthSpacing = lightCalc.width / (firstRowWidthCount + 1);
    const firstRowLengthSpacing = lightCalc.length / (firstRowLengthCount + 1);
    const secondRowWidthCount = Math.ceil(Math.sqrt(secondRowCount * (lightCalc.width / lightCalc.length)));
    const secondRowLengthCount = Math.ceil(secondRowCount / secondRowWidthCount);
    const secondRowWidthSpacing = lightCalc.width / (secondRowWidthCount + 1);
    const secondRowLengthSpacing = lightCalc.length / (secondRowLengthCount + 1);

    setLightCalc(prev => ({
      ...prev,
      area,
      requiredLux,
      firstRowLights: {
        ...prev.firstRowLights,
        widthCount: firstRowWidthCount,
        lengthCount: firstRowLengthCount,
        widthSpacing: Number(firstRowWidthSpacing.toFixed(2)),
        lengthSpacing: Number(firstRowLengthSpacing.toFixed(2))
      },
      secondRowLights: {
        ...prev.secondRowLights,
        widthCount: secondRowWidthCount,
        lengthCount: secondRowLengthCount,
        widthSpacing: Number(secondRowWidthSpacing.toFixed(2)),
        lengthSpacing: Number(secondRowLengthSpacing.toFixed(2))
      }
    }));
  };

  const saveCurrentRoom = () => {
    if (!lightCalc.roomName.trim()) {
      alert('يرجى إدخال اسم الغرفة');
      return;
    }
    const existingRoomIndex = savedRooms.findIndex(room => room.roomName === lightCalc.roomName);
    if (existingRoomIndex !== -1) {
      const updatedRooms = [...savedRooms];
      updatedRooms[existingRoomIndex] = { ...lightCalc };
      setSavedRooms(updatedRooms);
      alert('تم تحديث بيانات الغرفة بنجاح');
    } else {
      setSavedRooms(prev => [...prev, { ...lightCalc }]);
      alert('تم حفظ الغرفة بنجاح');
    }
    setLightCalc(prev => ({
      ...prev,
      roomName: '',
      length: 5,
      width: 4
    }));
  };

  const deleteSavedRoom = (roomName: string) => {
    setSavedRooms(prev => prev.filter(room => room.roomName !== roomName));
    alert('تم حذف الغرفة بنجاح');
  };

  const loadSavedRoom = (room: LightCalculation) => {
    setLightCalc({ ...room });
  };

  const getTotalLightingCost = () => {
    return savedRooms.reduce((total, room) => {
      const firstRowProduct = lightProducts.find(p => p.value === room.firstRowLights.product);
      const secondRowProduct = lightProducts.find(p => p.value === room.secondRowLights.product);
      const firstRowCost = (room.firstRowLights.widthCount * room.firstRowLights.lengthCount) * (firstRowProduct?.price || 0);
      const secondRowCost = (room.secondRowLights.widthCount * room.secondRowLights.lengthCount) * (secondRowProduct?.price || 0);
      return total + firstRowCost + secondRowCost;
    }, 0);
  };

  const analyzePDF = async (file: File) => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const mockAnalysis: PDFAnalysis = {
      fileName: file.name,
      extractedData: {
        projectType: 'فيلا سكنية',
        totalArea: 350,
        rooms: [
          { name: 'صالة رئيسية', area: 60, type: 'living' },
          { name: 'غرفة نوم ماستر', area: 40, type: 'bedroom' },
          { name: 'غرفة نوم أطفال', area: 25, type: 'bedroom' },
          { name: 'مطبخ', area: 20, type: 'kitchen' },
          { name: 'حمام رئيسي', area: 12, type: 'bathroom' }
        ],
        specifications: [
          'أساسات خرسانية مسلحة',
          'جدران بلوك خرساني',
          'عزل حراري ومائي',
          'تشطيبات راقية'
        ],
        materials: [
          'خرسانة مسلحة للأساسات',
          'بلوك خرساني للجدران',
          'حديد تسليح درجة 60',
          'عوازل حرارية ومائية',
          'بلاط سيراميك للأرضيات',
          'دهانات أكريليك للجدران'
        ]
      },
      calculations: {
        'أسمنت بورتلاند': { quantity: 280, unit: 'كيس 50كغ', totalCost: 5040 },
        'حديد التسليح': { quantity: 42, unit: 'طن', totalCost: 117600 },
        'بلوك خرساني': { quantity: 4200, unit: 'قطعة', totalCost: 10500 },
        'بلاط سيراميك': { quantity: 385, unit: 'متر مربع', totalCost: 17325 },
        'دهان أكريليك': { quantity: 53, unit: 'جالون 4 لتر', totalCost: 6360 }
      }
    };
    setPdfAnalysis(mockAnalysis);
    setAnalyzing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      analyzePDF(file);
    }
  };

  const handleSaveProject = async () => {
    if (!currentProject) return;
    try {
      // Map any custom projectType to allowed values
      let mappedProjectType: 'residential' | 'commercial' | 'industrial' = 'residential';
      if (['residential', 'commercial', 'industrial'].includes(editProjectData.projectType)) {
        mappedProjectType = editProjectData.projectType as 'residential' | 'commercial' | 'industrial';
      } else if (['villa', 'apartment', 'house', 'flat'].includes(editProjectData.projectType)) {
        mappedProjectType = 'residential';
      } else if (['shop', 'mall', 'office'].includes(editProjectData.projectType)) {
        mappedProjectType = 'commercial';
      } else if (['factory', 'warehouse'].includes(editProjectData.projectType)) {
        mappedProjectType = 'industrial';
      }
      const updatedProject = {
        ...currentProject,
        name: editProjectData.name,
        description: editProjectData.description,
        area: editProjectData.area,
        projectType: mappedProjectType,
        floorCount: editProjectData.floorCount,
        roomCount: editProjectData.roomCount,
        location: editProjectData.location,
        updatedAt: new Date().toISOString()
      };
      await projectTrackingService.saveProject(updatedProject);
      setCurrentProject(updatedProject);
      setProjectName(editProjectData.name);
      setProjectDescription(editProjectData.description);
      setProjectArea(editProjectData.area);
      setProjectType(mappedProjectType);
      setFloorCount(editProjectData.floorCount);
      setRoomCount(editProjectData.roomCount);
      setIsEditingProject(false);
      alert('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('حدث خطأ أثناء حفظ التغييرات');
    }
  };

  const [isEstimating, setIsEstimating] = useState(false);

  const saveEstimationToProject = async () => {
    setIsEstimating(true);
    try {
      let targetProjectId = projectId;
      if (!projectId && projectName) {
        // Map any custom projectType to allowed values for new project creation
        let mappedProjectType: 'residential' | 'commercial' | 'industrial' = 'residential';
        if (['residential', 'commercial', 'industrial'].includes(projectType)) {
          mappedProjectType = projectType as 'residential' | 'commercial' | 'industrial';
        } else if (['villa', 'apartment', 'house', 'flat'].includes(projectType)) {
          mappedProjectType = 'residential';
        } else if (['shop', 'mall', 'office'].includes(projectType)) {
          mappedProjectType = 'commercial';
        } else if (['factory', 'warehouse'].includes(projectType)) {
          mappedProjectType = 'industrial';
        }
        const newProject: Project = {
          id: Date.now().toString(),
          name: projectName,
          userId: 'current-user', // TODO: Get actual user ID
          description: projectDescription,
          area: projectArea,
          projectType: mappedProjectType,
          floorCount,
          roomCount,
          stage: 'تخطيط',
          progress: 0,
          status: 'planning',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await projectTrackingService.saveProject(newProject);
        setCurrentProject(newProject);
        targetProjectId = newProject.id;
      }
      if (!targetProjectId) {
        alert('يرجى إدخال اسم المشروع');
        return;
      }
      const materialEstimations: MaterialEstimation[] = calculatedMaterials.map(material => ({
        materialId: material.id,
        materialName: material.name,
        materialNameEn: material.nameEn,
        category: material.category,
        estimatedQuantity: material.calculatedQuantity,
        unit: material.unit,
        pricePerUnit: material.price,
        totalCost: material.totalCost,
        specifications: material.specifications,
        suppliers: material.suppliers,
        priority: 'medium',
        phase: getCategoryPhase(material.category)
      }));

      const lightingEstimations: LightingEstimation[] = [];
      if (lightCalc.length > 0 && lightCalc.width > 0) {
        const area = lightCalc.length * lightCalc.width;
        const roomTypeData = roomTypes.find(rt => rt.value === lightCalc.roomType);
        const firstRowProduct = lightProducts.find(p => p.value === lightCalc.firstRowLights.product);
        const secondRowProduct = lightProducts.find(p => p.value === lightCalc.secondRowLights.product);
        const lightingEstimation: LightingEstimation = {
          roomName: lightCalc.roomName || 'غرفة',
          roomType: lightCalc.roomType,
          area: area,
          requiredLux: roomTypeData?.lux || 150,
          fixtures: [
            {
              type: lightCalc.firstRowLights.product,
              quantity: lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount,
              pricePerUnit: firstRowProduct?.price || 0,
              totalCost: (lightCalc.firstRowLights.widthCount * lightCalc.firstRowLights.lengthCount) * (firstRowProduct?.price || 0)
            },
            {
              type: lightCalc.secondRowLights.product,
              quantity: lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount,
              pricePerUnit: secondRowProduct?.price || 0,
              totalCost: (lightCalc.secondRowLights.widthCount * lightCalc.secondRowLights.lengthCount) * (secondRowProduct?.price || 0)
            }
          ],
          totalCost: 0
        };
        lightingEstimation.totalCost = lightingEstimation.fixtures.reduce((sum, fixture) => sum + fixture.totalCost, 0);
        lightingEstimations.push(lightingEstimation);
      }
      const totalLightingCost = lightingEstimations.reduce((sum, lighting) => sum + lighting.totalCost, 0);
      const estimation: ProjectEstimation = {
        id: Date.now().toString(),
        projectId: targetProjectId,
        calculatorType: 'comprehensive',
        createdAt: new Date().toISOString(),
        materials: materialEstimations,
        lighting: lightingEstimations,
        totalCost: totalCost + totalLightingCost,
        phases: {
          foundation: materialEstimations.filter(m => m.phase === 'foundation').reduce((sum, m) => sum + m.totalCost, 0),
          structure: materialEstimations.filter(m => m.phase === 'structure').reduce((sum, m) => sum + m.totalCost, 0),
          finishing: materialEstimations.filter(m => m.phase === 'finishing').reduce((sum, m) => sum + m.totalCost, 0),
          electrical: materialEstimations.filter(m => m.phase === 'electrical').reduce((sum, m) => sum + m.totalCost, 0) + totalLightingCost,
          plumbing: materialEstimations.filter(m => m.phase === 'plumbing').reduce((sum, m) => sum + m.totalCost, 0)
        }
      };
      await projectTrackingService.saveEstimation(estimation);
      alert('تم حفظ التقدير بنجاح!');
      setShowSaveDialog(false);
      router.push('/user/projects/list');
    } catch (error) {
      console.error('Error saving estimation:', error);
      alert('حدث خطأ أثناء حفظ التقدير');
    } finally {
      setIsEstimating(false);
    }
  };

  const getCategoryPhase = (category: string): 'foundation' | 'structure' | 'finishing' | 'electrical' | 'plumbing' => {
    switch (category) {
      case 'خرسانة':
      case 'حديد':
        return 'foundation';
      case 'بناء':
        return 'structure';
      case 'تشطيبات':
      case 'دهانات':
        return 'finishing';
      case 'كهرباء':
      case 'إضاءة':
        return 'electrical';
      case 'سباكة':
        return 'plumbing';
      default:
        return 'structure';
    }
  };

  const generateAndDownloadPDF = () => {
    try {
      const reportData = {
        projectInfo: {
          name: projectName || `مشروع ${projectType}`,
          area: projectArea,
          type: projectType,
          floors: floorCount,
          rooms: roomCount,
          date: new Date().toLocaleDateString('en-US')
        },
        materials: calculatedMaterials,
        totalCost,
        lightingCalculation: lightCalc,
        pdfAnalysis
      };
      const reportContent = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير-مشروع-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('تم تحميل التقرير بنجاح!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };

  const previewReport = () => {
    try {
      const reportData = {
        projectInfo: {
          name: projectName || `مشروع ${projectType}`,
          area: projectArea,
          type: projectType,
          floors: floorCount,
          rooms: roomCount,
          date: new Date().toLocaleDateString('en-US')
        },
        materials: calculatedMaterials,
        totalCost,
        lightingCalculation: lightCalc,
        pdfAnalysis
      };
      const htmlContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>معاينة تقرير المشروع</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; direction: rtl; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
            .cost { color: #059669; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: right; }
            th { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تقرير المشروع الشامل</h1>
            <p>تاريخ الإنشاء: ${new Date().toLocaleDateString('en-US')}</p>
          </div>
          
          <div class="section">
            <h2>معلومات المشروع</h2>
            <p><strong>اسم المشروع:</strong> ${reportData.projectInfo.name}</p>
            <p><strong>المساحة:</strong> ${reportData.projectInfo.area} متر مربع</p>
            <p><strong>نوع المشروع:</strong> ${reportData.projectInfo.type}</p>
            <p><strong>عدد الطوابق:</strong> ${reportData.projectInfo.floors}</p>
            <p><strong>عدد الغرف:</strong> ${reportData.projectInfo.rooms}</p>
          </div>

          <div class="section">
            <h2>تفاصيل المواد والتكاليف</h2>
            <table>
              <thead>
                <tr>
                  <th>المادة</th>
                  <th>الكمية</th>
                  <th>الوحدة</th>
                  <th>التكلفة الإجمالية</th>
                </tr>
              </thead>
              <tbody>
                ${calculatedMaterials.map(material => `
                  <tr>
                    <td>${material.name}</td>
                    <td>${material.calculatedQuantity}</td>
                    <td>${material.unit}</td>
                    <td class="cost">${material.formattedCost} ريال</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <p style="text-align: center; font-size: 18px; margin-top: 20px;">
              <strong>إجمالي التكلفة: <span class="cost">${formatNumber(totalCost)} ريال سعودي</span></strong>
            </p>
          </div>
        </body>
        </html>
      `;

      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      } else {
        alert('يرجى السماح بفتح النوافذ المنبثقة لعرض التقرير');
      }
    } catch (error) {
      console.error('Error previewing report:', error);
      alert('حدث خطأ في معاينة التقرير');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        {/* ...rest of the UI code for all tabs and dialog (no changes needed for the JSX wrapper)... */}
        {/* If you need the rest of the UI code, use the code you posted originally, but ensure that 
            every <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> has a corresponding closing </div> */}
      </div>
    </div>
  );
}




