"use client";

import { useState } from "react";
import {
  interpretMetric,
  type InterpretMetricResponse,
} from "@/lib/api/metrics";

type Props = {
  open: boolean;
  onClose: () => void;
  workspaceId: string;
  modelId: string;
  hasExistingFormula: boolean;
  onApply: (formula: string) => void;
  onUseExplanation?: (description: string) => void;
};

export default function MetricInterpretDialog({
  open,
  onClose,
  workspaceId,
  modelId,
  hasExistingFormula,
  onApply,
  onUseExplanation,
}: Props) {
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] =
    useState<InterpretMetricResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleInterpret() {
    if (!intent.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await interpretMetric({
        workspace_id: workspaceId,
        model_id: modelId,
        intent,
      });

      setResult(response);
    } catch (err) {
      console.error(err);

      setError("Failed to interpret metric.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Interpret with Mira
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Describe the metric in natural language.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
          >
            Close
          </button>
        </div>

        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          placeholder="Revenue is sales amount minus discounts"
          className="h-32 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleInterpret}
            disabled={loading}
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
          >
            {loading
              ? "Analyzing with Mira..."
              : "Interpret with Mira"}
          </button>
        </div>
        {loading && (
  <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-sm text-cyan-200">
    Mira is analyzing your semantic model, generating mmQL, and checking it
    against governance rules.
  </div>
)}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-5">
            <div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  Mira generated a suggestion. Review and apply it only if it matches your
                  business definition.
            </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-4">
                <pre className="text-sm text-cyan-300">
                  {result.formula}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-medium text-slate-300">
                Explanation
              </h3>

              <div className="rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-300">
                {result.explanation}
              </div>
            {result.explanation && onUseExplanation && (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onUseExplanation(result.explanation)
                    }
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5"
                  >
                    Use as description
                  </button>
                </div>
              )}
            </div>

            {result.dependencies.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-slate-300">
                  Dependencies
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.dependencies.map((dependency) => (
                    <div
                      key={dependency}
                      className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
                    >
                      {dependency}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-amber-300">
                  Warnings
                </h3>

                <div className="space-y-2">
                  {result.warnings.map((warning) => (
                    <div
                      key={warning}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200"
                    >
                      {warning}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.formula && (
  <div className="flex justify-end">
    <button
      type="button"
      onClick={() => {
        if (hasExistingFormula) {
          const confirmed = window.confirm(
            "Replace the current formula with Mira's suggestion?"
          );

          if (!confirmed) return;
        }

        onApply(result.formula);
      }}
      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
    >
      {result.warnings.length
        ? "Apply & Review"
        : "Apply Suggestion"}
    </button>
  </div>
)}
          </div>
        )}
      </div>
    </div>
  );
}