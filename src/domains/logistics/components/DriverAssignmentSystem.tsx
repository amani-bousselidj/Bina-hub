// @ts-nocheck
"use client";
// Driver Assignment System
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';

export function DriverAssignmentSystem() {
  const [drivers] = useState([
    { id: '1', name: 'Ahmed Ali', status: 'available', location: 'Kuwait City' },
    { id: '2', name: 'Mohammad Hassan', status: 'busy', location: 'Hawalli' }
  ]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Assignment System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drivers.map(driver => (
            <div key={driver.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <div className="font-medium">{driver.name}</div>
                <div className="text-sm text-gray-500">{driver.location}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {driver.status}
                </span>
                <Button size="sm" onClick={() => alert('Button clicked')}>Assign</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DriverAssignmentSystem;



