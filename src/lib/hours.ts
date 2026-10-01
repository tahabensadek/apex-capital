/** Callback hours we promise on the site: Mon–Fri, 8:00–18:00 Montreal time. */
export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 18;

export const isWithinBusinessHours = (date: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  return !["Sat", "Sun"].includes(weekday) && hour >= OPEN_HOUR && hour < CLOSE_HOUR;
};
