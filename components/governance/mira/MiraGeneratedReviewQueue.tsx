"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock3, FileText, ShieldCheck } from "lucide-react";

import { getMiraGeneratedReviewQueue } from "@/lib/api/miraGovernance";

type Props = {
  reviews?: any[];
};

export default function MiraGeneratedReviewQueue({
  reviews = [],
}: Props) {
  const params = useParams<{ workspaceId?: string }>();
  const workspaceId =
    typeof params?.workspaceId === "string" ? params.workspaceId : null;

  const [loadedReviews, setLoadedReviews] = useState<any[]>(reviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reviews.length) {
      setLoadedReviews(reviews);
      return;
    }

    if (!workspaceId) {
      return;
    }

    let cancelled = false;

    async function loadReviews() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMiraGeneratedReviewQueue(workspaceId as string);

        if (!cancelled) {
          setLoadedReviews(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load Mira review queue."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => {
      cancelled = true;
    };
  }, [reviews, workspaceId]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-white/[0.08] dark:text-slate-200">
            <Clock3 className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Mira Review Queue
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review generated measures before they become trusted reporting assets.
            </p>
          </div>
        </div>

        <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
          Pending approval
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
            Loading Mira-generated assets...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-100">
            {error}
          </div>
        ) : loadedReviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No pending Mira-generated asset reviews.
          </div>
        ) : (
          loadedReviews.map((review) => {
            const provenance = review.provenance || review.raw?.provenance || {};
            const title =
              review.display_name ||
              review.name ||
              review.metric_name ||
              review.entity_type ||
              "Mira-generated asset";
            const status = review.review_status || review.status || "pending_review";

            return (
            <div
              key={review.id}
              className="rounded-xl border border-slate-200 p-4 dark:border-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
                  <p className="font-medium text-slate-900 dark:text-white">
                      {title}
                  </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {review.entity_type || "metric"} · {status.replace(/_/g, " ")}
                  </p>

                  {provenance.original_question ? (
                    <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                      {provenance.original_question}
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Review required
                </div>
              </div>

              <div className="mt-4 grid gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Stored outside governed metrics
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Requires builder approval
                </div>
              </div>
            </div>
          );
          })
        )}
      </div>
    </div>
  );
}
