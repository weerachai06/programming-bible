"use client";
import React, { useEffect } from "react";

const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager") {
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    console.log("Service Worker registered with scope:", registration.scope);
  }

  return null;
};

export default ServiceWorkerRegistration;
