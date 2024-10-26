"use client";

import { RefObject, useEffect } from "react";
import { COLORS } from "../constants/flash-update";

export const useFlashEffect = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!ref.current) return;
    const classList = [
      "outline-dashed",
      "outline-offset-1",
      COLORS.RERENDER_OUTLINE,
    ];
    ref.current.classList.add(...classList);

    const timeout = setTimeout(() => {
      if (ref.current) {
        ref.current.classList.remove(...classList);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  });
};
