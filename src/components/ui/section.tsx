import React from 'react';

interface SectionRowProps {
  title: string;
  value?: React.ReactNode;
}

export const SectionRow = ({ title, value }: SectionRowProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-6 border-b border-gray-100">
      <span className="text-sm font-medium text-gray-700">{title}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
};


