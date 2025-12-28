import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            'bg-teal-700 text-white hover:bg-teal-800 focus:ring-teal-500 shadow-sm hover:shadow-md': variant === 'default',
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400': variant === 'outline',
            'text-slate-700 hover:bg-slate-100': variant === 'ghost',
          },
          {
            'h-10 px-4 py-2.5 text-sm': size === 'default',
            'h-8 px-3 py-1.5 text-xs': size === 'sm',
            'h-12 px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
