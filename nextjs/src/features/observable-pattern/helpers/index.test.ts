import { describe, it, expect, vi } from 'vitest'
import { createObservable } from './index'

describe('createObservable helper', () => {
  it('should create an observable with subscribe functionality', () => {
    const observable = createObservable<number>()
    expect(observable).toHaveProperty('subscribe')
    expect(observable).toHaveProperty('notify')
    expect(observable).toHaveProperty('size')
    expect(observable).toHaveProperty('clear')
  })

  it('should allow observers to subscribe and receive notifications', () => {
    const observable = createObservable<string>()
    const observer = vi.fn()
    
    observable.subscribe(observer)
    observable.notify('test value')
    
    expect(observer).toHaveBeenCalledWith('test value')
    expect(observer).toHaveBeenCalledTimes(1)
  })

  it('should handle multiple observers', () => {
    const observable = createObservable<number>()
    const observer1 = vi.fn()
    const observer2 = vi.fn()
    
    observable.subscribe(observer1)
    observable.subscribe(observer2)
    observable.notify(42)
    
    expect(observer1).toHaveBeenCalledWith(42)
    expect(observer2).toHaveBeenCalledWith(42)
    expect(observable.size).toBe(2)
  })

  it('should allow unsubscribing', () => {
    const observable = createObservable<boolean>()
    const observer = vi.fn()
    
    const subscription = observable.subscribe(observer)
    observable.notify(true)
    subscription.unsubscribe()
    observable.notify(false)
    
    expect(observer).toHaveBeenCalledTimes(1)
    expect(observer).toHaveBeenCalledWith(true)
    expect(observable.size).toBe(0)
  })

  it('should track observer count correctly', () => {
    const observable = createObservable<string>()
    
    expect(observable.size).toBe(0)
    
    const sub1 = observable.subscribe(() => {})
    expect(observable.size).toBe(1)
    
    const sub2 = observable.subscribe(() => {})
    expect(observable.size).toBe(2)
    
    sub1.unsubscribe()
    expect(observable.size).toBe(1)
    
    sub2.unsubscribe()
    expect(observable.size).toBe(0)
  })

  it('should clear all observers', () => {
    const observable = createObservable<number>()
    const observer1 = vi.fn()
    const observer2 = vi.fn()
    
    observable.subscribe(observer1)
    observable.subscribe(observer2)
    expect(observable.size).toBe(2)
    
    observable.clear()
    expect(observable.size).toBe(0)
    
    observable.notify(123)
    expect(observer1).not.toHaveBeenCalled()
    expect(observer2).not.toHaveBeenCalled()
  })
})