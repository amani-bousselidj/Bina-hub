import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink, Users } from 'lucide-react';

interface ContractorSelectionIntegrationProps {
  projectId: string;
  projectArea?: number;
  projectType?: string;
  onPlanSelected: (plan: any) => void;
  onContractorSelected: (contractor: any) => void;
}

export function ContractorSelectionIntegration({ 
  projectId, 
  projectArea, 
  projectType, 
  onPlanSelected, 
  onContractorSelected 
}: ContractorSelectionIntegrationProps) {
  const handleOpenACKD = () => {
    window.open('https://ackd.sa', '_blank');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            منصة ACKD - المخططات المعمارية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              احصل على مخططات معمارية جاهزة ومعتمدة من منصة ACKD
            </p>
            <div className="flex gap-2">
              <Button onClick={handleOpenACKD} className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                تصفح المخططات في ACKD
              </Button>
              <Button variant="outline" onClick={() => onPlanSelected({})}>
                تم اختيار المخطط
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            اختيار المقاول
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              ابحث عن المقاولين المعتمدين في منطقتك
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">مقاولون محليون</h4>
                <p className="text-sm text-gray-600">مقاولون معتمدون في منطقتك</p>
                <Button variant="outline" size="sm" className="mt-2">
                  تصفح المقاولين
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold">طلب عروض أسعار</h4>
                <p className="text-sm text-gray-600">احصل على عروض من عدة مقاولين</p>
                <Button variant="outline" size="sm" className="mt-2">
                  طلب عروض
                </Button>
              </div>
            </div>
            <Button onClick={() => onContractorSelected({})} className="w-full">
              تم اختيار المقاول
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
