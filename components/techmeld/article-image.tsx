"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function ArticleImage({
  imageUrl,
  categoryLabel,
  featured,
}: {
  imageUrl: string | null | undefined;
  categoryLabel: string;
  featured: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(imageUrl) && !errored;

  return (
    <div
      className={`techmeld-update-placeholder ${showImage ? "has-image" : ""}`}
      aria-hidden="true"
    >
      {showImage ? (
        // Third-party editorial image from the source feed — dimensions are
        // unknown ahead of time, so next/image's required width/height (or
        // an allowlisted domain) don't fit here. A plain <img> with a
        // client-side error fallback is the pragmatic choice.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl ?? undefined}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setErrored(true)}
        />
      ) : null}

      <span>{categoryLabel}</span>
      {featured ? (
        <span className="techmeld-featured-flag">
          <Star size={12} />
          Featured
        </span>
      ) : null}
    </div>
  );
}
