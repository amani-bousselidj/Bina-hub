// @ts-nocheck
import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array(rows)
        .fill(null)
        .map((_, i) => (
          <tr key={i} className="animate-pulse">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </td>
          </tr>
        ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}




