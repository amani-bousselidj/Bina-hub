// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Input, Textarea, Select, Modal, EmptyState } from '@/components/ui';
import { useTranslation } from '@/core/shared/hooks/useTranslation';
import { formatCurrency, formatDate } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface SupervisorRequest {
  id: string;
  user_id: string;
  supervisor_id?: string;
  project_id: string;
  project_name: string;
  request_type: 'hire' | 'consult' | 'inspection' | 'other';
  description: string;
  budget?: number;
  currency: string;
  estimated_duration?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  supervisor_response?: {
    amount: number;
    duration: string;
    message: string;
  };
}

interface Project {
  id: string;
  name: string;
}

interface SupervisorRequestsProps {
  userId: string;
  isUser: boolean; // true for user view, false for supervisor view
  supervisorId?: string;
  className?: string;
}

export default function SupervisorRequests({
  userId,
  isUser,
  supervisorId,
  className
}: SupervisorRequestsProps) {
  const { t, locale } = useTranslation();
  
  const [requests, setRequests] = useState<SupervisorRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New request form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    project_id: '',
    request_type: 'hire',
    description: '',
    budget: 0,
    estimated_duration: ''
  });
  
  // Response form state
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupervisorRequest | null>(null);
  const [responseForm, setResponseForm] = useState({
    amount: 0,
    duration: '',
    message: ''
  });

  // Filter options
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fetch requests on component mount
  useEffect(() => {
    fetchRequests();
    if (isUser) {
      fetchUserProjects();
    }
  }, [userId, isUser, supervisorId, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (isUser) {
        queryParams.append('userId', userId);
      } else if (supervisorId) {
        queryParams.append('supervisorId', supervisorId);
      }
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }

      const response = await fetch(`/api/supervisor-requests?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setRequests(data.requests);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetch(`/api/projects?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
    }
  };
  const handleRequestFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm({
      ...requestForm,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    });
  };

  const handleResponseFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResponseForm({
      ...responseForm,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    });
  };

  const submitRequest = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/supervisor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          userId,
          ...requestForm
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const data = await response.json();
      setRequests([...requests, data.request]);
      setShowRequestForm(false);
      resetRequestForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting request');
      console.error('Error submitting request:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!selectedRequest) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/supervisor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'respond',
          requestId: selectedRequest.id,
          supervisorId: userId, // Current supervisor user ID
          ...responseForm
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
      }

      const data = await response.json();
      
      // Update the request in the list
      setRequests(requests.map(req => 
        req.id === data.request.id ? data.request : req
      ));
      
      setShowResponseForm(false);
      resetResponseForm();
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting response');
      console.error('Error submitting response:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetRequestForm = () => {
    setRequestForm({
      project_id: '',
      request_type: 'hire',
      description: '',
      budget: 0,
      estimated_duration: ''
    });
  };
  const resetResponseForm = () => {
    setResponseForm({
      amount: 0,
      duration: '',
      message: ''
    });
  };

  const handleUpdateStatus = async (requestId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/supervisor-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-status',
          requestId,
          status
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status} request`);
      }

      const data = await response.json();
      
      // Update the request in the list
      setRequests(requests.map(req => 
        req.id === data.request.id ? data.request : req
      ));
    } catch (err: any) {
      setError(err.message || `An error occurred while updating request status to ${status}`);
      console.error('Error updating request status:', err);
    } finally {
      setLoading(false);
    }
  };

  const openResponseForm = (request: SupervisorRequest) => {
    setSelectedRequest(request);
    // Pre-fill the form if there's an existing response
    if (request.supervisor_response) {
      setResponseForm({
        amount: request.supervisor_response.amount,
        duration: request.supervisor_response.duration,
        message: request.supervisor_response.message
      });
    } else {
      resetResponseForm();
    }
    setShowResponseForm(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      pending: { color: 'bg-yellow-500', label: t('request.status.pending') },
      approved: { color: 'bg-green-500', label: t('request.status.approved') },
      rejected: { color: 'bg-red-500', label: t('request.status.rejected') },
      in_progress: { color: 'bg-blue-500', label: t('request.status.inProgress') },
      completed: { color: 'bg-purple-500', label: t('request.status.completed') },
      cancelled: { color: 'bg-gray-500', label: t('request.status.cancelled') }
    };
    
    const statusInfo = statusMap[status] || { color: 'bg-gray-500', label: status };
    
    return (
      <Badge className={`${statusInfo.color} text-white`}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('request.title')}</CardTitle>          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
              className="w-32"
              options={[
                { value: "all", label: t('all') },
                { value: "pending", label: t('request.status.pending') },
                { value: "approved", label: t('request.status.approved') },
                { value: "rejected", label: t('request.status.rejected') },
                { value: "in_progress", label: t('request.status.inProgress') },
                { value: "completed", label: t('request.status.completed') },
                { value: "cancelled", label: t('request.status.cancelled') }
              ]}
            />
            {isUser && (
              <Button onClick={() => setShowRequestForm(true)}>
                {t('request.new')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading && requests.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchRequests} 
                className="ml-2"
              >
                {t('retry')}
              </Button>
            </div>
          ) : requests.length === 0 ? (            <EmptyState
              icon="📋"
              title={t('request.empty.title')}
              description={t('request.empty.description')}
              actionLabel={isUser ? t('request.new') : undefined}
              onAction={isUser ? () => setShowRequestForm(true) : undefined}
            />
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          {request.project_name} - {t(`request.type.${request.request_type}`)}
                        </h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>{t('request.created')}: {formatDate(request.created_at, locale)}</span>
                        {request.budget && (
                          <span>{t('request.budget')}: {formatCurrency(request.budget, request.currency)}</span>
                        )}
                        {request.estimated_duration && (
                          <span>{t('request.duration')}: {request.estimated_duration}</span>
                        )}
                      </div>

                      {request.supervisor_response && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <h4 className="font-medium text-sm mb-1">{t('request.supervisorResponse')}</h4>
                          <p className="text-sm">{request.supervisor_response.message}</p>
                          <div className="flex gap-4 mt-1 text-sm">
                            <span>{t('request.amount')}: {formatCurrency(request.supervisor_response.amount, request.currency)}</span>
                            <span>{t('request.duration')}: {request.supervisor_response.duration}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-gray-50 flex md:flex-col justify-end items-center gap-2 border-t md:border-t-0 md:border-l">
                      {!isUser && request.status === 'pending' && (
                        <Button onClick={() => openResponseForm(request)}>
                          {t('request.respond')}
                        </Button>
                      )}
                        {isUser && request.supervisor_response && request.status === 'pending' && (                        <>
                          <Button 
                            variant="default"
                            onClick={() => {
                              handleUpdateStatus(request.id, 'approved');
                            }}
                          >
                            {t('request.approve')}
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => {
                              handleUpdateStatus(request.id, 'rejected');
                            }}
                          >
                            {t('request.reject')}
                          </Button>
                        </>
                      )}
                        {(request.status === 'approved' || request.status === 'in_progress') && (
                        <Button 
                          variant="outline"
                          onClick={() => {
                            // Navigate to the chat for this supervisor and project
                            window.location.href = `/user/chat?supervisorId=${request.supervisor_id}&projectId=${request.project_id}`;
                          }}
                        >
                          {t('request.details')}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Request Modal */}      {showRequestForm && (
        <Modal
          isOpen={showRequestForm}
          title={t('request.new')}
          onClose={() => setShowRequestForm(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.project')}
              </label>              <Select
                name="project_id"
                value={requestForm.project_id}
                onChange={handleRequestFormChange}
                required
                options={[
                  { value: "", label: t('request.selectProject') },
                  ...projects.map((project) => ({
                    value: project.id,
                    label: project.name
                  }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.type.label')}
              </label>              <Select
                name="request_type"
                value={requestForm.request_type}
                onChange={handleRequestFormChange}
                required
                options={[
                  { value: "hire", label: t('request.type.hire') },
                  { value: "consult", label: t('request.type.consult') },
                  { value: "inspection", label: t('request.type.inspection') },
                  { value: "other", label: t('request.type.other') }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.description')}
              </label>
              <Textarea
                name="description"
                value={requestForm.description}
                onChange={handleRequestFormChange}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {t('request.budget')} (SAR)
                </label>
                <Input
                  name="budget"
                  type="number"
                  value={requestForm.budget || ''}
                  onChange={handleRequestFormChange}
                  min="0"
                  step="100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {t('request.estimatedDuration')}
                </label>
                <Input
                  name="estimated_duration"
                  value={requestForm.estimated_duration}
                  onChange={handleRequestFormChange}
                  placeholder="e.g., 2 weeks"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowRequestForm(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={submitRequest}
                disabled={loading || !requestForm.project_id || !requestForm.description}
              >
                {loading ? <LoadingSpinner size="sm" /> : t('request.submit')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Response Modal */}      {showResponseForm && selectedRequest && (
        <Modal
          isOpen={showResponseForm}
          title={t('request.respond')}
          onClose={() => setShowResponseForm(false)}
        >
          <div className="mb-4">
            <h3 className="font-medium">{selectedRequest.project_name}</h3>
            <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
            {selectedRequest.budget && (
              <p className="text-sm mt-1">
                {t('request.budget')}: {formatCurrency(selectedRequest.budget, selectedRequest.currency)}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.proposedAmount')} (SAR)
              </label>
              <Input
                name="amount"
                type="number"
                value={responseForm.amount || ''}
                onChange={handleResponseFormChange}
                min="0"
                step="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.proposedDuration')}
              </label>
              <Input
                name="duration"
                value={responseForm.duration}
                onChange={handleResponseFormChange}
                placeholder="e.g., 2 weeks"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('request.message')}
              </label>
              <Textarea
                name="message"
                value={responseForm.message}
                onChange={handleResponseFormChange}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowResponseForm(false)}
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={submitResponse}
                disabled={loading || !responseForm.amount || !responseForm.duration || !responseForm.message}
              >
                {loading ? <LoadingSpinner size="sm" /> : t('request.sendResponse')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}







