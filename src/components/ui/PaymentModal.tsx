import React from 'react';

export default function PaymentModal({ open, total, onClose, onPay }: {
  open: boolean;
  total: number;
  onClose: () => void;
  onPay: (method: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>
        <div className="space-y-3 mb-6">
          <button onClick={() => onPay('cash')} className="w-full bg-gray-200 py-2 rounded">Cash</button>
          <button onClick={() => onPay('card')} className="w-full bg-blue-600 text-white py-2 rounded">Card</button>
          <button onClick={() => onPay('mada')} className="w-full bg-green-600 text-white py-2 rounded">Mada</button>
          <button onClick={() => onPay('stc_pay')} className="w-full bg-yellow-400 text-white py-2 rounded">STC Pay</button>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Total:</span>
          <span className="text-lg">{total.toLocaleString('en-US')} SAR</span>
        </div>
        <button onClick={onClose} className="mt-6 w-full bg-gray-300 py-2 rounded">Cancel</button>
      </div>
    </div>
  );
}


