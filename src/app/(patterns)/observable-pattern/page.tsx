"use client";

import { IncrementSection } from "@/features/observable-pattern/components/IncrementButton";
import { ObservableComponent } from "@/features/observable-pattern/components/ObservableComponent";
import { counterObservable } from "@/features/observable-pattern/hooks/useObservableCounter";

counterObservable.subscribe((value) => {
  console.log("New value: ", value);
});

export default function ObservablePatternPage() {
  return (
    <div className="mx-auto w-96 py-4 grid grid-cols-2 gap-4">
      <div className="col-span-1">
        <ObservableComponent />
      </div>

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
  );
}
