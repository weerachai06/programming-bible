import { useCallback, useRef, useState } from "react";

interface AnimationConfig {
  duration: number;
  onClose: () => void;
}

export function useModalAnimation({ duration, onClose }: AnimationConfig) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const animate = useCallback(
    (currentTime: number, isOpening: boolean) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
        setIsAnimating(true);
      }

      const progress = currentTime - startTimeRef.current;
      const normalizedProgress = Math.min(progress / duration, 1);

      // Elastic easing function for pop effect
      // const easeOutElastic = (x: number): number => {
      //   const c4 = (2 * Math.PI) / 3;
      //   return x === 0
      //     ? 0
      //     : x === 1
      //     ? 1
      //     : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
      // };

      if (elementRef.current) {
        const opacity = isOpening ? normalizedProgress : 1 - normalizedProgress;
        // Pop animation with elastic effect
        // const popScale = isOpening
        //   ? easeOutElastic(normalizedProgress)
        //   : 1 - 0.15 * (1 - normalizedProgress);

        // const scale = isOpening
        //   ? 0.3 + popScale * 0.7 // Start from 30% size
        //   : 1 - 0.3 * (1 - normalizedProgress); // Shrink to 70% size

        elementRef.current.style.opacity = opacity.toString();
        // elementRef.current.style.left = `50%`;
        // elementRef.current.style.top = `50%`;
        // elementRef.current.style.transform = `translate(-50%, -50%)`;
      }

      if (normalizedProgress < 1) {
        animationRef.current = requestAnimationFrame((time) =>
          animate(time, isOpening)
        );
      } else {
        setIsAnimating(false);
        if (!isOpening) {
          setTimeout(() => {
            setShouldRender(false);
            onClose();
          }, 50);
        }
      }
    },
    [duration, onClose]
  );

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      startTimeRef.current = undefined;
    }
  }, []);

  return {
    isAnimating,
    shouldRender,
    setShouldRender,
    elementRef,
    animate,
    cleanup,
  };
}
