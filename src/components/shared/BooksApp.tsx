import React from 'react';

interface BooksAppProps {
  books?: any[];
  loading?: boolean;
}

export const BooksApp: React.FC<BooksAppProps> = ({ books = [], loading = false }) => {
  return (
    <div className="books-app">
      <h2>مكتبة الكتب</h2>
      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="books-grid">
          {books.map((book, index) => (
            <div key={index} className="book-item">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksApp;


