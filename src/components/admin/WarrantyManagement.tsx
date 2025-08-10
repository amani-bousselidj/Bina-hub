// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Plus, Search, Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, Button, Input, Modal, Select } from '@/components/ui'

interface Warranty {
  id: string
  product_name: string
  product_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  purchase_date: string
  warranty_period_months: number
  warranty_end_date: string
  status: 'active' | 'expired' | 'claimed' | 'void'
  claim_count: number
  store_name: string
  serial_number?: string
  notes?: string
}

interface WarrantyClaim {
  id: string
  warranty_id: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'resolved'
  created_at: string
  resolved_at?: string
  resolution_notes?: string
}

export default function WarrantyManagement() {
  const [warranties, setWarranties] = useState<Warranty[]>([])
  const [claims, setClaims] = useState<WarrantyClaim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showClaimModal, setShowClaimModal] = useState(false)
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null)
  const [activeTab, setActiveTab] = useState<'warranties' | 'claims'>('warranties')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Form states
  const [warrantyForm, setWarrantyForm] = useState({
    product_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    serial_number: '',
    warranty_period_months: 12,
    notes: ''
  })

  const [claimForm, setClaimForm] = useState({
    description: '',
    warranty_id: ''
  })

  const fetchWarranties = async () => {
    setLoading(true)
    setError(null)

    try {
      const [warrantiesRes, claimsRes] = await Promise.all([
        fetch('/api/warranties'),
        fetch('/api/warranty-claims')
      ])

      if (warrantiesRes.ok) {
        const warrantiesData = await warrantiesRes.json()
        setWarranties(warrantiesData.warranties || [])
      }

      if (claimsRes.ok) {
        const claimsData = await claimsRes.json()
        setClaims(claimsData.claims || [])
      }
    } catch (err) {
      setError('Failed to load warranties')
      console.error('Warranties fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createWarranty = async () => {
    if (!warrantyForm.product_id || !warrantyForm.customer_name || !warrantyForm.customer_email) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/warranties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(warrantyForm)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create warranty')
      }

      setShowCreateModal(false)
      resetWarrantyForm()
      fetchWarranties()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create warranty')
    }
  }

  const createClaim = async () => {
    if (!claimForm.description || !claimForm.warranty_id) {
      setError('Please fill in all required fields')
      return
    }

    try {
      const response = await fetch('/api/warranty-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimForm)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create claim')
      }

      setShowClaimModal(false)
      resetClaimForm()
      fetchWarranties()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create claim')
    }
  }

  const updateClaimStatus = async (claimId: string, status: string, resolutionNotes?: string) => {
    try {
      const response = await fetch(`/api/warranty-claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolution_notes: resolutionNotes })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update claim')
      }

      fetchWarranties()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update claim')
    }
  }

  const resetWarrantyForm = () => {
    setWarrantyForm({
      product_id: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      serial_number: '',
      warranty_period_months: 12,
      notes: ''
    })
    setError(null)
  }

  const resetClaimForm = () => {
    setClaimForm({
      description: '',
      warranty_id: ''
    })
    setError(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800'
      case 'void':
        return 'bg-gray-100 text-gray-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'resolved':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'claimed':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const filteredWarranties = warranties.filter(warranty => {
    const matchesStatus = statusFilter === 'all' || warranty.status === statusFilter
    const matchesSearch = warranty.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warranty.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         warranty.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const filteredClaims = claims.filter(claim => 
    statusFilter === 'all' || claim.status === statusFilter
  )

  useEffect(() => {
    fetchWarranties()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Warranty Management</h2>
          <p className="text-gray-600">Manage product warranties and claims</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Warranty
          </Button>
          <Button onClick={() => setShowClaimModal(true)} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('warranties')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'warranties'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Warranties ({warranties.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'claims'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Claims ({claims.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search warranties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'active', label: 'Active' },
            { value: 'expired', label: 'Expired' },
            { value: 'claimed', label: 'Claimed' },
            { value: 'void', label: 'Void' }
          ]}
        />
      </div>

      {/* Content */}
      {activeTab === 'warranties' ? (
        <div className="grid gap-4">
          {filteredWarranties.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No warranties found</h3>
                <p className="text-gray-600">No warranties match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredWarranties.map((warranty) => (
              <Card key={warranty.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">{warranty.product_name}</h3>                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(warranty.status)}`}>
                            {warranty.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Customer:</strong> {warranty.customer_name} ({warranty.customer_email})</p>
                          <p><strong>Purchase Date:</strong> {new Date(warranty.purchase_date).toLocaleDateString()}</p>
                          <p><strong>Warranty Ends:</strong> {new Date(warranty.warranty_end_date).toLocaleDateString()}</p>
                          {warranty.serial_number && (
                            <p><strong>Serial:</strong> {warranty.serial_number}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{warranty.warranty_period_months} months</p>
                        <p className="text-xs text-gray-500">{warranty.claim_count} claims</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClaims.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No claims found</h3>
                <p className="text-gray-600">No warranty claims match your current filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredClaims.map((claim) => {
              const warranty = warranties.find(w => w.id === claim.warranty_id)
              return (
                <Card key={claim.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(claim.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-medium">{warranty?.product_name || 'Unknown Product'}</h3>                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(claim.status)}`}>
                              {claim.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Description:</strong> {claim.description}</p>
                            <p><strong>Created:</strong> {new Date(claim.created_at).toLocaleDateString()}</p>
                            {claim.resolved_at && (
                              <p><strong>Resolved:</strong> {new Date(claim.resolved_at).toLocaleDateString()}</p>
                            )}
                            {claim.resolution_notes && (
                              <p><strong>Resolution:</strong> {claim.resolution_notes}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {claim.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => updateClaimStatus(claim.id, 'approved')}
                            className="gap-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>                          <Button
                            variant="destructive"
                            onClick={() => updateClaimStatus(claim.id, 'rejected')}
                            className="gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      )}

      {/* Create Warranty Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            resetWarrantyForm()
          }}
          title="Add New Warranty"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product ID *
              </label>
              <Input
                value={warrantyForm.product_id}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, product_id: e.target.value }))}
                placeholder="Enter product ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name *
              </label>
              <Input
                value={warrantyForm.customer_name}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, customer_name: e.target.value }))}
                placeholder="Enter customer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Email *
              </label>
              <Input
                type="email"
                value={warrantyForm.customer_email}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, customer_email: e.target.value }))}
                placeholder="Enter customer email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <Input
                value={warrantyForm.customer_phone}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, customer_phone: e.target.value }))}
                placeholder="Enter customer phone"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial Number
              </label>
              <Input
                value={warrantyForm.serial_number}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, serial_number: e.target.value }))}
                placeholder="Enter serial number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty Period (months)
              </label>
              <Input
                type="number"
                value={warrantyForm.warranty_period_months}
                onChange={(e) => setWarrantyForm(prev => ({ ...prev, warranty_period_months: parseInt(e.target.value) || 12 }))}
                placeholder="Enter warranty period in months"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={() => {
                setShowCreateModal(false)
                resetWarrantyForm()
              }}>
                Cancel
              </Button>
              <Button onClick={createWarranty}>
                Create Warranty
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Claim Modal */}
      {showClaimModal && (
        <Modal
          isOpen={showClaimModal}
          onClose={() => {
            setShowClaimModal(false)
            resetClaimForm()
          }}
          title="Create Warranty Claim"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Warranty *
              </label>
              <Select
                value={claimForm.warranty_id}
                onChange={(e) => setClaimForm(prev => ({ ...prev, warranty_id: e.target.value }))}
                options={[
                  { value: '', label: 'Select a warranty' },
                  ...warranties
                    .filter(w => w.status === 'active')
                    .map(w => ({ 
                      value: w.id, 
                      label: `${w.product_name} - ${w.customer_name}` 
                    }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <Input
                value={claimForm.description}
                onChange={(e) => setClaimForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the issue or claim"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={() => {
                setShowClaimModal(false)
                resetClaimForm()
              }}>
                Cancel
              </Button>
              <Button onClick={createClaim}>
                Create Claim
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}




