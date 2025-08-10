import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, ExternalLink } from 'lucide-react';

interface InsuranceIntegrationProps {
  projectId: string;
  onInsuranceSelected: (insurance: any) => void;
}

export function InsuranceIntegration({ projectId, onInsuranceSelected }: InsuranceIntegrationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          تأمين المشروع
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            احم مشروعك بتأمين شامل يغطي جميع مراحل البناء
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">التأمين الأساسي</h4>
              <p className="text-sm text-gray-600">تغطية أساسية ضد المخاطر الرئيسية</p>
              <div className="text-lg font-bold text-green-600 mt-2">من 5,000 ريال</div>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold">التأمين الشامل</h4>
              <p className="text-sm text-gray-600">تغطية شاملة لجميع المخاطر</p>
              <div className="text-lg font-bold text-blue-600 mt-2">من 15,000 ريال</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              مقارنة عروض التأمين
            </Button>
            <Button variant="outline" onClick={() => onInsuranceSelected({})}>
              تم اختيار التأمين
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
