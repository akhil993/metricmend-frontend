type Props = {
  selectedEdge?: any;
};

export default function RelationshipInspector({
  selectedEdge,
}: Props) {
  if (!selectedEdge) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          Select a relationship
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div>
        <h3 className="font-semibold">
          Relationship
        </h3>
      </div>

      <div className="text-sm">
        {selectedEdge.source} → {selectedEdge.target}
      </div>
    </div>
  );
}