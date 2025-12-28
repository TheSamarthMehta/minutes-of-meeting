import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200",
              "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-teal-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
