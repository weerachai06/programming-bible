"use client";
import type React from "react";
import { useEffect } from "react";

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }
  const latestRegistration = await navigator.serviceWorker.getRegistration();

  if (latestRegistration && latestRegistration.active) {
    return;
  }

  await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
}

const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
};

export default ServiceWorkerRegistration;
