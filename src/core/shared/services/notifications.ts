// Notification Service
import { useState, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary';
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    listener([...this.notifications]);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  create(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false
    };
    
    this.notifications.unshift(newNotification);
    this.notifyListeners();
    
    return id;
  }

  info(title: string, message: string, actions?: NotificationAction[]): string {
    return this.create({ type: 'info', title, message, actions });
  }

  success(title: string, message: string, actions?: NotificationAction[]): string {
    return this.create({ type: 'success', title, message, actions });
  }

  warning(title: string, message: string, actions?: NotificationAction[]): string {
    return this.create({ type: 'warning', title, message, actions });
  }

  error(title: string, message: string, actions?: NotificationAction[]): string {
    return this.create({ type: 'error', title, message, actions });
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  remove(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.notifyListeners();
    }
  }

  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getUnread(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  getByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();

// Helper hook for React components
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    createNotification: notificationService.create.bind(notificationService),
    info: notificationService.info.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    warning: notificationService.warning.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    markAsRead: notificationService.markAsRead.bind(notificationService),
    markAllAsRead: notificationService.markAllAsRead.bind(notificationService),
    remove: notificationService.remove.bind(notificationService),
    clear: notificationService.clear.bind(notificationService),
    unreadCount: notifications.filter(n => !n.read).length
  };
}

export default notificationService;


export { NotificationService };


