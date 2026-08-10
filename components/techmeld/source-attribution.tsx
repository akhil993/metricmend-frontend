import { ShieldCheck } from "lucide-react";

export function SourceAttribution({
  sourceName,
  author,
  publishedDate,
}: {
  sourceName: string;
  author?: string | null;
  publishedDate?: string;
}) {
  return (
    <div className="techmeld-source">
      <ShieldCheck size={14} />
      <span>
        Original publisher: <strong>{sourceName}</strong>
        {author ? ` · By ${author}` : ""}
        {publishedDate ? ` · Published ${publishedDate}` : ""}
      </span>
    </div>
  );
}
