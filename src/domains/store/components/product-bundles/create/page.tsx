'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge } from '@/components/ui';
import { Button } from '@/components/ui';

export const dynamic = 'force-dynamic'

export default function CreateProductBundle() {
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Product Bundle</CardTitle>
          <CardDescription>Create a new product bundle</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Product bundle creation interface coming soon...</p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}




