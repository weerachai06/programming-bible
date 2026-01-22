'use client'

import { IncrementSection } from '@/features/observable-pattern/components/IncrementButton'
import { ObservableComponent } from '@/features/observable-pattern/components/ObservableComponent'
import { counterObservable } from '@/features/observable-pattern/hooks/useObservableCounter'
import { Label } from '@radix-ui/react-label'
import { Switch } from '@radix-ui/react-switch'
import { useState } from 'react'

counterObservable.subscribe(value => {
  console.log('New value: ', value)
})

export default function ObservablePatternPage() {
  const [isUnmount, setIsUnmount] = useState(false)
  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          defaultChecked={false}
          onCheckedChange={value => setIsUnmount(value)}
        />
        <Label htmlFor="airplane-mode">
          Unmount Mode: {isUnmount ? 'ON' : 'OFF'}
        </Label>
      </div>

      <div className="mx-auto w-96 py-4 grid grid-cols-2 gap-4">
        {!isUnmount && (
          <div className="col-span-1">
            <ObservableComponent />
          </div>
        )}

        <div className="col-span-1">
          <ObservableComponent />
        </div>

        <div className="col-span-1">
          <ObservableComponent />
        </div>

        <div className="col-span-1">
          <ObservableComponent />
        </div>

        <div className="col-span-full">
          <IncrementSection />
        </div>
      </div>
    </>
  )
}
