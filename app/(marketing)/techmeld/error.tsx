"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function TechMeldError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <section className="techmeld-error-state section" role="alert">
        <AlertTriangle size={32} aria-hidden="true" />
        <h1>Something went wrong loading TechMeld.</h1>
        <p>Please try again, or head back to the TechMeld homepage.</p>
        <div className="techmeld-hero-actions">
          <button type="button" className="primary-button" onClick={reset}>
            Try again
          </button>
          <Link href="/techmeld" className="secondary-button">
            Back to TechMeld
          </Link>
        </div>
      </section>
    </main>
  );
}
