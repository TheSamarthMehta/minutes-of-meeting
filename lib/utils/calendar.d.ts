export interface CalendarMeetingLike {
  id?: string;
  title?: string;
  date: string;
  time?: string | null;
  status?: string;
  agenda?: string | null;
  description?: string | null;
  venue?: {
    name?: string;
  } | null;
}

export interface CalendarDayCell {
  date: Date;
  isCurrentMonth: boolean;
}

export function toDateKey(dateLike: string | Date): string;
export function getMeetingsForDate<T extends { date: string }>(
  meetings: T[],
  date: Date
): T[];
export function generateCalendarDays(currentDate: Date): CalendarDayCell[];
export function isToday(date: Date, now?: Date): boolean;
export function getStatusColor(status: string): string;
export function buildGoogleCalendarUrl(
  meeting: CalendarMeetingLike,
  appUrl?: string
): string;
