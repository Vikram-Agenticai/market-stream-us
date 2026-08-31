// All timing references across the site use United States (Eastern) time.
export const US_TIME_ZONE = "America/New_York";
export const US_LOCALE = "en-US";

export function formatUSDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(US_LOCALE, {
    timeZone: US_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatUSDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const formatted = new Intl.DateTimeFormat(US_LOCALE, {
    timeZone: US_TIME_ZONE,
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
  return formatted.replace(" at ", " at ");
}

export function formatUSTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(US_LOCALE, {
    timeZone: US_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function formatUSWeekday(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(US_LOCALE, {
    timeZone: US_TIME_ZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function timeAgoUS(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return formatUSDate(date);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}


/** Current calendar date in U.S. Eastern time, formatted YYYY-MM-DD. */
export function todayUS(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: US_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function easternOffsetMinutes(utcDate: Date): number {
  const tzDate = new Date(utcDate.toLocaleString("en-US", { timeZone: US_TIME_ZONE }));
  const utc = new Date(utcDate.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((tzDate.getTime() - utc.getTime()) / 60000);
}

/** UTC ISO bounds covering [startDate .. endDate] as full U.S. Eastern days. */
export function usDateRangeToIso(startDate: string, endDate: string): { from: string; to: string } {
  const base = new Date(`${startDate}T12:00:00Z`);
  const offset = easternOffsetMinutes(base);
  const from = new Date(`${startDate}T00:00:00Z`).getTime() - offset * 60000;
  const to = new Date(`${endDate}T23:59:59.999Z`).getTime() - offset * 60000;
  return { from: new Date(from).toISOString(), to: new Date(to).toISOString() };
}

/** Shift a YYYY-MM-DD date string by a number of days. */
export function shiftUSDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Friendly label for a YYYY-MM-DD archive date. */
export function formatArchiveDate(date: string): string {
  return new Intl.DateTimeFormat(US_LOCALE, {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00Z`));
}
