import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  hasMore,
  basePath,
  searchParams,
}: {
  page: number;
  hasMore: boolean;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (page === 1 && !hasMore) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav className="techmeld-pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={buildHref(page - 1)}>
          <ChevronLeft size={16} />
          Previous
        </Link>
      ) : (
        <span className="is-disabled">
          <ChevronLeft size={16} />
          Previous
        </span>
      )}

      <span className="techmeld-pagination-page">Page {page}</span>

      {hasMore ? (
        <Link href={buildHref(page + 1)}>
          Next
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="is-disabled">
          Next
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  );
}
