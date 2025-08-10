// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useNotificationActions } from '@/contexts/NotificationContext'

interface StockItem {
  id: string
  name: string
  current_stock: number
  min_stock_level: number
  category: string
  sku: string
}

interface StockMonitoringProps {
  userId: string
  enabled?: boolean
  checkInterval?: number // in milliseconds
}

export const useStockMonitoring = ({ 
  userId, 
  enabled = true, 
  checkInterval = 300000 // 5 minutes
}: StockMonitoringProps) => {
  const [lowStockItems, setLowStockItems] = useState<StockItem[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const { notifyWarning, notifyError } = useNotificationActions()
  const supabase = createClientComponentClient()

  const checkStockLevels = async () => {
    if (!enabled || isChecking) return

    setIsChecking(true)
    try {
      // Query products with low stock
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, current_stock, min_stock_level, category, sku')
        .eq('user_id', userId)
        .lt('current_stock', 'min_stock_level')
        .gt('min_stock_level', 0) // Only check items with defined minimum levels

      if (error || !Array.isArray(products)) {
        console.error('Error checking stock levels:', error, 'Products:', products)
        notifyError(
          'Stock Check Failed',
          error?.message || 'Unable to check current stock levels. Please check your database schema and API keys.'
        )
        return
      }

      const currentLowStockItems = products || []
      
      // Check for newly low stock items
      const newLowStockItems = currentLowStockItems.filter(
        item => !lowStockItems.some(existing => existing.id === item.id)
      )

      // Notify about new low stock items
      newLowStockItems.forEach(item => {
        notifyWarning(
          'Low Stock Alert',
          `${item.name} (${item.sku}) has only ${item.current_stock} units left. Minimum required: ${item.min_stock_level}`,
          {
            label: 'Restock',
            onClick: () => {
              // Navigate to inventory management
              window.location.href = `/store/inventory?highlight=${item.id}`
            }
          }
        )
      })

      setLowStockItems(currentLowStockItems)

    } catch (error) {
      console.error('Stock monitoring error:', error)
      notifyError('Stock Monitoring Error', 'Failed to monitor stock levels')
    } finally {
      setIsChecking(false)
    }
  }

  // Initial check
  useEffect(() => {
    if (enabled && userId) {
      checkStockLevels()
    }
  }, [enabled, userId])

  // Set up periodic checking
  useEffect(() => {
    if (!enabled || !userId) return

    const interval = setInterval(checkStockLevels, checkInterval)
    return () => clearInterval(interval)
  }, [enabled, userId, checkInterval, lowStockItems])

  return {
    lowStockItems,
    isChecking,
    checkStockLevels,
    lowStockCount: lowStockItems.length
  }
}

// Component for displaying stock alerts
interface StockAlertsProps {
  userId: string
  className?: string
}

export const StockAlerts: React.FC<StockAlertsProps> = ({ 
  userId, 
  className = '' 
}) => {
  const { lowStockItems, lowStockCount } = useStockMonitoring({ userId })

  if (lowStockCount === 0) return null

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
        <h3 className="font-medium text-yellow-800">
          Low Stock Alert ({lowStockCount} items)
        </h3>
      </div>
      
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {lowStockItems.slice(0, 5).map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium text-yellow-800">{item.name}</span>
              <div className="text-yellow-600">
                Stock: {item.current_stock} / Min: {item.min_stock_level}
              </div>
            </div>
            <button
              onClick={() => {
                window.location.href = `/store/inventory?highlight=${item.id}`
              }}
              className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
            >
              Restock
            </button>
          </div>
        ))}
        
        {lowStockCount > 5 && (
          <div className="text-center">
            <button
              onClick={() => {
                window.location.href = '/store/inventory?filter=low-stock'
              }}
              className="text-sm text-yellow-700 hover:text-yellow-800 font-medium"
            >
              View all {lowStockCount} items →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockAlerts




