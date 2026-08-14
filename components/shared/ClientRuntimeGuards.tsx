"use client";

import { useEffect } from "react";

function isBenignCancellation(reason: unknown) {
  const value = reason as {
    message?: unknown;
    msg?: unknown;
    type?: unknown;
    name?: unknown;
  };

  const message =
    typeof reason === "string"
      ? reason
      : value?.message || value?.msg || value?.type || value?.name || "";

  const normalized = String(message).toLowerCase();

  return (
    normalized.includes("manually canceled") ||
    normalized.includes("manually cancelled") ||
    normalized.includes("cancelation") ||
    normalized.includes("cancellation") ||
    normalized.includes("cancelled") ||
    normalized.includes("canceled") ||
    normalized.includes("aborterror")
  );
}

export default function ClientRuntimeGuards() {
  useEffect(() => {
    function handleUnhandledRejection(event: PromiseRejectionEvent) {
      if (isBenignCancellation(event.reason)) {
        event.preventDefault();
      }
    }

    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection
    );

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return null;
}
