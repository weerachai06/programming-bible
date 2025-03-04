"use client";

import { useEffect, useRef } from "react";

export default function AnimationDemo() {
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = (currentTime: number) => {
    if (!startTimeRef.current) startTimeRef.current = currentTime;
    const progress = currentTime - startTimeRef.current;

    // Calculate position based on time
    const position = Math.min((progress / 1000) * 200, 200); // Move 200px over 1 second

    if (elementRef.current) {
      elementRef.current.style.transform = `translateX(${position}px)`;
    }

    if (progress < 1000) {
      // Continue animation for 1 second
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const startAnimation = () => {
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="p-8">
      <div ref={elementRef} className="w-20 h-20 bg-blue-500 rounded-lg" />
      <div className="mt-4 space-x-4">
        <button
          onClick={startAnimation}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={stopAnimation}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
