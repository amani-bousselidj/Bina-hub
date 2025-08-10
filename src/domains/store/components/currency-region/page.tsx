'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function CurrencyRegionPage() {
  const [currencies] = useState([])
  const [regions] = useState([])
  const [countries] = useState([])
  const [activeTab, setActiveTab] = useState('currencies')

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Currency & Region Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
        </TabsList>

        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle>Currency Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Exchange Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">No currencies found</TableCell>
                    </TableRow>
                  ) : (
                    currencies.map((currency: any) => (
                      <TableRow key={currency?.id || Math.random()}>
                        <TableCell>{currency?.name || 'N/A'}</TableCell>
                        <TableCell>{currency?.code || 'N/A'}</TableCell>
                        <TableCell>{currency?.symbol || 'N/A'}</TableCell>
                        <TableCell>{currency?.exchange_rate || 0}</TableCell>
                        <TableCell>
                          <Badge variant={currency?.is_active ? 'default' : 'secondary'}>
                            {currency?.is_active ? 'Active' : 'Inactive'}
                          </Badge>
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
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Region Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {regions.length === 0 ? (
                  <p className="text-center text-gray-500">No regions found</p>
                ) : (
                  regions.map((region: any) => (
                    <Card key={region?.id || Math.random()}>
                      <CardHeader>
                        <CardTitle>{region?.name || 'Unnamed Region'}</CardTitle>
                        <Badge variant={region?.is_active ? 'default' : 'secondary'}>
                          {region?.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Currency: </span>
                            <span>{region?.currency_code || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium">Tax Rate: </span>
                            <span>{region?.tax_rate || 0}%</span>
                          </div>
                          <div>
                            <span className="font-medium">Countries: </span>
                            <span>{region?.countries?.length || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="countries">
          <Card>
            <CardHeader>
              <CardTitle>Country Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {countries.length === 0 ? (
                  <p className="text-center text-gray-500">No countries found</p>
                ) : (
                  countries.map((country: any) => (
                    <div key={country?.code || Math.random()} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <span className="text-2xl">{country?.flag || '🏳️'}</span>
                      <div>
                        <div className="font-medium">{country?.name || 'Unknown Country'}</div>
                        <div className="text-sm text-gray-500">{country?.code || 'N/A'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}



