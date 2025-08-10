'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';

export default function WarehousePage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>مستودع</CardTitle>
        </CardHeader>
        <CardContent>
          <p>صفحة المستودع قيد التطوير</p>
          <Badge>قيد التطوير</Badge>
        </CardContent>
      </Card>
    </div>
  );
}

