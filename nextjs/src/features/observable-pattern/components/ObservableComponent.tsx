"use client";

import { Button } from "@/features/shared/components";
import { useFlashEffect } from "@/features/shared/hooks/useFlashEffect";
import { useRef, useState } from "react";
import { useObservableCounter } from "../hooks/useObservableCounter";

export const ObservableComponent = () => {
  // biome-ignore lint/style/noNonNullAssertion: Default ref assertion
  const sectionRef = useRef<HTMLDivElement>(null!);
  const [isSubscribe, setIsSubscribe] = useState(true);
  const counter = useObservableCounter({ isSubscribe });

  useFlashEffect(sectionRef);

  return (
    <section
      className={
        "w-48 h-48 border border-teal-900 border-dotted bg-slate-100 rounded-sm text-6xl text-center flex flex-col items-center justify-between p-2"
      }
      ref={sectionRef}
    >
      <span className="text-foreground">{counter}</span>

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
