"use client";

import { useEffect, useState } from "react";
import { CacheStatsPanel } from "../../features/shared/components/cache-stats-panel";
import type { NewsArticle } from "../api/news/route";
import type { Post } from "../api/posts/route";
import type { Product } from "../api/products/route";
import type { User } from "../api/users/route";
import type { Weather } from "../api/weather/route";

interface CacheInfo {
  cacheType: "hit" | "miss" | "sw-cache" | "unknown";
  timestamp: string;
  loadTime: number;
}

type ContentType = "posts" | "users" | "products" | "news" | "weather";

export default function ServiceWorkerCachePage() {
  const [activeTab, setActiveTab] = useState<ContentType>("posts");
  const [loading, setLoading] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);

  // State for different content types
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [weather, setWeather] = useState<Weather[]>([]);

  const fetchContent = async (type: ContentType, showLoading = true) => {
    if (showLoading) setLoading(true);

    const startTime = Date.now();

    try {
      const endpoints = {
        posts: "/api/posts",
        users: "/api/users?count=15",
        products: "/api/products?count=12",
        news: "/api/news?count=10",
        weather: "/api/weather?count=6",
      };

      const response = await fetch(endpoints[type]);
      const data = await response.json();
      const loadTime = Date.now() - startTime;

      // Determine cache type based on response headers and timing
      const cacheType: CacheInfo["cacheType"] =
        response.headers.get("x-cache") === "HIT"
          ? "hit"
          : loadTime < 100
          ? "sw-cache"
          : "miss";

      setCacheInfo({
        cacheType,
        timestamp: new Date().toISOString(),
        loadTime,
      });

      // Update appropriate state
      switch (type) {
        case "posts":
          setPosts(data.data);
          break;
        case "users":
          setUsers(data.data);
          break;
        case "products":
          setProducts(data.data);
          break;
        case "news":
          setNews(data.data);
          break;
        case "weather":
          setWeather(data.data);
          break;
      }

      console.log(`✅ ${type} loaded in ${loadTime}ms - Cache: ${cacheType}`);
    } catch (error) {
      console.error(`❌ Failed to fetch ${type}:`, error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Auto-refresh every 30 seconds to demonstrate cache behavior
  useEffect(() => {
    const interval = setInterval(() => {
      fetchContent(activeTab, false);
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  // Initial load
  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  const clearCache = async () => {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      console.log("🗑️ All caches cleared");

      // Reload current content
      fetchContent(activeTab);
    }
  };

  const getCacheStatusColor = (type: CacheInfo["cacheType"]) => {
    switch (type) {
      case "hit":
        return "text-green-600 bg-green-50";
      case "sw-cache":
        return "text-blue-600 bg-blue-50";
      case "miss":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getCacheStatusText = (type: CacheInfo["cacheType"]) => {
    switch (type) {
      case "hit":
        return "✅ Server Cache Hit";
      case "sw-cache":
        return "⚡ Service Worker Cache";
      case "miss":
        return "🔄 Cache Miss";
      default:
        return "❓ Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Service Worker Cache Demo
              </h1>
              <p className="text-gray-600 mt-2">
                Explore different content types and observe caching behavior in
                real-time
              </p>
            </div>

            {/* Cache Status */}
            {cacheInfo && (
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getCacheStatusColor(
                    cacheInfo.cacheType
                  )}`}
                >
                  {getCacheStatusText(cacheInfo.cacheType)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {cacheInfo.loadTime}ms •{" "}
                  {new Date(cacheInfo.timestamp).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={() => fetchContent(activeTab)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "🔄 Loading..." : "🔄 Refresh Content"}
            </button>
            <button
              type="button"
              onClick={clearCache}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              🗑️ Clear Cache
            </button>
          </div>
        </div>

        {/* Cache Stats Panel */}
        <CacheStatsPanel />

        {/* Content Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: "posts", label: "📝 Posts", count: posts.length },
                { key: "users", label: "👥 Users", count: users.length },
                {
                  key: "products",
                  label: "🛍️ Products",
                  count: products.length,
                },
                { key: "news", label: "📰 News", count: news.length },
                { key: "weather", label: "🌤️ Weather", count: weather.length },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ContentType)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Display */}
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">
                  Loading {activeTab}...
                </span>
              </div>
            )}

            {/* Posts Content */}
            {activeTab === "posts" && posts.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{post.body}</p>
                    <div className="text-xs text-gray-500 flex items-center">
                      <span className="mr-2">🕒</span>
                      {new Date(post.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users Content */}
            {activeTab === "users" && users.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium">{user.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{user.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-medium ${
                            user.isActive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {user.isActive ? "🟢 Active" : "🔴 Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Content */}
            {activeTab === "products" && products.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-6xl">
                        {product.category === "Electronics" ? "📱" : "🛍️"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${product.price}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium">
                            {product.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({product.reviews})
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* News Content */}
            {activeTab === "news" && news.length > 0 && (
              <div className="space-y-6">
                {news.map((article) => (
                  <div
                    key={article.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="md:flex">
                      <div className="w-full md:w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <span className="text-6xl">📰</span>
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              article.category === "Technology"
                                ? "bg-blue-100 text-blue-800"
                                : article.category === "Business"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {article.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            📖 {article.readTime} min read
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-900">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{article.summary}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span className="font-medium">
                            ✍️ {article.author}
                          </span>
                          <div className="flex items-center space-x-4">
                            <span>👁️ {article.views.toLocaleString()}</span>
                            <span>❤️ {article.likes}</span>
                            <span>
                              📅{" "}
                              {new Date(
                                article.publishedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Weather Content */}
            {activeTab === "weather" && weather.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {weather.map((w) => (
                  <div
                    key={w.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {w.city}
                        </h3>
                        <p className="text-gray-600 text-sm">🌍 {w.country}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl mb-1">{w.icon}</div>
                        <div className="text-sm text-gray-600 font-medium">
                          {w.condition}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-gray-900">
                        {w.temperature}°C
                      </div>
                      <div className="text-sm text-gray-600">
                        Feels like {w.feelsLike}°C
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">💧 Humidity:</span>
                        <span className="font-medium">{w.humidity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">💨 Wind:</span>
                        <span className="font-medium">
                          {w.windSpeed} km/h {w.windDirection}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">🌡️ Pressure:</span>
                        <span className="font-medium">{w.pressure} hPa</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">☀️ UV Index:</span>
                        <span className="font-medium">{w.uvIndex}</span>
                      </div>
                    </div>

                    {/* 5-day forecast */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-2 font-medium">
                        5-Day Forecast
                      </div>
                      <div className="flex justify-between text-xs">
                        {w.forecast.map((day, index) => (
                          <div key={index} className="text-center">
                            <div className="font-medium text-gray-700">
                              {day.day}
                            </div>
                            <div className="text-lg my-1">{day.icon}</div>
                            <div className="text-gray-700 font-medium">
                              {day.high}°
                            </div>
                            <div className="text-gray-500">{day.low}°</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading &&
              ((activeTab === "posts" && posts.length === 0) ||
                (activeTab === "users" && users.length === 0) ||
                (activeTab === "products" && products.length === 0) ||
                (activeTab === "news" && news.length === 0) ||
                (activeTab === "weather" && weather.length === 0)) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {activeTab} found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try refreshing to load content
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchContent(activeTab)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Load {activeTab}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
