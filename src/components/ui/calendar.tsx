import React from 'react';

export interface CalendarProps {
  selected?: Date;
  onSelect: (date?: Date) => void;
  disabled?: (date: Date) => boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="p-4 border rounded">
      <input
        type="date"
        value={selected ? selected.toISOString().split('T')[0] : ''}
        onChange={(e) => {
          onSelect(e.target.value ? new Date(e.target.value) : undefined);
        }}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};


