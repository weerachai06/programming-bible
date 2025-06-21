"use client";

import { useRef, useState } from "react";
import { useObservableCounter } from "../hooks/useObservableCounter";
import { useFlashEffect } from "@/features/shared/hooks/useFlashEffect";
import { Button } from "@/features/shared/components/button";

export const ObservableComponent = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const [isSubscribe, setIsSubscribe] = useState(true);
  const counter = useObservableCounter({ isSubscribe });

  useFlashEffect(sectionRef);

  return (
    <section
      className={`w-48 h-48 border border-teal-900 border-dotted bg-slate-100 rounded-sm text-6xl text-center flex flex-col items-center justify-between p-2`}
      ref={sectionRef}
    >
      <span>{counter}</span>

      {isSubscribe ? (
        <Button onClick={() => setIsSubscribe(false)} size="sm">
          Unsubscribe
        </Button>
      ) : (
        <Button onClick={() => setIsSubscribe(true)} size="sm">
          Subscribe
        </Button>
      )}
    </section>
  );
};
