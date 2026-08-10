import { CalendarClock, Newspaper, RadioTower } from "lucide-react";
import { formatArticleDate } from "@/lib/techmeld/format";
import type { TechMeldLiveStatus } from "@/lib/techmeld/queries";

export function LiveStatusStrip({ status }: { status: TechMeldLiveStatus }) {
  const hasContent = Boolean(
    status.lastUpdatedAt || status.upcomingEventsCount > 0 || status.recentArticleCount > 0
  );

  if (!hasContent) {
    return (
      <div className="techmeld-live-status is-empty" role="status">
        <RadioTower size={16} />
        <span>TechMeld is connected and waiting on its first approved content.</span>
      </div>
    );
  }

  return (
    <div className="techmeld-live-status" role="status">
      {status.lastUpdatedAt ? (
        <span>
          <RadioTower size={15} />
          Updated {formatArticleDate(status.lastUpdatedAt)}
        </span>
      ) : null}

      <span>
        <Newspaper size={15} />
        {status.recentArticleCount} update{status.recentArticleCount === 1 ? "" : "s"} in the last 30 days
      </span>

      <span>
        <CalendarClock size={15} />
        {status.upcomingEventsCount} upcoming event{status.upcomingEventsCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}
