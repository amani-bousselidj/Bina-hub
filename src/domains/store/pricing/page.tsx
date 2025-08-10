'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Input } from '@/components/ui/Input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function PricingPage() {
  const [priceLists] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPriceLists = priceLists.filter((priceList: any) =>
    (priceList?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (priceList?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <Button>Create Price List</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Price Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceLists.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Price Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceLists.filter((p: any) => p?.status === 'active').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sale Price Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{priceLists.filter((p: any) => p?.type === 'sale').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Price Lists</CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search price lists..."
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer Groups</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPriceLists.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No price lists found</TableCell>
                </TableRow>
              ) : (
                filteredPriceLists.map((priceList: any) => (
                  <TableRow key={priceList?.id || Math.random()}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{priceList?.name || 'Unnamed Price List'}</div>
                        <div className="text-sm text-gray-500">
                          {priceList?.description || 'No description'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priceList?.type === 'sale' ? 'default' : 'secondary'}>
                        {priceList?.type || 'standard'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={priceList?.status === 'active' ? 'default' : 'secondary'}>
                        {priceList?.status || 'inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {priceList?.customer_groups?.join(', ') || 'All customers'}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{priceList?.starts_at ? new Date(priceList.starts_at).toLocaleDateString() : 'N/A'}</div>
                        <div className="text-sm text-gray-500">
                          to {priceList?.ends_at ? new Date(priceList.ends_at).toLocaleDateString() : 'No end date'}
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




