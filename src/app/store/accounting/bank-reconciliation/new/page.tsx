'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewBankReconciliationPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [date, setDate] = useState('');
  const [balance, setBalance] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!date || !balance) {
      toast.error('يرجى تعبئة التاريخ والرصيد النهائي');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('bank_reconciliations').insert([{
        date,
        final_balance: parseFloat(balance),
        notes
      }]);
      if (error) throw error;
      toast.success('تم إنشاء التسوية بنجاح');
      router.push('/store/accounting/bank-reconciliation');
    } catch (err: any) {
      console.error('Create error:', err);
      toast.error('فشل في إنشاء التسوية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">إنشاء تسوية بنكية جديدة</h1>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-600" />
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <Input type="number" placeholder="الرصيد النهائي" value={balance} onChange={e => setBalance(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-gray-600" />
          <Input type="text" placeholder="ملاحظات" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>
      </div>
      <Button onClick={handleCreate} disabled={loading}>
        {loading ? 'جاري الإنشاء...' : 'حفظ'}
      </Button>
      <Button variant="outline" onClick={() => router.back()}>إلغاء</Button>
    </div>
  );
}
