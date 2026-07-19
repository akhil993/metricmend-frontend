"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Plus,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  createModelObjectSecurityRule,
  createModelRowSecurityRule,
  createModelSecurityRole,
  getModelDetail,
  getModelSecurityBundle,
  getModelSecurityPrincipals,
  getModelSecuritySettings,
  updateModelSecuritySettings,
  type ModelSecurityPrincipal,
  type SemanticModelDetail,
  type SemanticModelObjectSecurityRule,
  type SemanticModelRowSecurityRule,
  type SemanticModelSecurityRole,
  type SemanticModelSecuritySettings,
} from "@/lib/api/models";

function defaultSecuritySettings(
  modelId: string
): SemanticModelSecuritySettings {
  return {
    model_id: modelId,
    configured: false,
    rls_enabled: true,
    ols_enabled: true,
    mira_access_enabled: true,
    metric_creation_enabled: true,
    row_access_mode: "workspace_members",
    object_access_mode: "parent_inheritance",
    updated_by: null,
    created_at: null,
    updated_at: null,
  };
}

export default function ModelSecurityPage() {
  const params = useParams();
  const modelId = params.modelId as string;

  const [modelDetail, setModelDetail] =
    useState<SemanticModelDetail | null>(null);
  const [settings, setSettings] =
    useState<SemanticModelSecuritySettings | null>(null);
  const [roles, setRoles] = useState<SemanticModelSecurityRole[]>([]);
  const [principals, setPrincipals] = useState<ModelSecurityPrincipal[]>([]);
  const [rowRules, setRowRules] = useState<SemanticModelRowSecurityRule[]>([]);
  const [objectRules, setObjectRules] = useState<
    SemanticModelObjectSecurityRule[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [roleName, setRoleName] = useState("Regional manager");
  const [principalType, setPrincipalType] = useState("workspace_role");
  const [rolePrincipal, setRolePrincipal] = useState("viewer");
  const [rowRuleName, setRowRuleName] = useState("Region access");
  const [rowRuleTableId, setRowRuleTableId] = useState("");
  const [rowRuleRoleId, setRowRuleRoleId] = useState("");
  const [rowRuleExpression, setRowRuleExpression] = useState(
    "region = USER_ATTRIBUTE('region')"
  );
  const [objectRuleType, setObjectRuleType] = useState("table");
  const [objectRuleId, setObjectRuleId] = useState("");
  const [objectRuleTableId, setObjectRuleTableId] = useState("");
  const [objectRuleRoleId, setObjectRuleRoleId] = useState("");
  const [objectRuleAccess, setObjectRuleAccess] = useState("read");

  useEffect(() => {
    let mounted = true;

    async function loadSecurity() {
      setLoading(true);
      setMessage(null);

      try {
        const [detail, principalData] = await Promise.all([
          getModelDetail(modelId),
          getModelSecurityPrincipals(modelId).catch(() => []),
        ]);

        if (!mounted) {
          return;
        }

        setModelDetail(detail);
        setPrincipals(principalData);

        try {
          const security = await getModelSecurityBundle(modelId);

          if (mounted) {
            setSettings(security.settings);
            setRoles(security.roles);
            setRowRules(security.row_rules);
            setObjectRules(security.object_rules);
            setRowRuleTableId(detail.tables[0]?.id || "");
            setObjectRuleId(detail.tables[0]?.id || "");
            setObjectRuleTableId(detail.tables[0]?.id || "");
          }
        } catch {
          if (mounted) {
            const security = await getModelSecuritySettings(modelId).catch(
              () => defaultSecuritySettings(modelId)
            );
            setSettings(security);
            setRowRuleTableId(detail.tables[0]?.id || "");
            setObjectRuleId(detail.tables[0]?.id || "");
            setObjectRuleTableId(detail.tables[0]?.id || "");
          }
        }
      } catch (error) {
        if (mounted) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Failed to load model security."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (modelId) {
      loadSecurity();
    }

    return () => {
      mounted = false;
    };
  }, [modelId]);

  function updateDraft(
    patch: Partial<SemanticModelSecuritySettings>
  ) {
    if (!settings) {
      return;
    }

    setSettings({
      ...settings,
      ...patch,
    });
    setMessage(null);
  }

  async function saveSettings() {
    if (!settings) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const saved = await updateModelSecuritySettings(modelId, {
        rls_enabled: true,
        ols_enabled: true,
        mira_access_enabled: settings.mira_access_enabled,
        metric_creation_enabled: settings.metric_creation_enabled,
        row_access_mode: settings.row_access_mode,
        object_access_mode: settings.object_access_mode,
      });

      setSettings(saved);
      setMessage("RLS and OLS security is applied to this model.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to apply model security."
      );
    } finally {
      setSaving(false);
    }
  }

  async function addRole() {
    if (!roleName.trim()) {
      setMessage("Role name is required.");
      return;
    }

    setSavingRule(true);
    setMessage(null);

    try {
      const role = await createModelSecurityRole(modelId, {
        name: roleName.trim(),
        description: null,
        principal_type: principalType,
        principal_value: rolePrincipal,
      });
      setRoles((current) => [role, ...current]);
      setRoleName("");
      setMessage("Security role added.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to add role.");
    } finally {
      setSavingRule(false);
    }
  }

  async function addRowRule() {
    if (!rowRuleTableId || !rowRuleName.trim() || !rowRuleExpression.trim()) {
      setMessage("Choose a table and enter a row filter.");
      return;
    }

    setSavingRule(true);
    setMessage(null);

    try {
      const rule = await createModelRowSecurityRule(modelId, {
        role_id: rowRuleRoleId || null,
        table_id: rowRuleTableId,
        rule_name: rowRuleName.trim(),
        filter_expression: rowRuleExpression.trim(),
      });
      setRowRules((current) => [rule, ...current]);
      setMessage("Row security rule added.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to add row rule."
      );
    } finally {
      setSavingRule(false);
    }
  }

  async function addObjectRule() {
    const resolvedObjectId =
      objectRuleType === "column"
        ? objectRuleId
        : objectRuleTableId || objectRuleId;

    if (!resolvedObjectId) {
      setMessage("Choose a model object.");
      return;
    }

    setSavingRule(true);
    setMessage(null);

    try {
      const rule = await createModelObjectSecurityRule(modelId, {
        role_id: objectRuleRoleId || null,
        object_type: objectRuleType,
        object_id: resolvedObjectId,
        access_level: objectRuleAccess,
      });
      setObjectRules((current) => [rule, ...current]);
      setMessage("Object security rule added.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to add object rule."
      );
    } finally {
      setSavingRule(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading model security...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href={`/app/models/${modelId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to model
      </Link>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Model Security
            </div>

            <h1 className="mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
              {modelDetail?.model.name ?? "Semantic model"} security
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Add RLS and OLS to this model. MetricMend applies the
              actual Supabase table policies from the enterprise baseline,
              then stores this model-level security configuration here.
            </p>
          </div>

          <button
            type="button"
            disabled={!settings || saving}
            onClick={saveSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving
              ? "Applying..."
              : settings?.configured
                ? "Save security"
                : "Add RLS/OLS"}
          </button>
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
            {message}
          </div>
        ) : null}
      </section>

      {settings ? (
        <section className="grid gap-4 lg:grid-cols-2">
          <LockedRule
            title="Add row-level security"
            status={settings.configured ? "Applied" : "Ready to add"}
            description="Users can access this model only through workspace membership."
          />

          <LockedRule
            title="Add object-level security"
            status={settings.configured ? "Applied" : "Ready to add"}
            description="Tables, columns, relationships, metrics, versions, and Mira records inherit access from this model and workspace."
          />

          <ToggleRule
            title="Allow Mira on this model"
            description="Mira can answer questions using this governed model."
            checked={settings.mira_access_enabled}
            onChange={(checked) =>
              updateDraft({ mira_access_enabled: checked })
            }
          />

          <ToggleRule
            title="Allow metric creation"
            description="Builders can create governed metrics from this model."
            checked={settings.metric_creation_enabled}
            onChange={(checked) =>
              updateDraft({ metric_creation_enabled: checked })
            }
          />
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-3">
        <RulePanel
          title="Security roles"
          description="Map model rules to workspace roles or future identity groups."
        >
          <input
            value={roleName}
            onChange={(event) => setRoleName(event.target.value)}
            placeholder="Role name"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <select
            value={principalType}
            onChange={(event) => {
              const nextType = event.target.value;
              setPrincipalType(nextType);
              setRolePrincipal(
                nextType === "user_id"
                  ? principals[0]?.user_id || ""
                  : "viewer"
              );
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <option value="workspace_role">Workspace role</option>
            <option value="user_id">Individual user</option>
          </select>
          <select
            value={rolePrincipal}
            onChange={(event) => setRolePrincipal(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            {principalType === "user_id" ? (
              principals.length > 0 ? (
                principals.map((principal) => (
                  <option key={principal.user_id} value={principal.user_id}>
                    {principal.label}
                  </option>
                ))
              ) : (
                <option value="">No users found</option>
              )
            ) : (
              <>
                <option value="viewer">Viewer</option>
                <option value="member">Member</option>
                <option value="builder">Builder</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </>
            )}
          </select>
          <ActionButton disabled={savingRule} onClick={addRole}>
            Add role
          </ActionButton>
          <RuleList
            items={roles.map((role) => {
              const user = principals.find(
                (principal) => principal.user_id === role.principal_value
              );

              return `${role.name} -> ${
                role.principal_type === "user_id"
                  ? user?.label || role.principal_value
                  : role.principal_value
              }`;
            })}
            empty="No model security roles yet."
          />
        </RulePanel>

        <RulePanel
          title="Row filters"
          description="Limit rows on a selected table, like Power BI RLS roles."
        >
          <select
            value={rowRuleRoleId}
            onChange={(event) => setRowRuleRoleId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <option value="">All model users</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            value={rowRuleTableId}
            onChange={(event) => setRowRuleTableId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            {modelDetail?.tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.display_name}
              </option>
            ))}
          </select>
          <input
            value={rowRuleName}
            onChange={(event) => setRowRuleName(event.target.value)}
            placeholder="Rule name"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <textarea
            value={rowRuleExpression}
            onChange={(event) => setRowRuleExpression(event.target.value)}
            rows={3}
            placeholder="region = USER_ATTRIBUTE('region')"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          />
          <ActionButton disabled={savingRule} onClick={addRowRule}>
            Add row filter
          </ActionButton>
          <RuleList
            items={rowRules.map((rule) => `${rule.rule_name}: ${rule.filter_expression}`)}
            empty="No row filters yet."
          />
        </RulePanel>

        <RulePanel
          title="Object permissions"
          description="Control access to specific tables, columns, or metrics."
        >
          <select
            value={objectRuleRoleId}
            onChange={(event) => setObjectRuleRoleId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <option value="">All model users</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            value={objectRuleType}
            onChange={(event) => {
              const nextType = event.target.value;
              setObjectRuleType(nextType);
              setObjectRuleId(
                nextType === "column"
                  ? modelDetail?.model_columns.find(
                      (column) =>
                        column.model_table_id === objectRuleTableId
                    )?.id || ""
                  : objectRuleTableId
              );
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <option value="table">Table</option>
            <option value="column">Column</option>
            <option value="metric">Metric</option>
          </select>
          <select
            value={objectRuleTableId}
            onChange={(event) => {
              const tableId = event.target.value;
              setObjectRuleTableId(tableId);
              setObjectRuleId(
                objectRuleType === "column"
                  ? modelDetail?.model_columns.find(
                      (column) => column.model_table_id === tableId
                    )?.id || ""
                  : tableId
              );
            }}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            {modelDetail?.tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.display_name}
              </option>
            ))}
          </select>
          {objectRuleType === "column" ? (
            <select
              value={objectRuleId}
              onChange={(event) => setObjectRuleId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            >
              {modelDetail?.model_columns
                .filter(
                  (column) =>
                    column.model_table_id === objectRuleTableId
                )
                .map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.display_name}
                  </option>
                ))}
            </select>
          ) : null}
          <select
            value={objectRuleAccess}
            onChange={(event) => setObjectRuleAccess(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          >
            <option value="read">Allow read</option>
            <option value="deny">Deny access</option>
            <option value="hide">Hide object</option>
          </select>
          <ActionButton disabled={savingRule} onClick={addObjectRule}>
            Add object rule
          </ActionButton>
          <RuleList
            items={objectRules.map((rule) => `${rule.object_type}: ${rule.access_level}`)}
            empty="No object rules yet."
          />
        </RulePanel>
      </section>
    </div>
  );
}

function RulePanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function ActionButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-slate-200"
    >
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}

function RuleList({
  items,
  empty,
}: {
  items: string[];
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-white/[0.04] dark:text-slate-400">
        {empty}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item}
          className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-white/[0.04] dark:text-slate-200"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function LockedRule({
  title,
  status,
  description,
}: {
  title: string;
  status: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-100">
          <Lock className="h-3.5 w-3.5" />
          {status}
        </span>
      </div>
    </div>
  );
}

function ToggleRule({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        <button
          type="button"
          aria-pressed={checked}
          onClick={() => onChange(!checked)}
          className={`inline-flex h-8 w-14 items-center rounded-full p-1 transition ${
            checked
              ? "bg-emerald-600"
              : "bg-slate-300 dark:bg-white/20"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm transition ${
              checked ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {checked ? <CheckCircle2 className="h-4 w-4" /> : null}
          </span>
        </button>
      </div>
    </div>
  );
}
