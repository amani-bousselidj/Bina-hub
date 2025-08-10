import React from 'react';

interface StockAppProps {
  inventory?: any[];
  loading?: boolean;
}

export const StockApp: React.FC<StockAppProps> = ({ inventory = [], loading = false }) => {
  return (
    <div className="stock-app">
      <h2>إدارة المخزون</h2>
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="inventory-list">
          {inventory.map((item, index) => (
            <div key={index} className="inventory-item">
              <h3>{item.name}</h3>
              <p>الكمية: {item.quantity}</p>
              <p>السعر: {item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockApp;


