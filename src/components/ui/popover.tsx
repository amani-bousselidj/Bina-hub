import React, { ReactNode } from 'react';

export interface PopoverProps {
  children: ReactNode;
  content: ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ children, content }) => {
  return (
    <div className="relative">
      {children}
      <div className="absolute top-full left-0 z-50 mt-1 p-2 bg-white border rounded shadow-lg">
        {content}
      </div>
    </div>
  );
};

export const PopoverContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};

export const PopoverTrigger: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};



