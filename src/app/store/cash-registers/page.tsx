'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  CreditCard, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Save,
  Calendar,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Users,
  Navigation,
  Info,
  BarChart3,
  Activity,
  Building,
  Banknote,
  PiggyBank,
  Calculator,
  History,
  Settings,
  Printer,
  Database
} from 'lucide-react';
import { toast } from 'sonner';
import { CustomerSearchWidget, CustomerDetailModal, type Customer } from '@/components/store/CustomerSearchWidget';

interface CashRegister {
  id?: string;
  register_name: string;
  location_id: string;
  location_name: string;
  is_active: boolean;
  opening_balance: number;
  current_balance: number;
  expected_balance: number;
  status: 'closed' | 'open' | 'suspended';
  opened_by?: string;
  opened_at?: string;
  closed_by?: string;
  closed_at?: string;
  created_at: string;
  updated_at: string;
}

interface CashSession {
  id?: string;
  register_id: string;
  session_number: string;
  opening_balance: number;
  closing_balance?: number;
  expected_balance: number;
  variance: number;
  total_sales: number;
  total_cash_sales: number;
  total_card_sales: number;
  total_refunds: number;
  cash_additions: number;
  cash_withdrawals: number;
  opened_by: string;
  opened_at: string;
  closed_by?: string;
  closed_at?: string;
  notes?: string;
  status: 'active' | 'closed' | 'reconciled';
}

