import type {
  SelectedModelTable,
  SourceTable,
} from "@/lib/api/models";

type Props = {
  tables: SourceTable[];
  selectedDatabase: string;
  loading: boolean;
  selectedTables: SelectedModelTable[];
  onChange: (tables: SelectedModelTable[]) => void;
};

export default function TableSelector({
  tables,
  selectedDatabase,
  loading,
  selectedTables,
  onChange,
}: Props) {
  function isSelected(tableName: string) {
    return selectedTables.some((table) => table.source_table === tableName);
  }

  function toggleTable(table: SourceTable) {
    if (isSelected(table.table_name)) {
      onChange(
        selectedTables.filter(
          (selected) => selected.source_table !== table.table_name
        )
      );
      return;
    }

    const guessedRole = table.table_name.toLowerCase().startsWith("fact")
      ? "fact"
      : "dimension";

    onChange([
      ...selectedTables,
      {
        source_database: selectedDatabase,
        source_schema: table.schema,
        source_table: table.table_name,
        display_name: table.table_name,
        table_role: guessedRole,
      },
    ]);
  }

  function updateRole(tableName: string, role: "fact" | "dimension") {
    onChange(
      selectedTables.map((table) =>
        table.source_table === tableName
          ? { ...table, table_role: role }
          : table
      )
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        3. Select tables
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Choose fact and dimension tables for your semantic model.
      </p>

      <div className="mt-4 space-y-3">
        {loading && (
          <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            Loading tables...
          </div>
        )}

        {!loading && tables.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No tables loaded yet.
          </div>
        )}

        {!loading &&
          tables.map((table) => {
            const selected = selectedTables.find(
              (item) => item.source_table === table.table_name
            );

            return (
              <div
                key={table.table_name}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.035]"
              >
                <label className="flex min-w-0 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={Boolean(selected)}
                    onChange={() => toggleTable(table)}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                      {table.table_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {table.table_type ?? "table"}
                    </p>
                  </div>
                </label>

                {selected && (
                  <select
                    value={selected.table_role}
                    onChange={(event) =>
                      updateRole(
                        table.table_name,
                        event.target.value as "fact" | "dimension"
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="fact">Fact</option>
                    <option value="dimension">Dimension</option>
                  </select>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}