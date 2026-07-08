// Shared Visa Bulletin data source — update this file only; both the public
// marketing page and the dashboard tracker read from it, so it can't drift.
export const BULLETIN_MONTH = "June 2026";

export interface BulletinRow {
  category: string;
  chargeability: string;
  china: string;
  india: string;
  mexico: string;
  philippines: string;
}

export const FINAL_ACTION: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "C", china: "01JAN19", india: "01APR12", mexico: "C", philippines: "C" },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01JUL19", india: "01JUN12", mexico: "22OCT22", philippines: "C" },
  { category: "EB-3 Other", chargeability: "01JAN21", china: "01JAN21", india: "01JAN21", mexico: "01JAN21", philippines: "01JAN21" },
  { category: "EB-4", chargeability: "C", china: "C", india: "C", mexico: "22MAY19", philippines: "22MAY19" },
  { category: "EB-5 Set-aside", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

export const DATES_FOR_FILING: BulletinRow[] = [
  { category: "EB-1", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
  { category: "EB-2", chargeability: "C", china: "01MAY19", india: "01NOV12", mexico: "C", philippines: "C" },
  { category: "EB-3 Skilled/Prof", chargeability: "C", china: "01NOV19", india: "01SEP12", mexico: "C", philippines: "C" },
  { category: "EB-3 Other", chargeability: "01JUL21", china: "01JUL21", india: "01JUL21", mexico: "01JUL21", philippines: "01JUL21" },
  { category: "EB-4", chargeability: "C", china: "C", india: "C", mexico: "08JUL19", philippines: "08JUL19" },
  { category: "EB-5 Set-aside", chargeability: "C", china: "C", india: "C", mexico: "C", philippines: "C" },
];

// 6-month history for movement speed calculation
export const HISTORY = [
  { month: "Jun 2026", eb2India: "01APR12", eb3India: "01JUN12", eb2China: "01JAN19", eb3China: "01JUL19" },
  { month: "May 2026", eb2India: "01MAR12", eb3India: "01MAY12", eb2China: "01DEC18", eb3China: "01MAY19" },
  { month: "Apr 2026", eb2India: "01FEB12", eb3India: "01APR12", eb2China: "01NOV18", eb3China: "01APR19" },
  { month: "Mar 2026", eb2India: "01JAN12", eb3India: "01MAR12", eb2China: "01OCT18", eb3China: "01MAR19" },
  { month: "Feb 2026", eb2India: "01NOV11", eb3India: "01JAN12", eb2China: "01SEP18", eb3China: "01FEB19" },
  { month: "Jan 2026", eb2India: "01OCT11", eb3India: "01NOV11", eb2China: "01AUG18", eb3China: "01JAN19" },
];

export const COUNTRY_COLS: { key: keyof BulletinRow; label: string }[] = [
  { key: "chargeability", label: "All Chargeability" },
  { key: "china", label: "China" },
  { key: "india", label: "India" },
  { key: "mexico", label: "Mexico" },
  { key: "philippines", label: "Philippines" },
];

export function parseDate(d: string): Date | null {
  if (!d || d === "C" || d === "U") return null;
  const day = parseInt(d.slice(0, 2), 10);
  const months: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };
  const mon = months[d.slice(2, 5).toUpperCase()];
  const yr = parseInt(d.slice(5), 10) + 2000;
  if (isNaN(day) || mon === undefined || isNaN(yr)) return null;
  return new Date(yr, mon, day);
}

export function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

export function getMovementSpeed(category: string, country: string): number | null {
  if (country !== "india" && country !== "china") return null;
  const col = country === "india"
    ? (category === "EB-2" ? "eb2India" : category === "EB-3 Skilled/Prof" ? "eb3India" : null)
    : (category === "EB-2" ? "eb2China" : category === "EB-3 Skilled/Prof" ? "eb3China" : null);
  if (!col) return null;

  let totalMovement = 0;
  let count = 0;
  for (let i = 0; i < HISTORY.length - 1; i++) {
    const newer = parseDate(HISTORY[i][col as keyof typeof HISTORY[0]]);
    const older = parseDate(HISTORY[i + 1][col as keyof typeof HISTORY[0]]);
    if (newer && older) {
      totalMovement += monthsBetween(older, newer);
      count++;
    }
  }
  return count > 0 ? totalMovement / count : null;
}
