"use client";
import type React from "react";

type Field = {
  key: string;
  label: string;
  type: "text" | "password" | "select" | "number" | "boolean" | "textarea";
  required?: boolean;
  placeholder?: string | null;
  help_text?: string | null;
  options?: { label: string; value: string }[] | null;
};

type Props = {
  field: Field;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
};

export default function DynamicField({ field, value, onChange }: Props) {
  const baseClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          className={baseClass}
          placeholder={field.placeholder ?? ""}
          value={String(value ?? "")}
          onChange={(event) => onChange(field.key, event.target.value)}
          rows={3}
        />
      ) : field.type === "boolean" ? (
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(field.key, event.target.checked)}
          />
          Enable
        </label>
      ) : field.type === "select" ? (
        <select
          className={baseClass}
          value={String(value ?? "")}
          onChange={(event) => onChange(field.key, event.target.value)}
        >
          <option value="">Select...</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={`mm-field-${field.key}-${Math.random().toString(36).slice(2)}`}
          type="text"
          value={String(value ?? "")}
          onChange={(event) => onChange(field.key, event.target.value)}
          placeholder={field.placeholder ?? ""}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          className={baseClass}
          style={
            field.type === "password"
              ? ({ WebkitTextSecurity: "disc" } as React.CSSProperties)
              : undefined
          }
        />
      )}

      {field.help_text && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {field.help_text}
        </p>
      )}
    </div>
  );
}