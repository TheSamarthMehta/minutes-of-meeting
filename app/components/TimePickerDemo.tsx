"use client";

import { Clock8Icon } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface TimePickerDemoProps {
  label?: string;
  value?: string;
  onChange?: (time: string) => void;
  id?: string;
  isRequired?: boolean;
  placeholder?: string;
  step?: number;
  error?: string;
}

const TimePickerDemo = ({
  label = "Time picker",
  value,
  onChange,
  id = "time",
  isRequired = false,
  placeholder = "Select time",
  step = 60,
  error,
}: TimePickerDemoProps) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <Label htmlFor={id} className="px-1 text-base flex items-center gap-2">
          <Clock8Icon className="h-4 w-4 text-gray-400" />
          <span>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </span>
        </Label>
      )}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
          <Clock8Icon className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Time</span>
        </div>
        <Input
          id={id}
          type="time"
          value={value ?? ""}
          step={step}
          onChange={(e) => onChange?.(e.target.value)}
          className={`peer h-12 bg-[#1a1a1a] pl-10 text-base text-gray-200 border-gray-700 placeholder:text-gray-500 appearance-none scheme-dark [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${
            error ? "border-red-500" : ""
          }`}
          aria-label={label || placeholder}
        />
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
};

export default TimePickerDemo;