interface CashTransaction {
  id?: string;
  session_id: string;
  register_id: string;
  transaction_type: 'sale' | 'refund' | 'addition' | 'withdrawal' | 'opening' | 'closing';
  amount: number;
  payment_method: 'cash' | 'card' | 'transfer';
  reference_number?: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export default function CashRegisterManagement() {
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [sessions, setSessions] = useState<CashSession[]>([]);
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [selectedRegister, setSelectedRegister] = useState<CashRegister | null>(null);
  const [selectedSession, setSelectedSession] = useState<CashSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [openingAmount, setOpeningAmount] = useState(0);
  const [closingAmount, setClosingAmount] = useState(0);
  const [additionAmount, setAdditionAmount] = useState(0);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);
  const [transactionReason, setTransactionReason] = useState('');
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  
  // Customer search functionality for transaction tracking
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [customerDetailData, setCustomerDetailData] = useState<Customer | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadCashRegisters();
    loadActiveSessions();
  }, []);

  // Customer handling functions
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`تم اختيار العميل: ${customer.name} للمعاملة`);
  };

  const handleShowCustomerDetails = (customer: Customer) => {
    setCustomerDetailData(customer);
    setShowCustomerDetail(true);
  };

  const clearCustomerSelection = () => {
    setSelectedCustomer(null);
  };

  const loadCashRegisters = async () => {
    try {
      setLoading(true);
      
      // Try to load from Supabase
      const { data, error } = await supabase
        .from('cash_registers')
        .select(`
          *,
          location:locations(name)
        `)
        .order('register_name');

      if (error) {
        console.warn('Database error loading cash registers:', error);
        // Fall back to mock data if database isn't available
                setRegisters([]);
        toast.info('تم تحميل بيانات تجريبية لصناديق النقد');
        return;
      }
      
      setRegisters(data || []);
    } catch (error) {
      console.error('Error loading cash registers:', error);
      // Provide fallback data
      const fallbackRegisters: CashRegister[] = [
        {
          id: '1',
          register_name: 'الصندوق الرئيسي',
          location_id: 'main',
          location_name: 'الفرع الرئيسي',
          is_active: true,
          opening_balance: 0,
          current_balance: 0,
          expected_balance: 0,
          status: 'closed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setRegisters(fallbackRegisters);
      toast.error('خطأ في تحميل صناديق النقد - تم تحميل بيانات افتراضية');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('cash_sessions')
        .select('*')
        .eq('status', 'active')
        .order('opened_at', { ascending: false });

      if (error) {
        console.warn('Database error loading sessions:', error);
        // Fall back to mock data if database isn't available
                setSessions([]);
        toast.info('تم تحميل بيانات تجريبية للجلسات');
        return;
      }
      
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      // Provide fallback data
      setSessions([]);
      toast.error('خطأ في تحميل جلسات النقد - لا توجد جلسات نشطة');
    }
  };

  const loadSessionTransactions = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('cash_transactions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('خطأ في تحميل معاملات النقد');
    }
  };

  const openCashRegister = async () => {
    if (!selectedRegister || openingAmount < 0) {
      toast.error('يرجى اختيار صندوق نقد وإدخال مبلغ الافتتاح');
      return;
    }

    try {
      setLoading(true);

      // Create new cash session
      const sessionNumber = `SESSION-${Date.now()}`;
      const { data: sessionData, error: sessionError } = await supabase
        .from('cash_sessions')
        .insert({
          register_id: selectedRegister.id,
          session_number: sessionNumber,
          opening_balance: openingAmount,
          expected_balance: openingAmount,
          total_sales: 0,
          total_cash_sales: 0,
          total_card_sales: 0,
          total_refunds: 0,
          cash_additions: 0,
          cash_withdrawals: 0,
          variance: 0,
          opened_by: 'current_user_id', // This should come from auth context
          opened_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create opening transaction
      await supabase
        .from('cash_transactions')
        .insert({
          session_id: sessionData.id,
          register_id: selectedRegister.id,
          transaction_type: 'opening',
          amount: openingAmount,
          payment_method: 'cash',
          description: 'فتح صندوق النقد',
          created_by: 'current_user_id',
          created_at: new Date().toISOString()
        });

      // Update register status
      await supabase
        .from('cash_registers')
        .update({
          status: 'open',
          current_balance: openingAmount,
          expected_balance: openingAmount,
          opened_by: 'current_user_id',
          opened_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRegister.id);

      toast.success('تم فتح صندوق النقد بنجاح');
      setShowOpenDialog(false);
      setOpeningAmount(0);
      await loadCashRegisters();
      await loadActiveSessions();

    } catch (error) {
      console.error('Error opening cash register:', error);
      toast.error('خطأ في فتح صندوق النقد');
    } finally {
      setLoading(false);
    }
  };

  const closeCashRegister = async () => {
    if (!selectedRegister || !selectedSession || closingAmount < 0) {
      toast.error('يرجى إدخال مبلغ الإقفال');
      return;
    }

    try {
      setLoading(true);

      const variance = closingAmount - selectedSession.expected_balance;

      // Create closing transaction
      await supabase
        .from('cash_transactions')
        .insert({
          session_id: selectedSession.id,
          register_id: selectedRegister.id,
          transaction_type: 'closing',
          amount: closingAmount,
          payment_method: 'cash',
          description: `إقفال صندوق النقد - التباين: ${variance.toFixed(2)} ريال`,
          created_by: 'current_user_id',
          created_at: new Date().toISOString()
        });

      // Update session
      await supabase
        .from('cash_sessions')
        .update({
          closing_balance: closingAmount,
          variance: variance,
          closed_by: 'current_user_id',
          closed_at: new Date().toISOString(),
          status: 'closed'
        })
        .eq('id', selectedSession.id);

      // Update register status
      await supabase
        .from('cash_registers')
        .update({
          status: 'closed',
          current_balance: closingAmount,
          closed_by: 'current_user_id',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRegister.id);

      toast.success('تم إقفال صندوق النقد بنجاح');
      setShowCloseDialog(false);
      setClosingAmount(0);
      setSelectedSession(null);
      await loadCashRegisters();
      await loadActiveSessions();

    } catch (error) {
      console.error('Error closing cash register:', error);
      toast.error('خطأ في إقفال صندوق النقد');
    } finally {
      setLoading(false);
    }
  };

  const addCashToRegister = async () => {
    if (!selectedRegister || !selectedSession || additionAmount <= 0) {
      toast.error('يرجى إدخال مبلغ الإضافة والسبب');
      return;
    }

    try {
      setLoading(true);

      // Create addition transaction
      await supabase
        .from('cash_transactions')
        .insert({
          session_id: selectedSession.id,
          register_id: selectedRegister.id,
          transaction_type: 'addition',
          amount: additionAmount,
          payment_method: 'cash',
          description: transactionReason,
          created_by: 'current_user_id',
          created_at: new Date().toISOString()
        });

      // Update session
      const newExpectedBalance = selectedSession.expected_balance + additionAmount;
      const newCashAdditions = selectedSession.cash_additions + additionAmount;

      await supabase
        .from('cash_sessions')
        .update({
          expected_balance: newExpectedBalance,
          cash_additions: newCashAdditions
        })
        .eq('id', selectedSession.id);

      // Update register
      await supabase
        .from('cash_registers')
        .update({
          current_balance: selectedRegister.current_balance + additionAmount,
          expected_balance: newExpectedBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRegister.id);

      toast.success('تم إضافة المبلغ بنجاح');
      setShowAddDialog(false);
      setAdditionAmount(0);
      setTransactionReason('');
      await loadCashRegisters();
      await loadActiveSessions();

    } catch (error) {
      console.error('Error adding cash:', error);
      toast.error('خطأ في إضافة المبلغ');
    } finally {
      setLoading(false);
    }
  };

  const withdrawCashFromRegister = async () => {
    if (!selectedRegister || !selectedSession || withdrawalAmount <= 0) {
      toast.error('يرجى إدخال مبلغ السحب والسبب');
      return;
    }

    if (withdrawalAmount > selectedSession.expected_balance) {
      toast.error('مبلغ السحب أكبر من الرصيد المتوقع');
      return;
    }

    try {
      setLoading(true);

      // Create withdrawal transaction
      await supabase
        .from('cash_transactions')
        .insert({
          session_id: selectedSession.id,
          register_id: selectedRegister.id,
          transaction_type: 'withdrawal',
          amount: withdrawalAmount,
          payment_method: 'cash',
          description: transactionReason,
          created_by: 'current_user_id',
          created_at: new Date().toISOString()
        });

      // Update session
      const newExpectedBalance = selectedSession.expected_balance - withdrawalAmount;
      const newCashWithdrawals = selectedSession.cash_withdrawals + withdrawalAmount;

      await supabase
        .from('cash_sessions')
        .update({
          expected_balance: newExpectedBalance,
          cash_withdrawals: newCashWithdrawals
        })
        .eq('id', selectedSession.id);

      // Update register
      await supabase
        .from('cash_registers')
        .update({
          current_balance: selectedRegister.current_balance - withdrawalAmount,
          expected_balance: newExpectedBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRegister.id);

      toast.success('تم سحب المبلغ بنجاح');
      setShowWithdrawDialog(false);
      setWithdrawalAmount(0);
      setTransactionReason('');
      await loadCashRegisters();
      await loadActiveSessions();

    } catch (error) {
      console.error('Error withdrawing cash:', error);
      toast.error('خطأ في سحب المبلغ');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      open: { label: 'مفتوح', color: 'bg-green-100 text-green-800', icon: Unlock },
      closed: { label: 'مغلق', color: 'bg-red-100 text-red-800', icon: Lock },
      suspended: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800', icon: Clock }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.closed;
    const Icon = statusInfo.icon;
    
    return (
      <Badge className={`${statusInfo.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getTransactionTypeLabel = (type: string) => {
    const typeMap = {
      sale: 'مبيعات',
      refund: 'استرداد',
      addition: 'إضافة نقد',
      withdrawal: 'سحب نقد',
      opening: 'فتح الصندوق',
      closing: 'إغلاق الصندوق'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getTransactionIcon = (type: string) => {
    const iconMap = {
      sale: { icon: TrendingUp, color: 'text-green-600' },
      refund: { icon: TrendingDown, color: 'text-red-600' },
      addition: { icon: Plus, color: 'text-blue-600' },
      withdrawal: { icon: TrendingDown, color: 'text-orange-600' },
      opening: { icon: Unlock, color: 'text-green-600' },
      closing: { icon: Lock, color: 'text-gray-600' }
    };
    return iconMap[type as keyof typeof iconMap] || { icon: DollarSign, color: 'text-gray-600' };
  };

  const activeSession = sessions.find(session => session.register_id === selectedRegister?.id);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة صناديق النقد المتقدمة</h1>
          <p className="text-gray-600">فتح وإغلاق صناديق النقد وتتبع المعاملات النقدية مع ربط العملاء</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowCustomerSearch(!showCustomerSearch)}
            className={showCustomerSearch ? 'bg-blue-50 text-blue-700' : ''}
          >
            <Users className="h-4 w-4 mr-2" />
            ربط عميل
          </Button>
          <Button variant="outline">
            <Database className="h-4 w-4 mr-2" />
            تقرير يومي
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            صندوق جديد
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الصناديق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{registers.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">صندوق مسجل</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">الصناديق النشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">{sessions.filter(s => s.status === 'active').length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">جلسة مفتوحة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold">
                {transactions
                  .filter(t => t.created_at.includes(new Date().toISOString().split('T')[0]))
                  .reduce((sum, t) => sum + (t.transaction_type === 'addition' ? t.amount : t.transaction_type === 'withdrawal' ? -t.amount : 0), 0)
                  .toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المعاملات اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold">
                {transactions.filter(t => t.created_at.includes(new Date().toISOString().split('T')[0])).length}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">معاملة</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Search Section */}
      {showCustomerSearch && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                ربط عميل بالمعاملة
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCustomerSearch(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomerSearchWidget
                onCustomerSelect={handleCustomerSelect}
                showProjectDetails={true}
                showDeliveryInfo={false}
                compact={true}
                placeholder="البحث عن العميل لربطه بالمعاملة..."
              />
              
              {selectedCustomer && (
                <Card className="p-3 bg-white border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      العميل المربوط
                    </h4>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShowCustomerDetails(selectedCustomer)}
                      >
                        <Info className="h-3 w-3 mr-1" />
                        تفاصيل
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearCustomerSelection}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-blue-900">العميل:</p>
                        <p className="text-blue-800">{selectedCustomer.name}</p>
                        <p className="text-blue-700">{selectedCustomer.phone}</p>
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">المشروع:</p>
                        <p className="text-blue-800">{selectedCustomer.projectType}</p>
                        <p className="text-blue-700">{selectedCustomer.projectLocation}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Registers List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                صناديق النقد
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {registers.map((register) => {
                  const session = sessions.find(s => s.register_id === register.id);
                  const isSelected = selectedRegister?.id === register.id;
                  
                  return (
                    <div
                      key={register.id}
                      onClick={() => {
                        setSelectedRegister(register);
                        setSelectedSession(session || null);
                        if (session) {
                          loadSessionTransactions(session.id!);
                        }
                      }}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                        isSelected ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{register.register_name}</span>
                        {getStatusBadge(register.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{register.location_name}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>الرصيد الحالي:</span>
                          <span className="font-medium text-green-600">
                            {register.current_balance.toLocaleString('en-US')} ريال
                          </span>
                        </div>
                        
                        {register.status === 'open' && (
                          <div className="flex justify-between text-sm">
                            <span>الرصيد المتوقع:</span>
                            <span className="font-medium text-blue-600">
                              {register.expected_balance.toLocaleString('en-US')} ريال
                            </span>
                          </div>
                        )}
                      </div>

                      {session && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>فُتح: {new Date(session.opened_at).toLocaleString('en-US')}</p>
                          <p>المبيعات: {session.total_sales.toLocaleString('en-US')} ريال</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Register Details and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRegister ? (
            <>
              {/* Register Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedRegister.register_name}</span>
                    <div className="flex gap-2">
                      {selectedRegister.status === 'closed' ? (
                        <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => alert('Button clicked')}>
                              <Unlock className="w-4 h-4 ml-1" />
                              فتح الصندوق
                            </Button>
                          </DialogTrigger>
                          <DialogContent dir="rtl">
                            <DialogHeader>
                              <DialogTitle>فتح صندوق النقد</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="opening_amount">مبلغ الافتتاح</Label>
                                <Input
                                  id="opening_amount"
                                  type="number"
                                  value={openingAmount}
                                  onChange={(e) => setOpeningAmount(parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowOpenDialog(false)}>
                                  إلغاء
                                </Button>
                                <Button onClick={openCashRegister} disabled={loading}>
                                  <Unlock className="w-4 h-4 ml-1" />
                                  فتح الصندوق
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <div className="flex gap-2">
                          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                <Plus className="w-4 h-4 ml-1" />
                                إضافة نقد
                              </Button>
                            </DialogTrigger>
                            <DialogContent dir="rtl">
                              <DialogHeader>
                                <DialogTitle>إضافة نقد للصندوق</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="addition_amount">المبلغ</Label>
                                  <Input
                                    id="addition_amount"
                                    type="number"
                                    value={additionAmount}
                                    onChange={(e) => setAdditionAmount(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="addition_reason">السبب</Label>
                                  <Textarea
                                    id="addition_reason"
                                    value={transactionReason}
                                    onChange={(e) => setTransactionReason(e.target.value)}
                                    placeholder="سبب إضافة النقد"
                                    rows={2}
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                    إلغاء
                                  </Button>
                                  <Button onClick={addCashToRegister} disabled={loading}>
                                    <Plus className="w-4 h-4 ml-1" />
                                    إضافة
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => alert('Button clicked')}>
                                <TrendingDown className="w-4 h-4 ml-1" />
                                سحب نقد
                              </Button>
                            </DialogTrigger>
                            <DialogContent dir="rtl">
                              <DialogHeader>
                                <DialogTitle>سحب نقد من الصندوق</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="withdrawal_amount">المبلغ</Label>
                                  <Input
                                    id="withdrawal_amount"
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="withdrawal_reason">السبب</Label>
                                  <Textarea
                                    id="withdrawal_reason"
                                    value={transactionReason}
                                    onChange={(e) => setTransactionReason(e.target.value)}
                                    placeholder="سبب سحب النقد"
                                    rows={2}
                                  />
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                                    إلغاء
                                  </Button>
                                  <Button onClick={withdrawCashFromRegister} disabled={loading}>
                                    <TrendingDown className="w-4 h-4 ml-1" />
                                    سحب
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm" onClick={() => alert('Button clicked')}>
                                <Lock className="w-4 h-4 ml-1" />
                                إغلاق الصندوق
                              </Button>
                            </DialogTrigger>
                            <DialogContent dir="rtl">
                              <DialogHeader>
                                <DialogTitle>إغلاق صندوق النقد</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">ملخص الجلسة</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span>مبلغ الافتتاح:</span>
                                      <span>{activeSession?.opening_balance.toLocaleString('en-US')} ريال</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>إجمالي المبيعات:</span>
                                      <span>{activeSession?.total_sales.toLocaleString('en-US')} ريال</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>الإضافات:</span>
                                      <span>{activeSession?.cash_additions.toLocaleString('en-US')} ريال</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>السحوبات:</span>
                                      <span>{activeSession?.cash_withdrawals.toLocaleString('en-US')} ريال</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold">
                                      <span>الرصيد المتوقع:</span>
                                      <span>{activeSession?.expected_balance.toLocaleString('en-US')} ريال</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="closing_amount">المبلغ الفعلي في الصندوق</Label>
                                  <Input
                                    id="closing_amount"
                                    type="number"
                                    value={closingAmount}
                                    onChange={(e) => setClosingAmount(parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                  />
                                  {closingAmount > 0 && activeSession && (
                                    <div className={`mt-2 text-sm ${
                                      closingAmount === activeSession.expected_balance 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                    }`}>
                                      التباين: {(closingAmount - activeSession.expected_balance).toFixed(2)} ريال
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
                                    إلغاء
                                  </Button>
                                  <Button onClick={closeCashRegister} disabled={loading}>
                                    <Lock className="w-4 h-4 ml-1" />
                                    إغلاق الصندوق
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الرصيد الحالي</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {selectedRegister.current_balance.toLocaleString('en-US')} ريال
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedRegister.status === 'open' && (
                      <Card className="bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                              <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">الرصيد المتوقع</p>
                              <p className="text-2xl font-bold text-green-600">
                                {selectedRegister.expected_balance.toLocaleString('en-US')} ريال
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {activeSession && (
                      <Card className="bg-purple-50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-full">
                              <CreditCard className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                              <p className="text-2xl font-bold text-purple-600">
                                {activeSession.total_sales.toLocaleString('en-US')} ريال
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transactions */}
              {selectedSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      معاملات الجلسة الحالية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {transactions.length > 0 ? (
                        transactions.map((transaction) => {
                          const { icon: Icon, color } = getTransactionIcon(transaction.transaction_type);
                          
                          return (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 bg-white rounded-full ${color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {getTransactionTypeLabel(transaction.transaction_type)}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {new Date(transaction.created_at).toLocaleString('en-US')}
                                  </p>
                                  {transaction.description && (
                                    <p className="text-xs text-gray-500">{transaction.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-left">
                                <p className={`font-bold ${
                                  ['sale', 'addition', 'opening'].includes(transaction.transaction_type)
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                                }`}>
                                  {['sale', 'addition', 'opening'].includes(transaction.transaction_type) ? '+' : '-'}
                                  {transaction.amount.toLocaleString('en-US')} ريال
                                </p>
                                <p className="text-xs text-gray-500">{transaction.payment_method}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>لا توجد معاملات في هذه الجلسة بعد</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">اختر صندوق نقد لعرض التفاصيل</p>
                <p className="text-sm">يمكنك فتح صندوق النقد أو إدارة المعاملات النقدية</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Customer Detail Modal */}
      {showCustomerDetail && customerDetailData && (
        <CustomerDetailModal
          customer={customerDetailData}
          onClose={() => setShowCustomerDetail(false)}
          showDeliveryInfo={false}
        />
      )}
    </div>
  );
}
