import { TechMeldSkeletonGrid } from "@/components/techmeld/skeleton-grid";

export default function Loading() {
  return (
    <main className="techmeld-page">
      <div className="techmeld-loading-hero" aria-hidden="true" />
      <div className="section">
        <TechMeldSkeletonGrid count={3} />
      </div>
    </main>
  );
}
