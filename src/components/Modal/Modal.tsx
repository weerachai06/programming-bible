import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ModalContext, useModalContext } from "./context";
import { useModalAnimation } from "./useModalAnimation";
import { useClickOutside } from "./useOutsideClick";
import { useModalKeyboard } from "./useModalKeyboard";

interface ModalRootProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  duration?: number;
}

function Root({ isOpen, onClose, children, duration = 100 }: ModalRootProps) {
  const {
    isAnimating,
    shouldRender,
    setShouldRender,
    elementRef,
    animate,
    cleanup,
  } = useModalAnimation({ duration, onClose });

  // Add keyboard control
  useModalKeyboard({ isOpen, onClose, isAnimating });

  // Add click outside handling
  useClickOutside({
    ref: elementRef,
    handler: () => !isAnimating && onClose(),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen && !shouldRender) {
      setShouldRender(true);
    }
  }, [isOpen, shouldRender, setShouldRender]);

  useEffect(() => {
    if (shouldRender) {
      requestAnimationFrame((time) => animate(time, isOpen));
    }
    return cleanup;
  }, [isOpen, shouldRender, animate, cleanup]);

  if (!shouldRender) return null;

  return createPortal(
    <ModalContext.Provider
      value={{ isOpen, onClose, isAnimating, duration, elementRef }}
    >
      <div
        className="fixed inset-0 z-50 flex items-center justify-center w-full min-h-dvh top-0 left-0"
        role="presentation"
      >
        {children}
      </div>
    </ModalContext.Provider>,
    document.body
  );
}

const Overlay = () => {
  const { onClose, isAnimating, duration } = useModalContext();

  return (
    <div
      className="fixed inset-0 bg-black/50"
      onClick={() => !isAnimating && onClose()}
      aria-hidden="true"
      style={{
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    />
  );
};

const Content = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const { elementRef } = useModalContext();

  // Handle tab key navigation
  const handleTabKey = (event: React.KeyboardEvent) => {
    if (!elementRef.current) return;

    const focusableElements = elementRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return (
    <div
      ref={elementRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onKeyDown={handleTabKey}
      className="relative z-10 bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4"
      style={{ willChange: "transform, opacity" }}
    >
      <h2 id="modal-title" className="sr-only">
        {title}
      </h2>
      {children}
    </div>
  );
};

export const Modal = {
  Root,
  Overlay,
  Content,
};
