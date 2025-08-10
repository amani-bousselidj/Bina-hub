import React from 'react';

interface ReceiptPrinterProps {
  receiptData: {
    items: Array<{ name: string; qty: number; price: number }>;
    total: number;
    paymentMethod: string;
    cashier: string;
    date: string;
  };
}

// This component renders a printable receipt view for the POS
const ReceiptPrinter: React.FC<ReceiptPrinterProps> = ({ receiptData }) => {
  return (
    <div className="receipt-print-area" style={{ width: 300, padding: 16, background: '#fff', color: '#222', fontFamily: 'monospace' }}>
      <h2 style={{ textAlign: 'center', margin: 0 }}>Binna POS</h2>
      <div style={{ fontSize: 12, textAlign: 'center', marginBottom: 8 }}>{receiptData.date}</div>
      <hr />
      <div>
        {receiptData.items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span>{item.name} x{item.qty}</span>
            <span>{(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 16 }}>
        <span>Total</span>
        <span>{receiptData.total.toFixed(2)}</span>
      </div>
      <div style={{ fontSize: 12, marginTop: 8 }}>Payment: {receiptData.paymentMethod}</div>
      <div style={{ fontSize: 12 }}>Cashier: {receiptData.cashier}</div>
      <div style={{ textAlign: 'center', fontSize: 10, marginTop: 12 }}>
        Thank you for shopping!
      </div>
    </div>
  );
};

export default ReceiptPrinter;


