type DateInput = Date | string;

function toDate(d: DateInput): Date {
  return typeof d === "string" ? new Date(d) : d;
}

/** "January 1, 2026" */
export function formatDateLong(d: DateInput): string {
  return toDate(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

/** "Jan 1, 2026" */
export function formatDateShort(d: DateInput): string {
  return toDate(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** "Jan 1" */
export function formatDateShortNoYear(d: DateInput): string {
  return toDate(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
