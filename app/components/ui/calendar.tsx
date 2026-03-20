"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  onSelect?: (date: Date) => void;
  mode?: "single" | "range";
  selected?: Date;
  disabled?: (date: Date) => boolean;
  className?: string;
}

function Calendar({
  value,
  onChange,
  onSelect,
  selected,
  disabled,
  className,
}: CalendarProps) {
  const selectedDate = selected || value;
  const [currentDate, setCurrentDate] = React.useState(
    selectedDate || new Date(),
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDayClick = (date: Date) => {
    if (!disabled || !disabled(date)) {
      onChange?.(date);
      onSelect?.(date);
    }
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  return (
    <div
      className={cn(
        "p-4 bg-[#1a1a1a] rounded-lg border border-gray-800",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-[#252525] rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <h2 className="text-sm font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#252525] rounded transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => (
          <button
            key={idx}
            onClick={() => date && handleDayClick(date)}
            disabled={!date || (disabled && disabled(date))}
            className={cn(
              "p-2 text-sm rounded transition-colors",
              !date && "invisible",
              date &&
                disabled &&
                disabled(date) &&
                "text-gray-600 cursor-not-allowed opacity-50",
              date && !disabled && "text-gray-300 hover:bg-[#252525]",
              date &&
                isSelected(date) &&
                "bg-teal-600 text-white hover:bg-teal-700 font-semibold",
              date &&
                isToday(date) &&
                !isSelected(date) &&
                "border-2 border-teal-500",
            )}
          >
            {date?.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar, type CalendarProps };
