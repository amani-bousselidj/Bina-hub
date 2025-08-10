'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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

