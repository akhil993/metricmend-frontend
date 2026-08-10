"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "", label: "All" },
  { value: "ai-news", label: "AI News" },
  { value: "releases", label: "Releases" },
];

export function NewsFilterBar({ sources }: { sources: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("q", query.trim());
  }

  const activeCategory = searchParams.get("category") ?? "";
  const activeSource = searchParams.get("source") ?? "";

  return (
    <div className="techmeld-filter-bar">
      <form onSubmit={handleSearchSubmit} className="techmeld-search-form" role="search">
        <label htmlFor="techmeld-news-search" className="sr-only">
          Search updates
        </label>
        <Search size={16} aria-hidden="true" />
        <input
          id="techmeld-news-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search updates"
        />
        <button type="submit">Search</button>
      </form>

      <div className="techmeld-filter-group" role="group" aria-label="Filter by category">
        {CATEGORY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === activeCategory ? "is-active" : ""}
            onClick={() => updateParam("category", option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {sources.length > 0 ? (
        <label className="techmeld-select-filter">
          Source
          <select
            value={activeSource}
            onChange={(event) => updateParam("source", event.target.value)}
          >
            <option value="">All sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
