import type { WorkspacePipelineSummary } from "@/lib/api/governance";

type WorkspacePipelineCardProps = {
  pipeline: WorkspacePipelineSummary;
};

export function WorkspacePipelineCard({
  pipeline,
}: WorkspacePipelineCardProps) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div>
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Deployment pipeline
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Govern semantic promotion flows between controlled workspace
          environments.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Promotion targets
          </p>

          <div className="mt-4 space-y-3">
            {pipeline.targets.length ? (
              pipeline.targets.map((target) => (
                <div
                  key={target.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-950 dark:text-white">
                        {target.target_environment}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {target.target_workspace_id}
                      </p>
                    </div>

                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                      {target.pipeline_status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No downstream promotion targets configured.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Upstream sources
          </p>

          <div className="mt-4 space-y-3">
            {pipeline.sources.length ? (
              pipeline.sources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-950 dark:text-white">
                        {source.source_environment}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {source.source_workspace_id}
                      </p>
                    </div>

                    <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100">
                      inbound
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No upstream environments configured.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}