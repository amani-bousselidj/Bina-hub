// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { createWathqService, CRUtils, type WathqCommercialRecord } from '@/core/shared/services/wathq-api';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Building, 
  User, 
  Calendar, 
  MapPin, 
  Briefcase,
  Loader,
  RefreshCw
} from 'lucide-react';

interface WathqVerificationProps {
  onVerificationComplete?: (record: WathqCommercialRecord | null) => void;
  onVerificationError?: (error: string) => void;
  initialCRNumber?: string;
  showFullDetails?: boolean;
}

export default function WathqVerification({ 
  onVerificationComplete, 
  onVerificationError, 
  initialCRNumber = '',
  showFullDetails = true 
}: WathqVerificationProps) {
  const [crNumber, setCrNumber] = useState(initialCRNumber);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<WathqCommercialRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  const wathqService = createWathqService();

  const handleCRNumberChange = (value: string) => {
    // Clean and limit to 10 digits
    const cleaned = CRUtils.cleanCRNumber(value);
    if (cleaned.length <= 10) {
      setCrNumber(cleaned);
    }

    // Clear previous results when changing CR number
    if (verificationResult || error) {
      setVerificationResult(null);
      setError(null);
      setIsVerified(false);
    }
  };

  const verifyCommercialRegistration = async () => {
    if (!CRUtils.isValidCRNumber(crNumber)) {
      const errorMsg = 'يرجى إدخال رقم سجل تجاري صحيح (10 أرقام)';
      setError(errorMsg);
      onVerificationError?.(errorMsg);
      return;
    }

    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await wathqService.verifyCommercialRegistration(crNumber);

      if (result.success && result.data) {
        setVerificationResult(result.data);
        setIsVerified(true);
        onVerificationComplete?.(result.data);
      } else {
        const errorMsg = result.error || 'فشل في التحقق من السجل التجاري';
        setError(errorMsg);
        setIsVerified(false);
        onVerificationError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'حدث خطأ غير متوقع أثناء التحقق';
      setError(errorMsg);
      setIsVerified(false);
      onVerificationError?.(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'suspended': return 'موقوف';
      case 'cancelled': return 'ملغى';
      default: return status;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6 font-tajawal" dir="rtl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-blue-100 rounded-lg ml-3">
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">التحقق من السجل التجاري</h3>
          <p className="text-sm text-gray-600">التحقق من صحة السجل التجاري عبر منصة واثق</p>
        </div>
      </div>

      {/* CR Number Input */}
      <div className="mb-6">
        <label htmlFor="cr-number" className="block text-sm font-medium text-gray-700 mb-2">
          رقم السجل التجاري
        </label>
        <div className="flex gap-3">
          <input
            id="cr-number"
            type="text"
            value={CRUtils.formatCRNumber(crNumber)}
            onChange={(e) => handleCRNumberChange(e.target.value)}
            placeholder="1010-1234-56"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={12} // Account for formatting
            disabled={isVerifying}
          />
          <button
            onClick={verifyCommercialRegistration}
            disabled={isVerifying || !CRUtils.isValidCRNumber(crNumber)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {isVerifying ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                تحقق
              </>
            )}
          </button>
        </div>
        {!CRUtils.isValidCRNumber(crNumber) && crNumber.length > 0 && (
          <p className="mt-1 text-sm text-red-600">رقم السجل التجاري يجب أن يكون 10 أرقام</p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 ml-2" />
            <span className="text-red-700 font-medium">خطأ في التحقق</span>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Verification Success */}
      {isVerified && verificationResult && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
            <span className="text-green-700 font-medium">تم التحقق بنجاح</span>
          </div>
          
          {showFullDetails && (
            <div className="space-y-4">
              {/* Business Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Building className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">اسم المنشأة</div>
                      <div className="font-medium text-gray-900">{verificationResult.business_name_ar}</div>
                      {verificationResult.business_name_en && (
                        <div className="text-sm text-gray-500">{verificationResult.business_name_en}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">اسم المالك</div>
                      <div className="font-medium text-gray-900">{verificationResult.owner_name}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Briefcase className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">نوع المنشأة</div>
                      <div className="font-medium text-gray-900">{verificationResult.business_type}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">تاريخ التسجيل</div>
                      <div className="font-medium text-gray-900">{formatDate(verificationResult.registration_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">تاريخ الانتهاء</div>
                      <div className="font-medium text-gray-900">{formatDate(verificationResult.expiry_date)}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1 ml-2" />
                    <div>
                      <div className="text-sm text-gray-600">المدينة</div>
                      <div className="font-medium text-gray-900">{verificationResult.city}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Capital */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 ml-2">الحالة:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verificationResult.status)}`}>
                    {getStatusText(verificationResult.status)}
                  </span>
                </div>
                
                {verificationResult.capital > 0 && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 ml-2">رأس المال:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(verificationResult.capital)}</span>
                  </div>
                )}
              </div>

              {/* Business Activities */}
              {verificationResult.activities && verificationResult.activities.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">الأنشطة التجارية:</div>
                  <div className="flex flex-wrap gap-2">
                    {verificationResult.activities.map((activity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              {verificationResult.address && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">العنوان:</div>
                  <div className="text-sm text-gray-900">{verificationResult.address}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Simple verification status for non-detailed view */}
      {!showFullDetails && isVerified && verificationResult && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
              <span className="text-green-700 font-medium">تم التحقق من السجل التجاري</span>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verificationResult.status)}`}>
              {getStatusText(verificationResult.status)}
            </span>
          </div>
          <div className="mt-1 text-sm text-green-600">
            {verificationResult.business_name_ar} - {verificationResult.owner_name}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <Shield className="h-4 w-4 text-blue-500 mt-0.5 ml-2 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <strong>ملاحظة:</strong> يتم التحقق من السجل التجاري عبر منصة واثق الحكومية لضمان صحة البيانات والامتثال للأنظمة السعودية.
          </div>
        </div>
      </div>
    </div>
  );
}





