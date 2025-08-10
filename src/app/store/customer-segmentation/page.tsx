'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CustomerSegmentationPage() {
  const [segments] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSegments = segments.filter((segment: any) =>
    (segment?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (segment?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCustomers = segments.reduce((sum: number, segment: any) => sum + (segment?.customer_count || 0), 0)
  const activeSegments = segments.filter((s: any) => s?.status === 'active').length
  const autoUpdateSegments = segments.filter((s: any) => s?.auto_update).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customer Segmentation</h1>
        <Button>Create New Segment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{segments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSegments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Update Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoUpdateSegments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Segments</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search segments..."
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
                <TableHead>Segment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer Count</TableHead>
                <TableHead>Auto Update</TableHead>
                <TableHead>Last Calculated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSegments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No segments found</TableCell>
                </TableRow>
              ) : (
                filteredSegments.map((segment: any) => (
                  <TableRow key={segment?.id || Math.random()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{segment?.name || 'Unnamed Segment'}</div>
                        <div className="text-sm text-gray-500">
                          {segment?.description || 'No description'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{segment?.type || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={segment?.status === 'active' ? 'default' : 'secondary'}>
                        {segment?.status || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{(segment?.customer_count || 0).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={segment?.auto_update ? 'default' : 'secondary'}>
                        {segment?.auto_update ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {segment?.last_calculated_at ?
                        new Date(segment.last_calculated_at).toLocaleDateString() :
                        'Never'
                      }
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Edit</Button>
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
