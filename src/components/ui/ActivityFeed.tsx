// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';

interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
}

export function ActivityFeed({ storeId }: { storeId: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  
  useEffect(() => {
    // For now, we'll create some sample events
    // In a real implementation, this would fetch from an API
    const sampleEvents: ActivityEvent[] = [
      {
        id: '1',
        type: 'order',
        description: 'تم إنشاء طلب جديد #12345',
        user: 'النظام',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'product',
        description: 'تم إضافة منتج جديد: أسمنت بورتلاند',
        user: 'المدير',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'customer',
        description: 'تم تسجيل عميل جديد',
        user: 'النظام',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
    
    setEvents(sampleEvents);
  }, [storeId]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'product':
        return '📦';
      case 'customer':
        return '👤';
      default:
        return '📋';
    }
  };

  return (
    <div className="activity-feed">
      <h2 className="text-lg font-semibold mb-4">سجل النشاطات</h2>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 text-xl">
              {getEventIcon(event.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{event.description}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{event.user}</span>
                <span>•</span>
                <span>{formatTimestamp(event.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




