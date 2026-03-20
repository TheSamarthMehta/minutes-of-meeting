"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(
  undefined,
);

function Popover({ children, open, onOpenChange }: any) {
  const [internalOpen, setInternalOpen] = React.useState(open || false);
  const actualOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <PopoverContext.Provider value={{ open: actualOpen, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error("PopoverTrigger must be used within Popover");

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          context.setOpen(!context.open);
          const onClick = (children.props as any)?.onClick;
          if (onClick) onClick(e);
        },
      });
    }

    return (
      <button
        type="button"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          context.setOpen(!context.open);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    const context = React.useContext(PopoverContext);
    if (!context) throw new Error("PopoverContent must be used within Popover");

    if (!context.open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 w-72 rounded-lg border border-gray-700 bg-[#1a1a1a] p-4 text-gray-100 shadow-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
          align === "start" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "end" && "right-0",
          className,
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        {...props}
      />
    );
  },
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };
