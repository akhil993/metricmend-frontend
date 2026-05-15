type Props = {
  data: {
    tableName: string;
    tableRole: string;
    columns: string[];
  };
};

export default function SemanticTableNode({
  data,
}: Props) {
  return (
    <div className="min-w-[240px] rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">
            {data.tableName}
          </h3>

          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-wide text-primary">
            {data.tableRole}
          </span>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {data.columns.map((column) => (
          <div
            key={column}
            className="text-sm text-muted-foreground"
          >
            {column}
          </div>
        ))}
      </div>
    </div>
  );
}