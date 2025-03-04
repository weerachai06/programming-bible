import { useEffect } from "react";

interface UseModalKeyboardProps {
  isOpen: boolean;
  onClose: () => void;
  isAnimating: boolean;
}

export function useModalKeyboard({
  isOpen,
  onClose,
  isAnimating,
}: UseModalKeyboardProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isAnimating) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isAnimating]);
}
