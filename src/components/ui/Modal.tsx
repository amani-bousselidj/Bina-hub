// @ts-nocheck
import React from 'react';

export function Modal({ 
  open, 
  isOpen, 
  onClose, 
  children, 
  title 
}: { 
  open?: boolean; 
  isOpen?: boolean; 
  onClose: () => void; 
  children: React.ReactNode; 
  title?: string;
}) {
  const isModalOpen = open || isOpen;
  
  if (!isModalOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 min-w-[300px] max-w-md mx-4">
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl leading-none" 
          onClick={onClose}
        >
          ×
        </button>
        {title && (
          <h2 className="text-lg font-semibold mb-4 pr-6">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}




