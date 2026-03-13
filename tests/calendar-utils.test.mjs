import test from "node:test";
import assert from "node:assert/strict";
import {
  toDateKey,
  getMeetingsForDate,
  generateCalendarDays,
  isToday,
  getStatusColor,
  buildGoogleCalendarUrl,
} from "../lib/utils/calendar.js";

test("toDateKey returns YYYY-MM-DD", () => {
  assert.equal(toDateKey("2026-03-13T10:30:00.000Z"), "2026-03-13");
});

test("getMeetingsForDate filters meetings on local date", () => {
  const meetings = [
    { id: "1", date: "2026-03-13T08:00:00.000Z" },
    { id: "2", date: "2026-03-14T08:00:00.000Z" },
  ];

  const filtered = getMeetingsForDate(
    meetings,
    new Date("2026-03-13T00:00:00.000Z"),
  );
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, "1");
});

test("generateCalendarDays always returns 42 cells", () => {
  const days = generateCalendarDays(new Date("2026-03-01T00:00:00.000Z"));
  assert.equal(days.length, 42);
});

test("generateCalendarDays includes current month days", () => {
  const days = generateCalendarDays(new Date("2026-02-15T00:00:00.000Z"));
  const currentMonthDays = days.filter((day) => day.isCurrentMonth);
  assert.equal(currentMonthDays.length, 28);
});

test("isToday uses provided now date", () => {
  const now = new Date(2026, 2, 13, 10, 0, 0);
  const sameDay = new Date(2026, 2, 13, 23, 59, 0);
  const nextDay = new Date(2026, 2, 14, 0, 0, 0);

  assert.equal(isToday(sameDay, now), true);
  assert.equal(isToday(nextDay, now), false);
});

test("getStatusColor maps known statuses and fallback", () => {
  assert.equal(getStatusColor("UPCOMING"), "bg-blue-500/10 text-blue-400");
  assert.equal(getStatusColor("ONGOING"), "bg-green-500/10 text-green-400");
  assert.equal(getStatusColor("COMPLETED"), "bg-gray-500/10 text-gray-400");
  assert.equal(getStatusColor("CANCELLED"), "bg-red-500/10 text-red-400");
  assert.equal(getStatusColor("UNKNOWN"), "bg-blue-500/10 text-blue-400");
});

test("buildGoogleCalendarUrl includes title, location and detail link", () => {
  const url = buildGoogleCalendarUrl(
    {
      id: "meeting-1",
      title: "Team Sync",
      date: "2026-03-13",
      time: "10:30",
      agenda: "Sprint progress",
      description: "Weekly sync",
      venue: { name: "Room 101" },
    },
    "http://localhost:3000",
  );

  assert.ok(url.startsWith("https://calendar.google.com/calendar/render?"));
  assert.ok(url.includes("text=Team+Sync"));
  assert.ok(url.includes("location=Room+101"));
  assert.ok(url.includes("meeting_management%2Fdetails%3Fid%3Dmeeting-1"));
});

test("buildGoogleCalendarUrl all-day format when time is missing", () => {
  const url = buildGoogleCalendarUrl({
    id: "meeting-2",
    title: "Planning",
    date: "2026-03-20",
    time: null,
    agenda: null,
    description: null,
    venue: null,
  });

  assert.ok(url.includes("dates=20260320%2F20260321"));
});
