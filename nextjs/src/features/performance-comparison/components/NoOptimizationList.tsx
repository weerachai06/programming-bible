'use client'

import { useState } from 'react'
import { generateMockData } from '../helpers'
import type { ListItem } from '../types'
import { PerformanceMetrics } from './PerformanceMetrics'

interface NoOptimizationListProps {
  itemCount?: number
}

// Generated by Copilot
export const NoOptimizationList = ({
  itemCount = 10000,
}: NoOptimizationListProps) => {
  const [items] = useState<ListItem[]>(() => generateMockData(itemCount))

  return (
    <div className="p-4">
      <PerformanceMetrics
        technique="no-optimization"
        itemCount={items.length}
      />

      <div className="h-96 overflow-y-auto border border-gray-300 rounded-lg mt-4">
        <div className="p-4">
          {items.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 mb-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {item.category}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{item.date}</p>
                <p className="text-xs text-gray-400">ID: {item.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> All 100,000 items are rendered in the DOM. This
          causes slow scrolling and high memory usage.
        </p>
      </div>
    </div>
  )
}
