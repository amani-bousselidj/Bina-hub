// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotificationProvider } from '@/components/ui/NotificationSystem'

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
}

const navigation = [
  { name: 'Dashboard', href: '/store/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/store/products', icon: CubeIcon },
  { name: 'Inventory', href: '/store/inventory', icon: ShoppingCartIcon },
  { name: 'Orders', href: '/store/orders', icon: TruckIcon },
  { name: 'Suppliers', href: '/store/suppliers', icon: UserGroupIcon },
  { name: 'Invoices', href: '/store/invoices', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/store/analytics-enhanced', icon: ChartBarIcon },
  { name: 'Settings', href: '/store/settings', icon: Cog6ToothIcon },
]

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  const sidebarVariants: Variants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  }

  const overlayVariants = {
    open: {
      opacity: 1,
      pointerEvents: "auto" as const
    },
    closed: {
      opacity: 0,
      pointerEvents: "none" as const
    }
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.div
          initial={isMobile ? "closed" : "open"}
          animate={sidebarOpen || !isMobile ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg md:relative md:translate-x-0 md:shadow-none md:border-r border-gray-200"
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 md:justify-center">
            <h1 className="text-xl font-bold text-gray-900">Binna Store</h1>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          <nav className="mt-4 px-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className={`${isMobile ? '' : 'md:ml-64'} flex flex-col min-h-screen`}>
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center gap-4">
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <Bars3Icon className="h-6 w-6" />
                  </button>
                )}
                {title && (
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                  </h2>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* NotificationSystem removed - using react-hot-toast provider */}
                
                {/* User Menu */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">Store Owner</p>
                    <p className="text-xs text-gray-500">Premium Account</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-700">SO</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  )
}

export default MobileLayout




