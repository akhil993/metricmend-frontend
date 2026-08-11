"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SectionLink = {
  id: string;
  label: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 42);
}

export function PageSectionNav() {
  const pathname = usePathname();
  const [sections, setSections] = useState<SectionLink[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let sectionObserver: IntersectionObserver | undefined;
    let frame = 0;
    let hashFrame = 0;

    // Never show section links collected from the previous route while the
    // next page is streaming into the shared marketing layout.
    setSections([]);
    setActiveId("");

    const initialize = () => {
      const selector = pathname === "/products"
        ? "main > section, [data-section-nav-item='true']"
        : "main > section, main > .band > section";
      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      ).filter(
        (section) =>
          section.offsetHeight > 100 && section.dataset.sectionNav !== "false",
      );

      // Async server pages such as TechMeld can stream into the layout after
      // this client component hydrates. Keep watching until their sections
      // are present rather than permanently rendering an empty rail.
      const techMeldHomeReady =
        pathname !== "/techmeld" ||
        elements.some((section) => section.id === "product-releases");

      if (elements.length === 0 || !techMeldHomeReady) return false;

      const usedIds = new Set<string>();
      const links = elements.map((section, index) => {
        const eyebrow = section.querySelector<HTMLElement>(".eyebrow");
        const heading = section.querySelector<HTMLElement>("h1, h2");
        const contextualLabel = section.matches(".techmeld-related-section")
          ? "Related"
          : section.matches(".techmeld-detail-content")
            ? "Details"
            : section.matches(".techmeld-submit-section")
              ? "Submit"
              : section.matches(".techmeld-subpage-content")
                ? "Browse"
                : undefined;
        const label =
          section.dataset.sectionLabel ||
          contextualLabel ||
          eyebrow?.textContent?.trim() ||
          heading?.textContent?.trim() ||
          `Section ${index + 1}`;
        const baseId = section.id || slugify(label) || `section-${index + 1}`;
        let id = baseId;
        let suffix = 2;

        while (usedIds.has(id)) {
          id = `${baseId}-${suffix}`;
          suffix += 1;
        }

        usedIds.add(id);
        section.id = id;
        section.classList.add("page-rail-section");

        return { id, label };
      });

      setSections(links);
      setActiveId(links[0]?.id || "");

      // A cross-route link such as /products#lifemeld can arrive before the
      // destination cards mount. Scroll only after their IDs are available.
      if (window.location.hash) {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        const target = document.getElementById(targetId);
        if (target) {
          hashFrame = window.requestAnimationFrame(() => {
            target.scrollIntoView({ block: "start" });
            setActiveId(targetId);
          });
        }
      }

      sectionObserver?.disconnect();
      sectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (visible) setActiveId(visible.target.id);
        },
        { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.15, 0.4] },
      );

      elements.forEach((section) => sectionObserver?.observe(section));
      return true;
    };

    const scheduleInitialize = () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(hashFrame);
      frame = window.requestAnimationFrame(() => {
        if (initialize()) streamObserver.disconnect();
      });
    };

    const streamObserver = new MutationObserver(scheduleInitialize);
    streamObserver.observe(document.body, { childList: true, subtree: true });
    scheduleInitialize();

    return () => {
      window.cancelAnimationFrame(frame);
      streamObserver.disconnect();
      sectionObserver?.disconnect();
    };
  }, [pathname]);

  if (sections.length === 0) return null;

  return (
    <aside className="page-section-nav" aria-label="On this page">
      <span className="page-section-nav-label">
        {pathname.startsWith("/techmeld") ? "TechMeld sections" : "On this page"}
      </span>
      <ol>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={activeId === section.id ? "is-active" : undefined}
              aria-current={activeId === section.id ? "location" : undefined}
            >
              <span className="page-section-dot" />
              <span>{section.label}</span>
            </a>
          </li>
        ))}
      </ol>
      {pathname === "/insightmend" && (
        <div className="page-section-auth" aria-label="InsightMend account actions">
          <a href="/login" className="nav-login-link">
            Login
          </a>
          <a href="/signup" className="nav-signup-link">
            Sign up
          </a>
        </div>
      )}
    </aside>
  );
}
