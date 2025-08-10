// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Copy, 
  Share2, 
  CreditCard,
  Plus,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useTranslation } from '@/core/shared/hooks/useTranslation'
import { formatDate, formatCurrency } from '@/core/shared/utils'
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface CommissionDashboard {
  totalEarnings: number
  pendingBalance: number
  availableBalance: number
  totalReferrals: number
  userReferrals: number
  storeReferrals: number
  conversionRate: number
  totalCommissions: number
}

interface InviteCode {
  id: string
  code: string
  type: 'user' | 'store'
  usage_count: number
  max_uses?: number
  metadata?: any
  created_at: string
  is_active: boolean
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

interface Commission {
  id: string
  amount: number
  commission_type: string
  reference_id: string
  status: string
  created_at: string
}

interface PayoutRequest {
  id: string
  amount: number
  payment_method: string
  status: string
  created_at: string
  processed_at?: string
}

export default function CommissionDashboard() {
  const { t, locale } = useTranslation();
  const [dashboard, setDashboard] = useState<CommissionDashboard | null>(null);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [showPayoutRequest, setShowPayoutRequest] = useState(false);
  const [activeTab, setActiveTab] = useState<'invite-codes' | 'commissions' | 'payouts'>('invite-codes');

  // Form states
  const [newCodeType, setNewCodeType] = useState<'user' | 'store'>('user')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentDetails, setPaymentDetails] = useState('')

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [dashboardRes, codesRes, commissionsRes, payoutsRes] = await Promise.all([
        fetch('/api/commissions?action=dashboard'),
        fetch('/api/commissions?action=get_invite_codes'),
        fetch('/api/commissions?action=get_commissions'),
        fetch('/api/commissions?action=get_payouts')
      ])

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json()
        setDashboard(dashboardData)
      }

      if (codesRes.ok) {
        const codesData = await codesRes.json()
        setInviteCodes(codesData)
      }

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json()
        setCommissions(commissionsData)
      }

      if (payoutsRes.ok) {
        const payoutsData = await payoutsRes.json()
        setPayouts(payoutsData)
      }
    } catch (err) {
      setError('Failed to load commission data')
      console.error('Commission dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const createInviteCode = async () => {
    try {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_invite_code',
          type: newCodeType,
          metadata: { source: 'dashboard' }
        })
      })

      if (response.ok) {
        setShowCreateCode(false)
        fetchDashboardData()
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to create invite code')
      }
    } catch (err) {
      setError('Failed to create invite code')
    }
  }

  const requestPayout = async () => {
    if (!payoutAmount || !paymentMethod || !paymentDetails) {
      setError('Please fill in all payout details')
      return
    }

    const amount = parseFloat(payoutAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (dashboard && amount > dashboard.availableBalance) {
      setError('Insufficient available balance')
      return
    }

    try {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_payout',
          amount,
          paymentMethod,
          paymentDetails
        })
      })

      if (response.ok) {
        setShowPayoutRequest(false)
        setPayoutAmount('')
        setPaymentMethod('')
        setPaymentDetails('')
        fetchDashboardData()
      } else {
        const error = await response.json()
        setError(error.error || 'Failed to request payout')
      }
    } catch (err) {
      setError('Failed to request payout')
    }
  }

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const shareInviteCode = (code: string, type: string) => {
    const message = type === 'user' 
      ? `Join Binna with my invite code: ${code} and get special benefits!`
      : `Register your store on Binna with my invite code: ${code} and start selling!`
    
    if (navigator.share) {
      navigator.share({
        title: 'Join Binna',
        text: message,
        url: `${window.location.origin}/signup?invite=${code}`
      })
    } else {
      copyInviteCode(`${message} ${window.location.origin}/signup?invite=${code}`)
    }
  }

  const getCommissionTypeLabel = (type: string) => {
    switch (type) {
      case 'user_signup': return t('commission.userSignup')
      case 'store_signup': return t('commission.storeSignup')
      case 'purchase': return t('commission.purchase')
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
      case 'completed': return 'bg-gradient-to-r from-green-500 to-green-600 text-white'
      case 'paid': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
      case 'failed': return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('commission.dashboard')}</h1>
            <p className="text-gray-600">{t('commission.description')}</p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowCreateCode(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 ml-2" />
              {t('commission.createCode')}
            </Button>
            <Button
              onClick={() => setShowPayoutRequest(true)}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CreditCard className="w-4 h-4 ml-2" />
              {t('commission.requestPayout')}
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            {error}
            <Button 
              onClick={fetchDashboardData}
              className="mr-2"
            >
              {t('retry')}
            </Button>
          </div>
        ) : (
          <>            {/* Stats Grid */}
            {dashboard && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{t('commission.totalEarnings')}</p>
                      <div className="text-3xl font-bold mt-2">
                        {formatCurrency(dashboard.totalEarnings, 'SAR')}
                      </div>
                      <p className="text-sm opacity-75 mt-2">
                        {dashboard.totalCommissions} {t('commission.totalCommissions')}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <DollarSign className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{t('commission.availableBalance')}</p>
                      <div className="text-3xl font-bold mt-2">
                        {formatCurrency(dashboard.availableBalance, 'SAR')}
                      </div>
                      <p className="text-sm opacity-75 mt-2">{t('commission.readyForPayout')}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{t('commission.totalReferrals')}</p>
                      <div className="text-3xl font-bold mt-2">{dashboard.totalReferrals}</div>
                      <p className="text-sm opacity-75 mt-2">
                        {t('commission.referralCount', {
                          users: dashboard.userReferrals,
                          stores: dashboard.storeReferrals
                        })}
                      </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90">{t('commission.conversionRate')}</p>
                      <div className="text-3xl font-bold mt-2">{dashboard.conversionRate.toFixed(1)}%</div>
                      <p className="text-sm opacity-75 mt-2">{t('commission.successRate')}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <button
                  onClick={() => setActiveTab('invite-codes')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'invite-codes'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('commission.inviteCodes')}
                </button>
                <button
                  onClick={() => setActiveTab('commissions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'commissions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('commission.history')}
                </button>
                <button
                  onClick={() => setActiveTab('payouts')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'payouts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t('commission.payouts')}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'invite-codes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Invite Codes</h3>
                  <Button onClick={() => setShowCreateCode(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Code
                  </Button>
                </div>

                {/* Create Code Modal */}
                {showCreateCode && (
                  <Modal
                    isOpen={showCreateCode}
                    onClose={() => setShowCreateCode(false)}
                    title="Create New Invite Code"
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Code Type
                        </label>
                        <Select
                          value={newCodeType}
                          onChange={(e) => setNewCodeType(e.target.value as 'user' | 'store')}
                          options={[
                            { value: 'user', label: 'User Registration' },
                            { value: 'store', label: 'Store Registration' }
                          ]}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setShowCreateCode(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createInviteCode}>
                          Create Code
                        </Button>
                      </div>
                    </div>
                  </Modal>
                )}                {/* Invite Codes List */}
                <div className="space-y-4">
                  {inviteCodes.length === 0 ? (
                    <EmptyState 
                      icon={
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      }
                      title={t('commission.noInviteCodes')}
                      description={t('commission.createFirstCode')}
                    />
                  ) : (
                    inviteCodes.map((code) => (
                      <div key={code.id} 
                           className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                           dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-mono text-sm">
                                  {code.code}
                                </div>
                                <span 
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    code.type === 'user' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {code.type === 'user' ? 'User' : 'Store'}
                                </span>
                                {!code.is_active && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <div className="mt-3">
                                <p className="text-sm text-gray-600">
                                  Used {code.usage_count} {code.usage_count === 1 ? 'time' : 'times'}
                                  {code.max_uses && ` (max: ${code.max_uses})`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Created {new Date(code.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3" dir="ltr">
                              <button
                                onClick={() => copyInviteCode(code.code)}
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </button>
                              <button
                                onClick={() => shareInviteCode(code.code, code.type)}
                                type="button"
                                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Share Link:</span>
                            <code className="text-xs">{`${window.location.origin}/signup?invite=${code.code}`}</code>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}            {activeTab === 'commissions' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                   dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">{t('commission.recentCommissions')}</h3>
                </div>
                {commissions.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 2v1m0 18v1" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('commission.noCommissions')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('commission.startEarning')}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {commissions.map((commission) => (
                      <div key={commission.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                              commission.commission_type === 'user_signup' 
                                ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                                : commission.commission_type === 'store_signup'
                                ? 'bg-gradient-to-br from-green-500 to-green-600'
                                : 'bg-gradient-to-br from-blue-500 to-blue-600'
                            }`}>
                              <div className="text-white">
                                {commission.commission_type === 'user_signup' ? (
                                  <Users className="w-6 h-6" />
                                ) : commission.commission_type === 'store_signup' ? (
                                  <CreditCard className="w-6 h-6" />
                                ) : (
                                  <DollarSign className="w-6 h-6" />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-base font-medium text-gray-900">
                                  {getCommissionTypeLabel(commission.commission_type)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusColor(commission.status)}`}>
                                  {commission.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {new Date(commission.created_at).toLocaleString(locale, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(commission.amount, 'SAR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Payout History</h3>
                  {dashboard && dashboard.availableBalance > 0 && (
                    <Button onClick={() => setShowPayoutRequest(true)} className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Request Payout
                    </Button>
                  )}
                </div>

                {/* Payout Request Modal */}
                {showPayoutRequest && (
                  <Modal
                    isOpen={showPayoutRequest}
                    onClose={() => setShowPayoutRequest(false)}
                    title="Request Payout"
                  >
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        Available balance: ৳{dashboard?.availableBalance.toLocaleString('en-US')}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <Input
                          type="number"
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder="Enter amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <Select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          options={[
                            { value: 'bkash', label: 'bKash' },
                            { value: 'nagad', label: 'Nagad' },
                            { value: 'rocket', label: 'Rocket' },
                            { value: 'bank', label: 'Bank Transfer' }
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Details
                        </label>
                        <Input
                          value={paymentDetails}
                          onChange={(e) => setPaymentDetails(e.target.value)}
                          placeholder="Account number or details"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="secondary" onClick={() => setShowPayoutRequest(false)}>
                          Cancel
                        </Button>
                        <Button onClick={requestPayout}>
                          Request Payout
                        </Button>
                      </div>
                    </div>
                  </Modal>
                )}

                {/* Payouts List */}
                <div className="space-y-3">
                  {payouts.length === 0 ? (
                    <EmptyState title="No payout requests yet" />
                  ) : (
                    payouts.map((payout) => (
                      <Card key={payout.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">৳{payout.amount.toLocaleString('en-US')}</div>
                              <div className="text-sm text-gray-500">
                                {payout.payment_method} • {' '}
                                {new Date(payout.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                              {payout.status}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}






