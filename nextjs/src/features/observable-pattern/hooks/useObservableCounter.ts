'use client'

import { useEffect, useState } from 'react'
import { createObservable } from '../helpers'

export const counterObservable = createObservable<number>()

export const useObservableCounter = ({
  isSubscribe = false,
}: {
  isSubscribe?: boolean
}) => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const subscription = counterObservable.subscribe(setCounter)

    if (!isSubscribe) subscription.unsubscribe()

    return () => {
      subscription.unsubscribe()
      counterObservable.clear()
    }
  }, [isSubscribe])

  return counter
}
