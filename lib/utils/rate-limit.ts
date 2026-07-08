// Best-effort in-memory rate limiter. Resets whenever the serverless
// instance cold-starts, so it isn't a hard guarantee — but it meaningfully
// raises the bar against basic scripted spam within a warm instance.
const hits = new Map<string, number[]>();

/** Returns true if `key` has made fewer than `max` requests in the last `windowMs`. */
export function allowRequest(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Periodically forget keys with no recent activity to avoid unbounded growth.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > windowMs)) hits.delete(k);
    }
  }

  return true;
}
