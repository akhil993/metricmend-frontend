type Recommendation = {
  title?: string;
  recommendation?: string;
  confidence?: string;
};

type Driver = {
  segment?: string;
  delta?: number;
  direction?: string;
};

type Anomaly = {
  value?: number;
  direction?: string;
  z_score?: number;
};

type MiraDiagnosticResultProps = {
  result: {
    executive_summary?: string;
    key_drivers?: Driver[];
    anomalies?: Anomaly[];
    recommendations?: Recommendation[];
    follow_up_questions?: string[];
  };
};

export default function MiraDiagnosticResult({ result }: MiraDiagnosticResultProps) {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      {result.executive_summary && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Executive Summary
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-100">
            {result.executive_summary}
          </p>
        </section>
      )}

      {!!result.key_drivers?.length && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Key Drivers
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {result.key_drivers.slice(0, 6).map((driver, index) => (
              <div
                key={`${driver.segment}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {driver.segment || "Segment"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Direction: {driver.direction || "unknown"}
                </p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                  Movement: {driver.delta ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!!result.anomalies?.length && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Anomalies
          </p>

          <div className="mt-3 space-y-2">
            {result.anomalies.slice(0, 4).map((anomaly, index) => (
              <div
                key={index}
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100"
              >
                {anomaly.direction || "Unusual"} value detected. Z-score:{" "}
                {typeof anomaly.z_score === "number"
                  ? anomaly.z_score.toFixed(2)
                  : "N/A"}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!result.recommendations?.length && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Recommendations
          </p>

          <div className="mt-3 space-y-3">
            {result.recommendations.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-300/20 dark:bg-emerald-400/10"
              >
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                  {item.title || "Recommendation"}
                </p>
                <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-100/80">
                  {item.recommendation}
                </p>
                {item.confidence && (
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200/70">
                    Confidence: {item.confidence}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!!result.follow_up_questions?.length && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Follow-up Questions
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {result.follow_up_questions.map((question, index) => (
              <span
                key={`${question}-${index}`}
                className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-white/10 dark:text-slate-200"
              >
                {question}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}