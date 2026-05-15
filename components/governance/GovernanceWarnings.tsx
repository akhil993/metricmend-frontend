type GovernanceWarningsProps = {
  environment?: string | null;
  isProduction?: boolean;
  certificationRequired?: boolean;
};

export function GovernanceWarnings({
  environment,
  isProduction,
  certificationRequired,
}: GovernanceWarningsProps) {
  const warnings = [];

  if (isProduction) {
    warnings.push({
      title: "Production workspace is protected",
      description:
        "Semantic models in production cannot be edited directly. Changes must be promoted through governed deployment.",
    });
  }

  if (certificationRequired) {
    warnings.push({
      title: "Certification required",
      description:
        "Semantic models must be certified before they can be deployed into this workspace.",
    });
  }

  if (!warnings.length) {
    warnings.push({
      title: "Governance ready",
      description:
        "This workspace can participate in governed semantic model promotion flows.",
    });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {warnings.map((warning) => (
        <div
          key={warning.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
        >
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {warning.title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {warning.description}
          </p>
          {environment && (
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">
              Environment: {environment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}