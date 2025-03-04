import { useEffect, RefObject } from "react";

interface UseClickOutsideProps {
  ref: RefObject<HTMLElement>;
  handler: () => void;
  enabled: boolean;
}

export function useClickOutside({
  ref,
  handler,
  enabled,
}: UseClickOutsideProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler, enabled]);
}
