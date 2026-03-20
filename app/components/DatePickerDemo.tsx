"use client";

import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Label } from "@/app/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface DatePickerDemoProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  id?: string;
  isRequired?: boolean;
}

const DatePickerDemo = ({
  label = "Date picker",
  value,
  onChange,
  id = "date",
  isRequired = false,
}: DatePickerDemoProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange?.(newDate);
    setOpen(false);
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id} className="px-1 text-base">
        {label} {isRequired && <span className="text-red-400">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="h-12 w-full justify-between px-4 text-base font-medium"
          >
            {date ? date.toLocaleDateString() : "Pick a date"}
            <ChevronDownIcon className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerDemo;
