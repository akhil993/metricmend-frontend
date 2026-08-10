export function TechMeldSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="techmeld-skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="techmeld-skeleton-card" />
      ))}
    </div>
  );
}
