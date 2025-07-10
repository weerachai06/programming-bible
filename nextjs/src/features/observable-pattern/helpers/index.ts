export type Observable<T> = typeof createObservable<T>
/**
 * Function to create an observable pattern for state management
 *
 * @returns Observable object with subscribe and notify methods
 */
export const createObservable = <T>() => {
  const observers = new Set<(value: T) => void>()

  return {
    subscribe: (observer: (value: T) => void) => {
      observers.add(observer)
      return {
        unsubscribe: () => {
          observers.delete(observer)
        },
      }
    },
    notify: (value: T) => {
      observers.forEach(observer => observer(value))
    },
  }
}
