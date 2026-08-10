import Link from "next/link";
import { Compass } from "lucide-react";

export default function TechMeldNotFound() {
  return (
    <main>
      <section className="techmeld-error-state section">
        <Compass size={32} aria-hidden="true" />
        <h1>We couldn&apos;t find that page.</h1>
        <p>
          It may have been unpublished, expired, or the link may be out of
          date.
        </p>
        <Link href="/techmeld" className="secondary-button">
          Back to TechMeld
        </Link>
      </section>
    </main>
  );
}
