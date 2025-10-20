// JST (Asia/Tokyo) の今日を YYYY-MM-DD で返す
export function jstYmd(date = new Date()): string {
  // toLocaleString を JST 固定で
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // 例 "2025/10/17" → "2025-10-17"
  const parts = fmt.formatToParts(date);
  const y = parts.find(p => p.type === "year")!.value;
  const m = parts.find(p => p.type === "month")!.value;
  const d = parts.find(p => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}
