import { createContext, useContext, RefObject } from "react";

interface ModalContextType {
  isOpen: boolean;
  onClose: () => void;
  isAnimating: boolean;
  duration: number;
  elementRef: RefObject<HTMLDivElement>;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within Modal.Root");
  }
  return context;
}
