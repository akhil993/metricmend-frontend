"use client";

import { useMemo, useState } from "react";
import DynamicField from "./DynamicField";
import {
  saveConnection,
  testConnection,
  updateConnection,
  type ConnectorRegistryItem,
  type SavedConnection,
} from "@/lib/api/connections";

type Props = {
  connector: ConnectorRegistryItem | null;
  editingConnection?: SavedConnection | null;
  workspaceId: string;
  onSaved: () => void;
};

export default function DynamicConnectionForm({
  connector,
  editingConnection,
  workspaceId,
  onSaved,
}: Props) {
  const isEditing = Boolean(editingConnection);

  const [name, setName] = useState(
    editingConnection?.name ?? `${connector?.name ?? "Data"} Connection`
  );

  const [credentials, setCredentials] = useState<Record<string, unknown>>({});
  const [config, setConfig] = useState<Record<string, unknown>>(
    editingConnection?.config ?? {}
  );

  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [testPassed, setTestPassed] = useState(false);

  const effectiveConnector = useMemo(() => connector, [connector]);

  const updateCredentials = (key: string, value: unknown) => {
    setCredentials((prev) => ({ ...prev, [key]: value }));
    setTestPassed(false);
  };

  const updateConfig = (key: string, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setTestPassed(false);
  };

  const handleTest = async () => {
    if (!effectiveConnector) {
      setMessage("Connector registry details are missing for this connection.");
      return;
    }

    setTesting(true);
    setMessage(null);

    try {
      const result = await testConnection({
        connector_key: effectiveConnector.key,
        credentials,
        config,
      });

      setTestPassed(result.success);
      setMessage(result.message);
    } catch (error) {
      setTestPassed(false);
      setMessage(error instanceof Error ? error.message : "Test failed.");
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (isEditing && editingConnection) {
        await updateConnection(editingConnection.id, {
          name,
          config,
          credentials:
            Object.keys(credentials).length > 0 ? credentials : undefined,
        });

        setMessage("Connection updated successfully.");
      } else {
        if (!effectiveConnector) {
          throw new Error("Connector registry details are missing.");
        }

        await saveConnection({
          workspace_id: workspaceId,
          connector_key: effectiveConnector.key,
          name,
          credentials,
          config,
          created_by: null,
        });

        setMessage("Connection saved successfully.");
      }

      onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (!effectiveConnector && !editingConnection) {
    return (
      <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-500">
        Unable to load connector form.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Connection Name
        </label>
        <input
          name="metricmend-connection-name"
          autoComplete="off"
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      {effectiveConnector && (
        <>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Authentication
              </h4>

              {isEditing && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Saved credentials are encrypted and hidden. Fill these fields
                  only if you want to replace/rotate credentials.
                </p>
              )}
            </div>

            {effectiveConnector.auth_schema.fields.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={credentials[field.key]}
                onChange={updateCredentials}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Configuration
            </h4>

            {effectiveConnector.config_schema.fields.map((field) => (
              <DynamicField
                key={field.key}
                field={field}
                value={config[field.key]}
                onChange={updateConfig}
              />
            ))}
          </div>
        </>
      )}

      {message && (
        <div
          className={[
            "rounded-xl px-3 py-2 text-sm",
            testPassed
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
          ].join(" ")}
        >
          {message}
        </div>
      )}

      <div className="flex gap-3">
        {effectiveConnector && (
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || (!isEditing && !testPassed)}
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEditing
              ? "Update Connection"
              : "Save Connection"}
        </button>
      </div>
    </div>
  );
}