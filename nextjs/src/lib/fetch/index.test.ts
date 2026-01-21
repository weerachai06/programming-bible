import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FetchClient, http } from './index'

describe('FetchClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    global.setTimeout = vi.fn((cb, delay) => {
      setTimeout(cb, delay)
      return 123 as any
    })
    global.clearTimeout = vi.fn()
  })

  describe('constructor', () => {
    it('should initialize with default config', () => {
      const client = new FetchClient()
      
      expect(client.defaults).toEqual({
        baseURL: '',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(client.interceptors).toHaveProperty('request')
      expect(client.interceptors).toHaveProperty('response')
    })

    it('should merge custom config with defaults', () => {
      const config = {
        baseURL: 'https://api.example.com',
        headers: { 'Authorization': 'Bearer token' },
        timeout: 5000,
      }
      const client = new FetchClient(config)
      
      expect(client.defaults).toEqual({
        baseURL: 'https://api.example.com',
        headers: {
          'Authorization': 'Bearer token',
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      })
    })
  })

  describe('interceptor management', () => {
    it('should add request interceptors', () => {
      const client = new FetchClient()
      const interceptor = vi.fn((config) => config)
      
      const id = client.interceptors.request.use(interceptor)
      
      expect(typeof id).toBe('number')
      expect(client.interceptors.request.handlers[id]).toEqual({
        fulfilled: interceptor,
        rejected: undefined,
      })
    })

    it('should add response interceptors', () => {
      const client = new FetchClient()
      const interceptor = vi.fn((response) => response)
      
      const id = client.interceptors.response.use(interceptor)
      
      expect(client.interceptors.response.handlers[id]).toEqual({
        fulfilled: interceptor,
        rejected: undefined,
      })
    })

    it('should remove interceptors', () => {
      const client = new FetchClient()
      const interceptor = vi.fn()
      
      const id = client.interceptors.request.use(interceptor)
      client.interceptors.request.eject(id)
      
      expect(client.interceptors.request.handlers[id]).toBeNull()
    })
  })

  describe('request method', () => {
    it('should make a basic GET request', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const response = await client.request('/test')
      
      expect(global.fetch).toHaveBeenCalledWith('/test', {
        baseURL: '',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(response).toBe(mockResponse)
    })

    it('should handle baseURL', async () => {
      const client = new FetchClient({ baseURL: 'https://api.example.com' })
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.request('/test')
      
      expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/test', expect.any(Object))
    })

    it('should not modify absolute URLs with baseURL', async () => {
      const client = new FetchClient({ baseURL: 'https://api.example.com' })
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.request('https://other.com/test')
      
      expect(global.fetch).toHaveBeenCalledWith('https://other.com/test', expect.any(Object))
    })

    it('should run request interceptors', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const interceptor = vi.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Custom': 'test' }
      }))
      client.interceptors.request.use(interceptor)
      
      await client.request('/test')
      
      expect(interceptor).toHaveBeenCalled()
      expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        headers: expect.objectContaining({
          'X-Custom': 'test'
        })
      }))
    })

    it('should run response interceptors', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const interceptor = vi.fn((response) => response)
      client.interceptors.response.use(interceptor)
      
      await client.request('/test')
      
      expect(interceptor).toHaveBeenCalledWith(mockResponse)
    })

    it('should handle timeout', async () => {
      const client = new FetchClient({ timeout: 1000 })
      vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}))
      
      await expect(client.request('/test')).rejects.toThrow()
      expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000)
    })
  })

  describe('HTTP methods', () => {
    it('should make GET requests', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.get('/test')
      
      expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'GET'
      }))
    })

    it('should make POST requests with data', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 201 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const data = { name: 'test' }
      await client.post('/test', data)
      
      expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data)
      }))
    })

    it('should make PUT requests', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.put('/test', { id: 1 })
      
      expect(global.fetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'PUT'
      }))
    })

    it('should make DELETE requests', async () => {
      const client = new FetchClient()
      const mockResponse = new Response(null, { status: 204 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.delete('/test/1')
      
      expect(global.fetch).toHaveBeenCalledWith('/test/1', expect.objectContaining({
        method: 'DELETE'
      }))
    })

    it('should make PATCH requests', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      await client.patch('/test/1', { name: 'updated' })
      
      expect(global.fetch).toHaveBeenCalledWith('/test/1', expect.objectContaining({
        method: 'PATCH'
      }))
    })
  })

  describe('JSON methods', () => {
    it('should parse JSON responses', async () => {
      const client = new FetchClient()
      const responseData = { id: 1, name: 'test' }
      const mockResponse = new Response(JSON.stringify(responseData))
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const result = await client.getJSON('/test')
      
      expect(result).toEqual(responseData)
    })

    it('should handle typed JSON responses', async () => {
      const client = new FetchClient()
      const responseData = { id: 1, name: 'test' }
      const mockResponse = new Response(JSON.stringify(responseData))
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      interface TestResponse {
        id: number
        name: string
      }
      
      const result = await client.getJSON<TestResponse>('/test')
      
      expect(result).toEqual(responseData)
    })
  })

  describe('error handling', () => {
    it('should handle fetch errors', async () => {
      const client = new FetchClient()
      const error = new Error('Network error')
      vi.mocked(global.fetch).mockRejectedValue(error)
      
      await expect(client.request('/test')).rejects.toThrow('Network error')
    })

    it('should handle request interceptor errors', async () => {
      const client = new FetchClient()
      const error = new Error('Interceptor error')
      const interceptor = vi.fn().mockRejectedValue(error)
      client.interceptors.request.use(interceptor)
      
      await expect(client.request('/test')).rejects.toThrow('Interceptor error')
    })

    it('should handle response interceptor errors', async () => {
      const client = new FetchClient()
      const mockResponse = new Response('{}', { status: 200 })
      vi.mocked(global.fetch).mockResolvedValue(mockResponse)
      
      const error = new Error('Response interceptor error')
      const interceptor = vi.fn().mockRejectedValue(error)
      client.interceptors.response.use(interceptor)
      
      await expect(client.request('/test')).rejects.toThrow('Response interceptor error')
    })
  })

  describe('default instance', () => {
    it('should export a default http instance', () => {
      expect(http).toBeInstanceOf(FetchClient)
    })
  })
})