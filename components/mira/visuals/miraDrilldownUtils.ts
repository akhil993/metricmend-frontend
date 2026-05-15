export type MiraDrilldownPayload = {
  dimension?: string | null;
  value?: string | number | null;
  row?: Record<string, any>;
  visual?: any;
};

export function buildDrilldownQuestion(payload: MiraDrilldownPayload) {
  const dimension =
    payload.dimension ||
    payload.visual?.dimension ||
    payload.visual?.x_axis ||
    "category";

  const value =
    payload.value ??
    payload.row?.[dimension] ??
    payload.row?.category ??
    payload.row?.label ??
    payload.row?.state ??
    payload.row?.city ??
    payload.row?.customer ??
    payload.row?.product;

  if (!value) return null;

  return `Drill into ${dimension} = ${value}. Show the next most useful breakdown.`;
}