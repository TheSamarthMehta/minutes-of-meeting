/**
 * Format date to a readable string
 * @param date Date object or string
 * @returns Formatted date string (e.g., "Mar 9, 2026")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format time to a readable string
 * @param date Date object or string
 * @returns Formatted time string (e.g., "8:04 AM")
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date and time together
 * @param date Date object or string
 * @returns Object with formatted date and time
 */
export function formatDateTime(date: Date | string): { date: string; time: string } {
  return {
    date: formatDate(date),
    time: formatTime(date),
  };
}

/**
 * Format date for shorter display (e.g., "Mar 9")
 * @param date Date object or string
 * @returns Short formatted date string
 */
export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
