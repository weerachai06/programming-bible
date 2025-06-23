"use client";
import React, { useEffect } from "react";

const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    registerServiceWorker();
  }, []);

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

  return null;
};

export default ServiceWorkerRegistration;
