// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface PaymentMethod {
  id: string
  name: string
  type: 'card' | 'bank' | 'digital' | 'cash'
  icon: React.ComponentType<any>
  enabled: boolean
  fees: {
    percentage: number
    fixed: number
  }
  processingTime: string
  supported_currencies: string[]
  min_amount?: number
  max_amount?: number
}

interface PaymentGatewayProps {
  amount: number
  currency: string
  orderId: string
  onPaymentSuccess: (paymentData: any) => void
  onPaymentError: (error: string) => void
  customerInfo?: {
    name: string
    email: string
    phone: string
  }
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  currency,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  customerInfo
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'select' | 'details' | 'processing' | 'completed'>('select')

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'visa',
      name: 'Visa/Mastercard',
      type: 'card',
      icon: CreditCardIcon,
      enabled: true,
      fees: { percentage: 2.9, fixed: 0 },
      processingTime: 'Instant',
      supported_currencies: ['SAR', 'USD', 'EUR'],
      min_amount: 1,
      max_amount: 50000
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      type: 'digital',
      icon: DevicePhoneMobileIcon,
      enabled: true,
      fees: { percentage: 2.9, fixed: 0 },
      processingTime: 'Instant',
      supported_currencies: ['SAR', 'USD', 'EUR']
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      type: 'digital',
      icon: DevicePhoneMobileIcon,
      enabled: true,
      fees: { percentage: 2.5, fixed: 0 },
      processingTime: 'Instant',
      supported_currencies: ['SAR']
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: BanknotesIcon,
      enabled: true,
      fees: { percentage: 0, fixed: 5 },
      processingTime: '1-2 business days',
      supported_currencies: ['SAR'],
      min_amount: 100
    },
    {
      id: 'mada',
      name: 'Mada',
      type: 'card',
      icon: CreditCardIcon,
      enabled: true,
      fees: { percentage: 1.5, fixed: 0 },
      processingTime: 'Instant',
      supported_currencies: ['SAR']
    }
  ]

  const calculateFees = (method: PaymentMethod) => {
    const percentageFee = (amount * method.fees.percentage) / 100
    const totalFee = percentageFee + method.fees.fixed
    return Math.round(totalFee * 100) / 100
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(value)
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setPaymentStep('details')
  }

  const processPayment = async () => {
    setIsProcessing(true)
    setPaymentStep('processing')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock successful payment response
      const paymentData = {
        payment_id: `pay_${Date.now()}`,
        order_id: orderId,
        amount: amount,
        currency: currency,
        method: selectedMethod,
        status: 'success',
        timestamp: new Date().toISOString(),
        fees: calculateFees(paymentMethods.find(m => m.id === selectedMethod)!)
      }

      setPaymentStep('completed')
      setTimeout(() => {
        onPaymentSuccess(paymentData)
      }, 2000)

    } catch (error) {
      setIsProcessing(false)
      setPaymentStep('select')
      onPaymentError(error instanceof Error ? error.message : 'Payment failed')
    }
  }

  const getStatusIcon = () => {
    switch (paymentStep) {
      case 'processing':
        return <ClockIcon className="h-16 w-16 text-blue-500 animate-pulse" />
      case 'completed':
        return <CheckCircleIcon className="h-16 w-16 text-green-500" />
      default:
        return null
    }
  }

  if (paymentStep === 'processing' || paymentStep === 'completed') {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paymentStep === 'processing' ? 'Processing Payment' : 'Payment Successful'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {paymentStep === 'processing' 
              ? 'Please wait while we process your payment...'
              : 'Your payment has been processed successfully!'
            }
          </p>
          
          <div className="text-sm text-gray-500">
            <p>Order ID: {orderId}</p>
            <p>Amount: {formatCurrency(amount)}</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (paymentStep === 'details') {
    const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod)
    if (!selectedMethodData) return null

    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
            <button
              onClick={() => setPaymentStep('select')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <selectedMethodData.icon className="h-6 w-6 text-gray-600" />
                <span className="font-medium text-gray-900">{selectedMethodData.name}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium">{formatCurrency(calculateFees(selectedMethodData))}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatCurrency(amount + calculateFees(selectedMethodData))}</span>
                </div>
              </div>
            </div>

            {/* Payment Form Fields */}
            {selectedMethodData.type === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMethodData.type === 'digital' && (
              <div className="text-center py-8">
                <selectedMethodData.icon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  You will be redirected to complete the payment
                </p>
              </div>
            )}

            <button
              onClick={processPayment}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatCurrency(amount + calculateFees(selectedMethodData))}`}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Payment Method</h3>
        
        <div className="space-y-3">          {paymentMethods
            .filter(method => method.enabled && method.supported_currencies.includes(currency))
            .map((method) => {
              const fees = calculateFees(method)
              const isDisabled = Boolean((method.min_amount && amount < method.min_amount) || 
                               (method.max_amount && amount > method.max_amount))
              
              return (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                  onClick={() => !isDisabled && handlePaymentMethodSelect(method.id)}
                  disabled={isDisabled}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    isDisabled 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <method.icon className="h-6 w-6 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.processingTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        +{formatCurrency(fees)}
                      </p>
                      <p className="text-xs text-gray-500">Fee</p>
                    </div>
                  </div>
                  
                  {isDisabled && method.min_amount && amount < method.min_amount && (
                    <p className="text-xs text-red-500 mt-2">
                      Minimum amount: {formatCurrency(method.min_amount)}
                    </p>
                  )}
                </motion.button>
              )
            })}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Amount:</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentGateway





