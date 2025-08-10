// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, className }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={classNames('relative w-full h-4 bg-gray-200 rounded', className)}>
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 rounded"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default Progress;




