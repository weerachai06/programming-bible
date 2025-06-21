"use client";

import { useEffect, useState } from "react";
import { counterObservable } from "../hooks/useObservableCounter";
import { Button } from "@/features/shared/components/button";

export const IncrementSection = () => {
  const [actualCounter, setActualCounter] = useState(0);

  useEffect(() => {
    counterObservable.notify(actualCounter);
  }, [actualCounter]);

  return (
    <div className="flex gap-4">
      <span className="border-2 border-dashed border-neutral-700 text-center p-2 min-w-10">
        {actualCounter}
      </span>

      <Button
        onClick={() => {
          setActualCounter((prev) => prev + 1);
        }}
        className="flex text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 flex-1"
      >
        Increment
      </Button>
    </div>
  );
};
