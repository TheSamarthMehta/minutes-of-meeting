export function toDateKey(dateLike) {
  const d = new Date(dateLike);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getMeetingsForDate(meetings, date) {
  const target = toDateKey(date);
  return meetings.filter((meeting) => toDateKey(meeting.date) === target);
}

export function generateCalendarDays(currentDate) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay();
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
}

export function isToday(date, now = new Date()) {
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

export function getStatusColor(status) {
  const value = String(status || "").toUpperCase();
  switch (value) {
    case "UPCOMING":
      return "bg-blue-500/10 text-blue-400";
    case "ONGOING":
      return "bg-green-500/10 text-green-400";
    case "COMPLETED":
      return "bg-gray-500/10 text-gray-400";
    case "CANCELLED":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-blue-500/10 text-blue-400";
  }
}

function parseMeetingDateTime(dateLike, time) {
  const base = new Date(dateLike);

  if (!time) {
    return { start: base, hasTime: false };
  }

  const trimmed = String(time).trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);

  if (!match) {
    return { start: base, hasTime: false };
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const ampm = match[3]?.toUpperCase();

  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const start = new Date(base);
  start.setHours(hour, minute, 0, 0);
  return { start, hasTime: true };
}

function compactUtc(d) {
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function compactAllDay(d) {
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export function buildGoogleCalendarUrl(meeting, appUrl = "") {
  const { start, hasTime } = parseMeetingDateTime(meeting.date, meeting.time);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const dates = hasTime
    ? `${compactUtc(start)}/${compactUtc(end)}`
    : `${compactAllDay(start)}/${compactAllDay(new Date(start.getTime() + 24 * 60 * 60 * 1000))}`;

  const detailLines = [meeting.agenda, meeting.description]
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter((value) => value.length > 0);

  if (appUrl && meeting.id) {
    detailLines.push(`${appUrl}/meeting_management/details?id=${meeting.id}`);
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: meeting.title || "Meeting",
    dates,
    details: detailLines.join("\n\n"),
    location: meeting.venue?.name || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
