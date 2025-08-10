// @ts-nocheck
'use client'

import React from 'react'

interface SimpleLayoutProps {
  children: React.ReactNode
  title?: string
}

const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex flex-col min-h-screen">
        {/* Optional Title Header */}
        {title && (
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="h-16 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  {title}
                </h1>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default SimpleLayout




