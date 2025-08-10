// Client-safe event utilities without Medusa server-side imports

// Event types for client-side use
export interface ClientEvent {
  type: string;
  data: any;
  timestamp: Date;
}

// Client-side event emitter
export class ClientEventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  off(event: string, callback?: Function) {
    if (!callback) {
      this.listeners.delete(event);
      return;
    }

    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}

// Global client event emitter instance
export const clientEvents = new ClientEventEmitter();

// Common client-side event types
export const ClientEventTypes = {
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  DATA_UPDATE: 'data:update',
  PAGE_NAVIGATION: 'page:navigation',
  FORM_SUBMIT: 'form:submit',
  ERROR_OCCURRED: 'error:occurred',
} as const;


