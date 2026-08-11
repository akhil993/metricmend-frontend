# Marketing-site reorganization audit

## Reuse inventory

- `app/(marketing)/layout.tsx` supplies the shared company shell, navigation, section navigation, and footer.
- `styles/company-site.css` and `styles/metricmend-color-system.css` hold the existing typography, palette, spacing, surfaces, buttons, cards, breakpoints, and product accents.
- `components/motion/reveal.tsx` and `components/hero/hero-section.tsx` preserve the existing motion language and reduced-motion behavior.
- `components/home/HomePage.tsx` preserves the former analytics-led homepage as the canonical InsightMend experience at `/insightmend`.
- The TechMeld route group and cards remain product-owned experiences while using the company marketing shell.
- `MMMonogram`, `Navbar`, `Footer`, `AssistantDemo`, and the shared page-section patterns remain reusable without rebuilding.

## Duplication found

Product names, positioning, destinations, capabilities, and card markup were repeated across the homepage, product directory, navigation, and footer. Product content is now defined in `lib/company-products.ts`, with the two major product showcases rendered by one component. Navigation and footer remain deliberately concise views of the same ecosystem.

## Refactoring plan

1. Preserve the analytics experience at `/insightmend` and retain legacy redirects.
2. Make `/` explain MetricMend AI and give all products equal visual weight.
3. Centralize product metadata and reuse one showcase component.
4. Add the missing company Solutions destination.
5. Expand Technology into an explicit product → platform → shared-services hierarchy.
6. Preserve metadata, canonical host configuration, robots, sitemap, and indexed legacy paths.
7. Verify with TypeScript/Next production build and responsive browser checks.

## Backend boundary

The marketing reorganization documents a single MetricMend AI Platform boundary. Existing TechMeld ingestion modules remain in place to avoid a risky backend rewrite in a frontend reorganization; future service extraction should move scheduling, ingestion, summarization, search, notifications, and monitoring behind shared APIs without changing product-facing routes.
