/**
 * Service Worker for Binna PWA
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'binna-pwa-v1'
const STATIC_CACHE_NAME = 'binna-static-v1'
const DYNAMIC_CACHE_NAME = 'binna-dynamic-v1'

// Resources to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/store',
  '/store/pos',
  '/store/pos/offline',
  '/store/inventory',
  '/store/orders',
  '/store/analytics',
  '/store/notifications',
  '/store/search',
  '/store/reports',
  // Phase 2 Integration Pages
  '/store/payments',
  '/store/shipping',
  '/store/erp',
  '/offline',
  '/manifest.json',
  // Add critical CSS and JS files
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main.js',
  // Add icon files
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/store/products',
  '/api/store/inventory',
  '/api/store/customers'
]

// Background sync tags
const SYNC_TAGS = {
  TRANSACTIONS: 'sync-transactions',
  INVENTORY: 'sync-inventory',
  CUSTOMERS: 'sync-customers'
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('✅ Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return
  }

  // Handle different types of requests
  if (request.url.includes('/api/')) {
    // API requests - Network First strategy
    event.respondWith(networkFirstStrategy(request))
  } else if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    // Static assets - Cache First strategy
    event.respondWith(cacheFirstStrategy(request))
  } else {
    // Other requests - Stale While Revalidate strategy
    event.respondWith(staleWhileRevalidateStrategy(request))
  }
})

// Network First Strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // If successful, update cache and return response
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('🌐 Network failed, trying cache for:', request.url)
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // If no cache and it's an API request, return offline response
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'No network connection available',
          offline: true 
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // For other requests, return offline page
    return caches.match('/offline')
  }
}

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('❌ Failed to fetch static asset:', request.url)
    return new Response('Asset not available offline', { status: 404 })
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  const networkResponsePromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch((error) => {
      console.log('🌐 Network error for:', request.url, error)
      return null
    })
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkResponsePromise.catch(() => {}) // Ignore errors
    return cachedResponse
  }
  
  // Wait for network if no cache
  const networkResponse = await networkResponsePromise
  return networkResponse || caches.match('/offline')
}

// Background Sync - handle offline transactions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag)
  
  if (event.tag === SYNC_TAGS.TRANSACTIONS) {
    event.waitUntil(syncTransactions())
  } else if (event.tag === SYNC_TAGS.INVENTORY) {
    event.waitUntil(syncInventory())
  } else if (event.tag === SYNC_TAGS.CUSTOMERS) {
    event.waitUntil(syncCustomers())
  } else if (event.tag === 'push-subscription-update') {
    event.waitUntil(updatePushSubscription())
  }
})

// Sync offline transactions
async function syncTransactions() {
  try {
    console.log('🔄 Syncing offline transactions...')
    
    // Get offline transactions from IndexedDB/SQLite
    const response = await fetch('/api/sync/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      console.log('✅ Transactions synced successfully')
      
      // Notify all clients about successful sync
      const clients = await self.clients.matchAll()
      clients.forEach(client => {
        client.postMessage({
          type: 'SYNC_SUCCESS',
          data: { type: 'transactions' }
        })
      })
    } else {
      throw new Error('Sync failed')
    }
  } catch (error) {
    console.error('❌ Failed to sync transactions:', error)
    
    // Notify clients about sync failure
    const clients = await self.clients.matchAll()
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_FAILED',
        data: { type: 'transactions', error: error.message }
      })
    })
  }
}

// Sync inventory updates
async function syncInventory() {
  try {
    console.log('🔄 Syncing inventory updates...')
    
    const response = await fetch('/api/sync/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      console.log('✅ Inventory synced successfully')
    }
  } catch (error) {
    console.error('❌ Failed to sync inventory:', error)
  }
}

// Sync customer data
async function syncCustomers() {
  try {
    console.log('🔄 Syncing customer data...')
    
    const response = await fetch('/api/sync/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (response.ok) {
      console.log('✅ Customers synced successfully')
    }
  } catch (error) {
    console.error('❌ Failed to sync customers:', error)
  }
}

// Update push subscription
async function updatePushSubscription() {
  try {
    console.log('🔄 Updating push subscription...')
    
    const subscription = await self.registration.pushManager.getSubscription()
    
    if (subscription) {
      const response = await fetch('/api/notifications/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      })
      
      if (response.ok) {
        console.log('✅ Push subscription updated successfully')
      }
    }
  } catch (error) {
    console.error('❌ Failed to update push subscription:', error)
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received:', event);
  
  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  let notificationData;
  try {
    notificationData = event.data.json();
  } catch (error) {
    console.error('Failed to parse push data:', error);
    notificationData = {
      title: 'إشعار من منصة بنا',
      body: event.data.text() || 'لديك إشعار جديد',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png'
    };
  }

  const notificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || '/icons/icon-192x192.png',
    badge: notificationData.badge || '/icons/icon-72x72.png',
    tag: notificationData.tag || 'binna-notification',
    data: notificationData.data || {},
    requireInteraction: true,
    actions: notificationData.actions || [
      {
        action: 'view',
        title: 'عرض',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'إغلاق'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationOptions)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'dismiss') {
    return;
  }
  
  let urlToOpen = '/';
  
  // Determine URL based on notification data
  if (data.type === 'order') {
    urlToOpen = `/store/orders/${data.orderId}`;
  } else if (data.type === 'price_alert') {
    urlToOpen = `/products/${data.productId}`;
  } else if (data.type === 'promotion') {
    urlToOpen = `/promotions/${data.promotionId}`;
  } else if (data.type === 'delivery') {
    urlToOpen = `/store/delivery/${data.deliveryId}`;
  } else if (data.url) {
    urlToOpen = data.url;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no existing window/tab, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notification closed:', event);
  
  // Track notification close event for analytics
  const data = event.notification.data;
  if (data.trackClose) {
    // Send analytics data
    fetch('/api/analytics/notification-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notificationId: data.id,
        timestamp: Date.now()
      })
    }).catch(error => console.error('Failed to track notification close:', error));
  }
});

// Update push subscription
async function updatePushSubscription() {
  try {
    const subscription = await self.registration.pushManager.getSubscription();
    if (subscription) {
      const response = await fetch('/api/notifications/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      
      console.log('✅ Push subscription updated successfully');
    }
  } catch (error) {
    console.error('❌ Failed to update push subscription:', error);
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('📞 Message received from main thread:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data && event.data.type === 'SEND_TEST_NOTIFICATION') {
    // Send a test notification
    self.registration.showNotification('إشعار تجريبي من بنا', {
      body: 'هذا إشعار تجريبي للتأكد من عمل النظام',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'test-notification',
      data: { type: 'test' },
      actions: [
        { action: 'view', title: 'عرض' },
        { action: 'dismiss', title: 'إغلاق' }
      ]
    });
  }
});

// Handle periodic background sync for push notifications
self.addEventListener('periodicsync', (event) => {
  console.log('⏰ Periodic sync triggered:', event.tag);
  
  if (event.tag === 'push-notification-check') {
    event.waitUntil(checkForPendingNotifications());
  }
});

async function checkForPendingNotifications() {
  try {
    const response = await fetch('/api/notifications/pending', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const notifications = await response.json();
      
      for (const notification of notifications) {
        await self.registration.showNotification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/icons/icon-192x192.png',
          badge: notification.badge || '/icons/icon-72x72.png',
          tag: notification.tag || 'binna-notification',
          data: notification.data || {},
          actions: notification.actions || []
        });
      }
      
      console.log(`📨 Displayed ${notifications.length} pending notifications`);
    }
  } catch (error) {
    console.error('❌ Failed to check for pending notifications:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('❌ Service Worker error:', event.error)
})

self.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection in SW:', event.reason)
})
