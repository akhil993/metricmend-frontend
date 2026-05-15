"use client";

import { Clock3 } from "lucide-react";

type Props = {
  reviews?: any[];
};

export default function MiraGeneratedReviewQueue({
  reviews = [],
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <Clock3 className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Mira Review Queue
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No pending Mira-generated asset reviews.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-slate-200 p-4 dark:border-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {review.entity_type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Status: {review.status}
                  </p>
                </div>

                <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
                  Governance Review
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}