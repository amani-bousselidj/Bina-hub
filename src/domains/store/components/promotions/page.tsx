'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function PromotionsPage() {
  const [promotions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPromotions = promotions.filter((promotion: any) =>
    (promotion?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (promotion?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promotions & Discounts</h1>
        <Button>Create Promotion</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter((p: any) => p?.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {promotions.reduce((sum: number, p: any) => sum + (p?.usage_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promotions.filter((p: any) => p?.status === 'scheduled').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Promotions</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search promotions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPromotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No promotions found</TableCell>
                </TableRow>
              ) : (
                filteredPromotions.map((promotion: any) => (
                  <TableRow key={promotion?.id || Math.random()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion?.name || 'Unnamed Promotion'}</div>
                        <div className="text-sm text-gray-500">
                          {promotion?.description || 'No description'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promotion?.type === 'percentage' ? 'default' : 'secondary'}>
                        {promotion?.type === 'percentage' ? `${promotion?.value || 0}% off` : promotion?.type || 'fixed'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={promotion?.status === 'active' ? 'default' : 'secondary'}>
                        {promotion?.status || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion?.usage_count || 0} used</div>
                        <div className="text-sm text-gray-500">
                          of {promotion?.usage_limit || 'unlimited'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {promotion?.start_date ? new Date(promotion.start_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {promotion?.end_date ? new Date(promotion.end_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}




