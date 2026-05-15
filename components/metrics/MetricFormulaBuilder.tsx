"use client";

import { useEffect, useMemo, useState } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import MetricInterpretDialog from "./MetricInterpretDialog";
import {
    AlertCircle,
    CheckCircle2,
    Database,
    FunctionSquare,
    Loader2,
    Plus,
    Save,
    Sigma,
    Table2,
} from "lucide-react";

import {
    createMetric,
    updateMetric,
    type MetricType,
    type MetricValidateResponse,
    type SemanticMetric,
    validateMetricFormula,
} from "@/lib/api/metrics";

import {
    buildCompletionItems,
    getColumnDataType,
    getColumnName,
    getColumnTableName,
    getTableName,
    type ModelColumn,
    type ModelTable,
} from "./metricFormulaUtils";

type MetricFormulaBuilderProps = {
    workspaceId: string;
    modelId: string;
    modelTables: ModelTable[];
    modelColumns: ModelColumn[];
    metrics: SemanticMetric[];
    editingMetric?: SemanticMetric | null;
    onMetricCreated: (metric: SemanticMetric) => void;
};

export default function MetricFormulaBuilder({
    workspaceId,
    modelId,
    modelTables,
    modelColumns,
    metrics,
    editingMetric,
    onMetricCreated,
}: MetricFormulaBuilderProps) {
    const monaco = useMonaco();

    const [name, setName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [description, setDescription] = useState("");
    const [formatType, setFormatType] = useState("number");
    const [metricType, setMetricType] = useState<MetricType>("base");
    const [formula, setFormula] = useState("SUM()");
    const [validation, setValidation] =
        useState<MetricValidateResponse | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [interpretOpen, setInterpretOpen] = useState(false);

    useEffect(() => {
        if (!editingMetric) return;

        setName(editingMetric.name || "");
        setDisplayName(editingMetric.display_name || "");
        setDescription(editingMetric.description || "");
        setMetricType(editingMetric.metric_type);
        setFormatType(editingMetric.format_type || "number");
        setFormula(editingMetric.user_formula || editingMetric.expression || "SUM()");
        setValidation(null);
        setMessage(`Editing ${editingMetric.display_name || editingMetric.name}`);
    }, [editingMetric]);
    const tableLookup = useMemo(() => {
        return new Map(modelTables.map((table) => [table.id, table]));
    }, [modelTables]);

    const groupedColumns = useMemo(() => {
        const groups = new Map<string, ModelColumn[]>();

        for (const column of modelColumns) {
            const tableName = getColumnTableName(column, tableLookup);
            const existing = groups.get(tableName) || [];

            existing.push(column);
            groups.set(tableName, existing);
        }

        return Array.from(groups.entries()).sort(([a], [b]) =>
            a.localeCompare(b)
        );
    }, [modelColumns, tableLookup]);



    const canSave =
        name.trim().length > 0 &&
        formula.trim().length > 0 &&
        validation?.valid &&
        validation.expression_json;

    useEffect(() => {
        if (!monaco) return;

        const languageId = "mmql";

        const languages = monaco.languages
            .getLanguages()
            .map((language: any) => language.id);

        if (!languages.includes(languageId)) {
            monaco.languages.register({ id: languageId });
        }

        monaco.languages.setMonarchTokensProvider(languageId, {
            tokenizer: {
                root: [
                    [
                        /\b(SUM|AVG|MIN|MAX|COUNT|DISTINCTCOUNT|COUNTROWS|SAFE_DIVIDE|ROUND|ABS|CALCULATE|IF)\b/,
                        "keyword",
                    ],
                    [/\[[^\]]+\]/, "variable"],
                    [/[a-zA-Z_][\w]*(?=\.)/, "type.identifier"],
                    [/[a-zA-Z_][\w]*/, "identifier"],
                    [/[0-9]+(\.[0-9]+)?/, "number"],
                    [/".*?"/, "string"],
                    [/'.*?'/, "string"],
                    [/[+\-*/=<>!]+/, "operator"],
                ],
            },
        });

        const disposable = monaco.languages.registerCompletionItemProvider(
            languageId,
            {
                triggerCharacters: [".", "[", "(", "_"],

                provideCompletionItems: (model: any, position: any) => {
                    const word = model.getWordUntilPosition(position);

                    const range = {
                        startLineNumber: position.lineNumber,
                        endLineNumber: position.lineNumber,
                        startColumn: word.startColumn,
                        endColumn: word.endColumn,
                    };

                    const textUntilCursor = model.getValueInRange({
                        startLineNumber: position.lineNumber,
                        startColumn: 1,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column,
                    });

                    const tableMatch = textUntilCursor.match(/([a-zA-Z_][\w]*)\.$/);

                    if (tableMatch) {
                        const tableName = tableMatch[1];

                        const columnSuggestions = modelColumns
                            .filter(
                                (column) =>
                                    getColumnTableName(column, tableLookup) === tableName
                            )
                            .map((column) => ({
                                label: getColumnName(column),
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: getColumnName(column),
                                detail: getColumnDataType(column),
                                range,
                            }));

                        return {
                            suggestions: columnSuggestions,
                        };
                    }

                    if (textUntilCursor.endsWith("[")) {
                        return {
                            suggestions: metrics.map((metric) => ({
                                label: `[${metric.name}]`,
                                kind: monaco.languages.CompletionItemKind.Variable,
                                insertText: `[${metric.name}]`,
                                detail: "Metric",
                                range,
                            })),
                        };
                    }

                    return {
                        suggestions: buildCompletionItems({
                            modelTables,
                            modelColumns,
                            metrics,
                            tableLookup,
                            monaco,
                            range,
                        }),
                    };
                },
            }
        );

        return () => {
            disposable.dispose();
        };
    }, [monaco, metrics, modelColumns, modelTables, tableLookup]);

    async function handleValidate() {
        setMessage(null);
        setIsValidating(true);

        try {
            const result = await validateMetricFormula({
                workspace_id: workspaceId,
                model_id: modelId,
                formula,
                metric_type: metricType,
            });

            setValidation(result);
            setMessage(result.valid ? "Formula is valid." : "Formula has validation errors.");
        } catch (error) {
            setValidation(null);
            setMessage(
                error instanceof Error ? error.message : "Unable to validate formula."
            );
        } finally {
            setIsValidating(false);
        }
    }

    async function handleSaveDraft() {
        setMessage(null);

        if (!name.trim()) {
            setMessage("Metric name is required.");
            return;
        }

        let validationResult = validation;

        if (!validationResult || !validationResult.valid) {
            setIsValidating(true);

            try {
                validationResult = await validateMetricFormula({
                    workspace_id: workspaceId,
                    model_id: modelId,
                    formula,
                    metric_type: metricType,
                });

                setValidation(validationResult);
            } catch (error) {
                setMessage(
                    error instanceof Error ? error.message : "Unable to validate formula."
                );
                setIsValidating(false);
                return;
            } finally {
                setIsValidating(false);
            }
        }

        if (!validationResult.valid || !validationResult.expression_json) {
            setMessage("Fix validation errors before saving.");
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                workspace_id: workspaceId,
                model_id: modelId,
                name: name.trim(),
                display_name: displayName.trim() || name.trim(),
                description: description.trim() || null,
                metric_type: metricType,
                aggregation_type: metricType === "base" ? "SUM" : null,
                source_table_id: null,
                source_column_id: null,
                expression: formula,
                expression_json: validationResult.expression_json,
                format_type: formatType,
            };

            const savedMetric = editingMetric
                ? await updateMetric(editingMetric.id, payload)
                : await createMetric(payload);

            onMetricCreated(savedMetric);

            setName("");
            setDisplayName("");
            setDescription("");
            setFormatType("number");
            setMetricType("base");
            setFormula("SUM()");
            setValidation(null);
            setMessage(
                editingMetric
                    ? "Metric updated."
                    : "Metric saved as draft."
            );
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to save metric.");
        } finally {
            setIsSaving(false);
        }
    }

    function insertText(value: string) {
        setFormula((current) => {
            if (!current || current === "SUM()") {
                return value;
            }

            return `${current}\n${value}`;
        });

        setValidation(null);
    }

    return (
        <section className="space-y-4">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Sigma className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                        <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                            Metric Formula Builder
                        </h2>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Type mmQL freely, validate against the semantic model, then save.
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                    <label className="space-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Metric Name
                        </span>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="revenue"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                        />
                    </label>

                    <label className="space-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Display Name
                        </span>
                        <input
                            value={displayName}
                            onChange={(event) => setDisplayName(event.target.value)}
                            placeholder="Revenue"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                        />
                    </label>

                    <label className="space-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Metric Type
                        </span>
                        <select
                            value={metricType}
                            onChange={(event) => {
                                setMetricType(event.target.value as MetricType);
                                setValidation(null);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                        >
                            <option value="base">Base</option>
                            <option value="calculated">Calculated</option>
                            <option value="mira_generated">Mira Generated</option>
                        </select>
                    </label>

                    <label className="space-y-1.5">
                        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Format
                        </span>
                        <select
                            value={formatType}
                            onChange={(event) => setFormatType(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                        >
                            <option value="number">Number</option>
                            <option value="currency">Currency</option>
                            <option value="percent">Percent</option>
                            <option value="integer">Integer</option>
                        </select>
                    </label>
                </div>

                <label className="block space-y-1.5">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Description
                    </span>
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Business definition for this metric..."
                        rows={2}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
                    />
                </label>

                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-slate-950/50">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            mmQL Formula
                        </span>

                        {validation?.valid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Valid
                            </span>
                        ) : validation && !validation.valid ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-300">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Invalid
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400">Not validated</span>
                        )}
                    </div>

                    <Editor
                        height="260px"
                        defaultLanguage="mmql"
                        value={formula}
                        onChange={(value) => {
                            setFormula(value || "");
                            setValidation(null);
                        }}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: "on",
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            tabSize: 2,
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: true,
                        }}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleValidate}
                        disabled={isValidating || isSaving}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                    >
                        {isValidating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <CheckCircle2 className="h-4 w-4" />
                        )}
                        Validate
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={!canSave || isValidating || isSaving}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-500 dark:hover:bg-cyan-400"
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {editingMetric ? "Update Draft" : "Save Draft"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setInterpretOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-700 transition hover:bg-cyan-500/20 dark:text-cyan-300"
                    >
                        <Plus className="h-4 w-4" />
                        Interpret with Mira
                    </button>
                </div>

                {message ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200">
                        {message}
                    </div>
                ) : null}

                {validation?.errors?.length ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-400/20 dark:bg-red-500/10">
                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-700 dark:text-red-300">
                            <AlertCircle className="h-4 w-4" />
                            Validation Errors
                        </div>

                        <div className="space-y-1">
                            {validation.errors.map((error, index) => (
                                <div
                                    key={`${error.code}-${index}`}
                                    className="text-sm text-red-700 dark:text-red-200"
                                >
                                    <span className="font-mono text-xs">{error.code}</span>
                                    {" — "}
                                    {error.message}
                                    {error.path ? (
                                        <span className="ml-1 font-mono text-xs opacity-75">
                                            {error.path}
                                        </span>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            <MetricInterpretDialog
                open={interpretOpen}
                onClose={() => setInterpretOpen(false)}
                workspaceId={workspaceId}
                modelId={modelId}
                hasExistingFormula={
                    formula.trim().length > 0 && formula.trim() !== "SUM()"
                }
                onApply={(formula) => {
                    setFormula(formula);
                    setValidation(null);
                    setMessage("Mira suggestion applied. Please validate before saving.");
                    setInterpretOpen(false);
                }}
                onUseExplanation={(description) => {
                    setDescription(description);
                    setMessage("Mira explanation added as metric description.");
                }}
            />
        </section>
    );
}