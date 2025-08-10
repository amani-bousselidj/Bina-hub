// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Users, MapPin, Phone, Mail, UserCheck, MessageCircle, Clock } from 'lucide-react';
import { Card, CardContent, Button } from '@/components/ui';
import { useTranslation } from '@/core/shared/hooks/useTranslation';
import SupervisorRequests from '@/components/ui';

interface Supervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  store_count: number;
  status: 'active' | 'inactive';
  stores: string[];
  created_at: string;
  agreementStatus?: 'accepted' | 'pending' | 'rejected';
  projectId?: string;
}

interface SupervisorManagementFilters {
  email?: string;
  city?: string;
}

interface SupervisorManagementProps {
  filters?: SupervisorManagementFilters;
  userId: string;
}

export default function SupervisorManagement({ filters, userId }: SupervisorManagementProps) {
  const { t, locale } = useTranslation();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreementRequests, setAgreementRequests] = useState<{ [supervisorId: string]: boolean }>({});
  const [agreementCounts, setAgreementCounts] = useState<{ [supervisorId: string]: number }>({});

  const fetchSupervisors = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/supervisors';
      const params = [];
      if (filters?.email) params.push(`email=${encodeURIComponent(filters.email)}`);
      if (filters?.city) params.push(`city=${encodeURIComponent(filters.city)}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch supervisors');
      }
      const data = await response.json();
      setSupervisors(data.supervisors || []);
      if (data.agreementCounts) setAgreementCounts(data.agreementCounts);
    } catch (err) {
      setError('Failed to load supervisors');
      console.error('Supervisors fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const requestAgreement = async (supervisorId: string) => {
    setAgreementRequests(prev => ({ ...prev, [supervisorId]: true }));
    try {
      const response = await fetch(`/api/supervisors/${supervisorId}/request-agreement`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to request supervision');
      alert(t('supervisor.requestSent'));
    } catch (err) {
      alert(t('supervisor.requestFailed'));
    } finally {
      setAgreementRequests(prev => ({ ...prev, [supervisorId]: false }));
    }
  };

  useEffect(() => {
    fetchSupervisors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-tajawal">
      <div className="container mx-auto px-6 py-8" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('supervisor.management')}</h1>
            <p className="text-gray-600">{t('supervisor.description')}</p>
          </div>
        </div>

        {/* Pending Requests Section */}
        <div className="mb-8">
          <SupervisorRequests userId={userId} isUser={true} className="w-full" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            {error}
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Supervisors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supervisors.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('supervisor.noSupervisors')}</h3>
                <p className="text-gray-600">{t('supervisor.noActiveSupervisors')}</p>
              </CardContent>
            </Card>
          ) : (
            supervisors.map((supervisor) => (
              <Card key={supervisor.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{supervisor.name}</h3>
                      <div className="mt-2 space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1" dir="ltr">{supervisor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1" dir="ltr">{supervisor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1">{supervisor.area}</span>
                        </div>
                      </div>
                      {/* Agreement Count */}
                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                        <UserCheck className="w-4 h-4" />
                        <span>{t('supervisor.agreementCount', { count: agreementCounts[supervisor.id] || 0 })}</span>
                      </div>
                      {/* Request Supervision Button */}
                      <div className="mt-4">
                        <Button
                          variant="default"
                          disabled={agreementRequests[supervisor.id]}
                          onClick={() => requestAgreement(supervisor.id)}
                        >
                          {agreementRequests[supervisor.id] ? t('supervisor.requesting') : t('supervisor.requestSupervision')}
                        </Button>
                      </div>
                      {/* Chat and Time Tracking (enable chat if agreement accepted) */}
                      <div className="mt-4 flex gap-4">
                        {supervisor.agreementStatus === 'accepted' && supervisor.projectId && (
                          <Button
                            variant="secondary"
                            onClick={() => {
                              window.location.href = `/user/chat?supervisorId=${supervisor.id}&projectId=${supervisor.projectId}`;
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {t('supervisor.chat')}
                          </Button>
                        )}
                        {(!supervisor.agreementStatus || supervisor.agreementStatus !== 'accepted') && (
                          <Button variant="secondary" disabled>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {t('supervisor.chat')}
                          </Button>
                        )}
                        <Button variant="secondary" disabled>
                          <Clock className="w-4 h-4 mr-1" />
                          {t('supervisor.timeSpent')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}





