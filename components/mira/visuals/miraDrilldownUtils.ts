export type MiraDrilldownPayload = {
  dimension?: string | null;
  value?: string | number | null;
  key?: string | number | null;
  keyColumn?: string | null;
  row?: Record<string, any>;
  visual?: any;
};

export type MiraDrilldownQuestion = {
  displayText: string;
  executionPrompt: string;
};

function prettifyDimension(value: string | null | undefined) {
  if (!value) return "Entity";

  return value
    .replace(/_id$/i, "")
    .replaceAll("_", " ")
    .replace(/\w\S*/g, (text) =>
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
    );
}

function getDimension(payload: MiraDrilldownPayload) {
  return (
    payload.dimension ||
    payload.visual?.metadata?.dimension ||
    payload.visual?.metadata?.dimension_column ||
    payload.row?.dimension ||
    "Entity"
  );
}

function getDisplayValue(payload: MiraDrilldownPayload) {
  return (
    payload.value ??
    payload.row?.category ??
    payload.row?.display_value ??
    payload.row?.label ??
    payload.row?.raw?.category ??
    null
  );
}

function getStableKey(payload: MiraDrilldownPayload) {
  return (
    payload.key ??
    payload.row?.category_key ??
    payload.row?.value_key ??
    payload.row?.raw?.category_key ??
    payload.row?.raw?.value_key ??
    null
  );
}

function getKeyColumn(payload: MiraDrilldownPayload) {
  return (
    payload.keyColumn ??
    payload.visual?.metadata?.key_column ??
    payload.row?.key_column ??
    payload.row?.raw?.key_column ??
    payload.visual?.metadata?.dimension_column ??
    null
  );
}

export function buildDrilldownQuestion(
  payload: MiraDrilldownPayload,
): MiraDrilldownQuestion | null {
  const rawDimension = getDimension(payload);
  const dimension = prettifyDimension(rawDimension);
  const displayValue = getDisplayValue(payload);
  const key = getStableKey(payload);
  const keyColumn = getKeyColumn(payload);

  if (!displayValue) return null;

  const displayText = `Analyzing ${dimension} "${displayValue}"`;

  const executionPrompt =
    key && keyColumn
      ? `
Analyze ${dimension} "${displayValue}".

Use this exact governed entity filter:
field: ${keyColumn}
operator: =
value: ${key}

Drill into a different related business dimension,
not ${rawDimension} again.

Show the next most useful breakdown.
`.trim()
      : `
Analyze ${dimension} "${displayValue}".

Use this display entity filter:
field: ${rawDimension}
operator: =
value: ${displayValue}

Drill into a different related business dimension,
not ${rawDimension} again.

Show the next most useful breakdown.
`.trim();

  return {
    displayText,
    executionPrompt,
  };
}