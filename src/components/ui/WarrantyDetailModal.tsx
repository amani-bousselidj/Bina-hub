// @ts-nocheck
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Database } from '@/core/shared/types/database';
import { Card, LoadingSpinner } from '@/components/ui';
import {
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  FileText,
  Plus,
} from 'lucide-react';
import WarrantyClaimForm from '@/components/warranties/WarrantyClaimForm';
import WarrantyTransferForm from '@/components/warranties/WarrantyTransferForm';
import WarrantyDocs from '@/components/warranties/WarrantyDocs';

interface Action {
  type: 'claim' | 'transfer' | 'docs';
  warrantyId: string;
}

export default function WarrantyDetailModal({
  warranty,
  isOpen,
  onClose,
}: {
  warranty: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);

  const handleActionSuccess = () => {
    setCurrentAction(null);
    onClose();
    window.location.reload(); // Refresh to see updates
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-3xl my-8 p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              {currentAction ? (
                currentAction.type === 'claim' ? (
                  <WarrantyClaimForm
                    warrantyId={currentAction.warrantyId}
                    onClose={() => setCurrentAction(null)}
                    onSuccess={handleActionSuccess}
                  />
                ) : currentAction.type === 'transfer' ? (
                  <WarrantyTransferForm
                    warrantyId={currentAction.warrantyId}
                    onClose={() => setCurrentAction(null)}
                    onSuccess={handleActionSuccess}
                  />
                ) : (
                  <WarrantyDocs warrantyId={currentAction.warrantyId} />
                )
              ) : (
                <>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    Warranty Details
                  </Dialog.Title>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-medium text-gray-700">Product Details</h4>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="text-gray-500">Name:</span> {warranty.product_name}
                        </p>
                        <p>
                          <span className="text-gray-500">Brand:</span> {warranty.brand}
                        </p>
                        <p>
                          <span className="text-gray-500">Model:</span> {warranty.model}
                        </p>
                        <p>
                          <span className="text-gray-500">Serial Number:</span>{' '}
                          {warranty.serial_number}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700">Warranty Coverage</h4>
                      <div className="mt-2 space-y-2">
                        <p>
                          <span className="text-gray-500">Type:</span> {warranty.warranty_type}
                        </p>
                        <p>
                          <span className="text-gray-500">Start Date:</span>{' '}
                          {new Date(warranty.warranty_start_date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="text-gray-500">End Date:</span>{' '}
                          {new Date(warranty.warranty_end_date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="text-gray-500">Duration:</span>{' '}
                          {warranty.warranty_period_months} months
                        </p>
                      </div>
                    </div>
                  </div>

                  {warranty.coverage_description && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-700 mb-2">Coverage Description</h4>
                      <p className="text-gray-600">{warranty.coverage_description}</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-8">
                    {warranty.status === 'active' && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentAction({ type: 'claim', warrantyId: warranty.id })
                          }
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          Submit Claim
                        </button>
                        {warranty.is_transferable && (
                          <button
                            onClick={() =>
                              setCurrentAction({ type: 'transfer', warrantyId: warranty.id })
                            }
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          >
                            Transfer Warranty
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => setCurrentAction({ type: 'docs', warrantyId: warranty.id })}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                      Manage Documents
                    </button>
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}





