import React from 'react';

interface POSAppProps {
  transactions?: any[];
  loading?: boolean;
}

export const POSApp: React.FC<POSAppProps> = ({ transactions = [], loading = false }) => {
  return (
    <div className="pos-app">
      <h2>نظام نقاط البيع</h2>
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="transactions-list">
          {transactions.map((transaction, index) => (
            <div key={index} className="transaction-item">
              <p>رقم المعاملة: {transaction.id}</p>
              <p>المبلغ: {transaction.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default POSApp;


