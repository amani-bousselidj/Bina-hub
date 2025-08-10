import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExternalLink } from 'lucide-react';

interface LandPurchaseIntegrationProps {
  projectId: string;
  onLandSelected: (land: any) => void;
}

export function LandPurchaseIntegration({ projectId, onLandSelected }: LandPurchaseIntegrationProps) {
  const handleOpenAqar = () => {
    window.open('https://sa.aqar.fm', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          منصة عقار - البحث عن الأراضي
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">
            ابحث عن الأراضي المتاحة للبيع في منطقتك من خلال منصة عقار الرسمية
          </p>
          <div className="flex gap-2">
            <Button onClick={handleOpenAqar} className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              تصفح الأراضي في عقار
            </Button>
            <Button variant="outline" onClick={() => onLandSelected({})}>
              تم اختيار الأرض
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
