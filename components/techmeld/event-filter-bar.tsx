"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

const COST_OPTIONS = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

const FORMAT_OPTIONS = [
  { value: "", label: "All" },
  { value: "virtual", label: "Virtual" },
  { value: "in_person", label: "In person" },
  { value: "hybrid", label: "Hybrid" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All" },
  { value: "AI", label: "AI" },
  { value: "Cloud", label: "Cloud" },
  { value: "Analytics", label: "Analytics" },
  { value: "Data Engineering", label: "Data Engineering" },
  { value: "Software Development", label: "Software Development" },
];

export function EventFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") ?? "");

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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value: string) => {
      if (value) params.set(key, value);
      else params.delete(key);
    };
    setOrDelete("q", query.trim());
    setOrDelete("location", location.trim());
    setOrDelete("dateFrom", dateFrom);
    setOrDelete("dateTo", dateTo);
    params.delete("page");
    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  const activeCost = searchParams.get("costType") ?? "";
  const activeFormat = searchParams.get("format") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  return (
    <div className="techmeld-filter-bar techmeld-event-filter-bar">
      <form onSubmit={handleSubmit} className="techmeld-event-search-form">
        <div className="techmeld-search-form" role="search">
          <label htmlFor="techmeld-event-search" className="sr-only">
            Search events
          </label>
          <Search size={16} aria-hidden="true" />
          <input
            id="techmeld-event-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events"
          />
        </div>

        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, region, or country"
          />
        </label>

        <label>
          From
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>

        <label>
          To
          <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
        </label>

        <button type="submit" className="secondary-button">
          Apply
        </button>
      </form>

      <div className="techmeld-filter-group" role="group" aria-label="Filter by cost">
        {COST_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === activeCost ? "is-active" : ""}
            onClick={() => updateParam("costType", option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="techmeld-filter-group" role="group" aria-label="Filter by format">
        {FORMAT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={option.value === activeFormat ? "is-active" : ""}
            onClick={() => updateParam("format", option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="techmeld-filter-group" role="group" aria-label="Filter by topic">
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
    </div>
  );
}
