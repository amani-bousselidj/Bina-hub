'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'

export default function ProductExportPage() {
  const [selectedFields, setSelectedFields] = useState<string[]>(['title', 'price', 'sku'])
  const [exportFormat, setExportFormat] = useState('csv')
  const [exporting, setExporting] = useState(false)

  const availableFields = [
    { id: 'title', label: 'Product Title' },
    { id: 'description', label: 'Description' },
    { id: 'sku', label: 'SKU' },
    { id: 'price', label: 'Price' },
    { id: 'cost_price', label: 'Cost Price' },
    { id: 'category', label: 'Category' },
    { id: 'status', label: 'Status' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'weight', label: 'Weight' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'tags', label: 'Tags' },
    { id: 'created_at', label: 'Created Date' },
    { id: 'updated_at', label: 'Updated Date' }
  ]

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field to export')
      return
    }

    setExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create sample export data
      const exportData: any[] = []
      for (let i = 1; i <= 10; i++) {
        const row: any = {}
        selectedFields.forEach(field => {
          switch (field) {
            case 'title':
              row[field] = `Sample Product ${i}`
              break
            case 'price':
              row[field] = (Math.random() * 1000).toFixed(2)
              break
            case 'sku':
              row[field] = `SKU-${i.toString().padStart(3, '0')}`
              break
            case 'quantity':
              row[field] = Math.floor(Math.random() * 100)
              break
            default:
              row[field] = `Sample ${field} ${i}`
          }
        })
        exportData.push(row)
      }

      // Generate CSV content
      const headers = selectedFields.map(field => 
        availableFields.find(f => f.id === field)?.label || field
      ).join(',')
      
      const rows = exportData.map(row => 
        selectedFields.map(field => row[field] || '').join(',')
      ).join('\n')
      
      const csvContent = headers + '\n' + rows
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `products_export_${new Date().getTime()}.${exportFormat}`
      a.click()
      window.URL.revokeObjectURL(url)
      
      alert('Export completed successfully!')
    } catch (error) {
      alert('Export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Export Products</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fields to Export</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableFields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {field.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Selected Fields ({selectedFields.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedFields.map(field => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                  >
                    {availableFields.find(f => f.id === field)?.label || field}
                  </span>
                ))}
              </div>
              
              {selectedFields.length === 0 && (
                <div className="text-red-500 text-sm">
                  Please select at least one field to export.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Ready to export products in {exportFormat.toUpperCase()} format
              </p>
              <p className="text-xs text-gray-500">
                Selected {selectedFields.length} fields for export
              </p>
            </div>
            <Button
              onClick={handleExport}
              disabled={selectedFields.length === 0 || exporting}
            >
              {exporting ? 'Exporting...' : 'Export Products'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




