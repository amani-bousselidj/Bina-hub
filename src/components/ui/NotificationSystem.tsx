// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/core/shared/types/database';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, Info, AlertTriangle, X } from 'lucide-react';
import * as ReactDOM from 'react-dom';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  duration?: number;
}

const iconMap = {
  info: <Info className="w-5 h-5 text-blue-600" />,
  success: <Check className="w-5 h-5 text-green-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-orange-600" />,
  error: <AlertTriangle className="w-5 h-5 text-red-600" />,
};

const backgroundMap = {
  info: 'bg-blue-50 border-blue-200',
  success: 'bg-green-50 border-green-200',
  warning: 'bg-orange-50 border-orange-200',
  error: 'bg-red-50 border-red-200',
};

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'notification-portal';
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container.parentNode === document.body) {
        document.body.removeChild(container);
      }
    };
  }, []);

  if (!portalContainer) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`${
              backgroundMap[notification.type]
            } border rounded-lg shadow-lg p-4 max-w-md`}
          >
            <div className="flex items-start gap-3">
              {iconMap[notification.type]}
              <div className="flex-1">
                {notification.title && (
                  <h3 className="font-medium text-gray-900">{notification.title}</h3>
                )}
                <p className="text-gray-600">{notification.message}</p>
              </div>
              <button
                onClick={() => {
                  setNotifications((prev: any) => prev.filter((n) => n.id !== notification.id));
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    portalContainer
  );
}




