"use client";

import { useEffect, useState } from "react";

interface CacheStats {
  name: string;
  estimatedSize: number;
  keyCount: number;
  lastAccessed: string;
}

interface PerformanceMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
}

export function CacheStatsPanel() {
  const [cacheStats, setCacheStats] = useState<CacheStats[]>([]);
  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics | null>(null);
  const [serviceWorkerStatus, setServiceWorkerStatus] =
    useState<string>("checking");

  const loadCacheStats = async () => {
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        const stats: CacheStats[] = [];

        for (const name of cacheNames) {
          const cache = await caches.open(name);
          const keys = await cache.keys();

          stats.push({
            name,
            estimatedSize: keys.length * 1024, // Rough estimate
            keyCount: keys.length,
            lastAccessed: new Date().toISOString(),
          });
        }

        setCacheStats(stats);
      } catch (error) {
        console.error("Failed to load cache stats:", error);
      }
    }
  };

  const loadPerformanceMetrics = () => {
    if ("performance" in window) {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      setPerformanceMetrics({
        navigationStart: 0, // Always 0 as baseline
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || 0,
        firstContentfulPaint:
          paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
          0,
      });
    }
  };

  const checkServiceWorkerStatus = () => {
    if ("serviceWorker" in navigator) {
      if (navigator.serviceWorker.controller) {
        setServiceWorkerStatus("active");
      } else {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            if (registration.installing) {
              setServiceWorkerStatus("installing");
            } else if (registration.waiting) {
              setServiceWorkerStatus("waiting");
            } else if (registration.active) {
              setServiceWorkerStatus("ready");
            }
          } else {
            setServiceWorkerStatus("not-registered");
          }
        });
      }
    } else {
      setServiceWorkerStatus("not-supported");
    }
  };

  useEffect(() => {
    loadCacheStats();
    loadPerformanceMetrics();
    checkServiceWorkerStatus();

    // Refresh cache stats every 10 seconds
    const interval = setInterval(loadCacheStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "ready":
        return "text-blue-600 bg-blue-50";
      case "installing":
        return "text-yellow-600 bg-yellow-50";
      case "waiting":
        return "text-orange-600 bg-orange-50";
      case "not-registered":
        return "text-red-600 bg-red-50";
      case "not-supported":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "✅ Active & Controlling";
      case "ready":
        return "🟦 Ready";
      case "installing":
        return "🔄 Installing";
      case "waiting":
        return "⏳ Waiting";
      case "not-registered":
        return "❌ Not Registered";
      case "not-supported":
        return "🚫 Not Supported";
      default:
        return "❓ Checking...";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-900">
        Cache & Performance Monitor
      </h2>

      {/* Service Worker Status */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Service Worker Status</h3>
        <div
          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
            serviceWorkerStatus
          )}`}
        >
          {getStatusText(serviceWorkerStatus)}
        </div>
      </div>

      {/* Cache Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Cache Statistics</h3>
        {cacheStats.length > 0 ? (
          <div className="space-y-3">
            {cacheStats.map((cache) => (
              <div key={cache.name} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 break-all">
                    {cache.name}
                  </h4>
                  <button
                    type="button"
                    onClick={async () => {
                      await caches.delete(cache.name);
                      loadCacheStats();
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Entries:</span>
                    <span className="ml-2 font-medium">{cache.keyCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Est. Size:</span>
                    <span className="ml-2 font-medium">
                      {formatBytes(cache.estimatedSize)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div className="text-sm text-gray-500 mt-2">
              Total Caches: {cacheStats.length} | Total Entries:{" "}
              {cacheStats.reduce((sum, cache) => sum + cache.keyCount, 0)} |
              Est. Total Size:{" "}
              {formatBytes(
                cacheStats.reduce((sum, cache) => sum + cache.estimatedSize, 0)
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No caches found</p>
        )}
      </div>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Page Load</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">DOM Content Loaded:</span>
                  <span className="font-medium">
                    {Math.round(performanceMetrics.domContentLoaded)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Load Complete:</span>
                  <span className="font-medium">
                    {Math.round(performanceMetrics.loadComplete)}ms
                  </span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Paint Metrics</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">First Paint:</span>
                  <span className="font-medium">
                    {Math.round(performanceMetrics.firstPaint)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">First Contentful Paint:</span>
                  <span className="font-medium">
                    {Math.round(performanceMetrics.firstContentfulPaint)}ms
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loadCacheStats}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Refresh Stats
        </button>
        <button
          type="button"
          onClick={async () => {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
            loadCacheStats();
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          Clear All Caches
        </button>
        <button
          type="button"
          onClick={() => {
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker
                .getRegistrations()
                .then((registrations) => {
                  registrations.forEach((registration) =>
                    registration.unregister()
                  );
                  setServiceWorkerStatus("not-registered");
                });
            }
          }}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
        >
          Unregister SW
        </button>
      </div>
    </div>
  );
}
