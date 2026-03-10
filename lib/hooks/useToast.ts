import { useState, useEffect, useCallback } from 'react';

export interface Toast {
  message: string;
  type: 'success' | 'error';
}

/**
 * Custom hook for managing toast notifications
 * @param duration Duration in milliseconds before toast auto-dismisses (default: 3000)
 * @returns Object with toast state, showToast, and dismissToast functions
 */
export function useToast(duration: number = 3000) {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast, duration]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
