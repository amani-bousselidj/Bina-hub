'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function BankReconciliationUploadPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }
    setLoading(true);
    try {
      const filePath = `bank-statements/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('bank-statements')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      toast.success('تم رفع الملف بنجاح');
      // Optionally trigger reconciliation API
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('فشل في رفع الملف');
    } finally {
      setLoading(false);
      router.push('/store/accounting/bank-reconciliation');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">رفع كشف حساب بنكي</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Button type="submit" disabled={loading}>
          <Upload className="h-4 w-4 mr-2" />
          {loading ? 'جاري الرفع...' : 'رفع'}
        </Button>
      </form>
      <Button variant="outline" onClick={() => router.back()}>
        العودة
      </Button>
    </div>
  );
}
