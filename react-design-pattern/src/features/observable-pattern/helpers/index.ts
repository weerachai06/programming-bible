export type Observable<T> = typeof createObservable<T>;
/**
 * @description Function to create an observable
 * @returns
 */
export const createObservable = <T>() => {
  const observers = new Set<(value: T) => void>();

  return {
    subscribe: (observer: (value: T) => void) => {
      observers.add(observer);
      return {
        unsubscribe: () => {
          observers.delete(observer);
        },
      };
    },
    notify: (value: T) => {
      observers.forEach((observer) => observer(value));
    },
  };
};
