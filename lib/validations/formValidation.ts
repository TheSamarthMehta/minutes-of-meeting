/**
 * Reusable validation utilities for form validation
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export type ValidationErrors = Record<string, string>;

/**
 * Validate a single field based on rules
 */
export function validateField(
  value: any,
  rules: ValidationRule[]
): string | null {
  for (const rule of rules) {
    // Required validation
    if (rule.required) {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return rule.message || "This field is required";
      }
    }

    // Skip other validations if value is empty and not required
    if (!value && !rule.required) continue;

    // Min length validation
    if (
      rule.minLength !== undefined &&
      typeof value === "string" &&
      value.length < rule.minLength
    ) {
      return (
        rule.message ||
        `Must be at least ${rule.minLength} characters`
      );
    }

    // Max length validation
    if (
      rule.maxLength !== undefined &&
      typeof value === "string" &&
      value.length > rule.maxLength
    ) {
      return (
        rule.message ||
        `Must not exceed ${rule.maxLength} characters`
      );
    }

    // Pattern validation
    if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
      return rule.message || "Invalid format";
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message || "Validation failed";
    }
  }

  return null;
}

/**
 * Validate all fields in a form based on validation rules
 */
export function validateForm(
  data: Record<string, any>,
  rules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const error = validateField(data[field], fieldRules);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

/**
 * Common validation rules
 */
export const commonValidations = {
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || "This field is required",
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    message:
      message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    message:
      message || `Must not exceed ${length} characters`,
  }),

  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: message || "Invalid email address",
  }),

  phone: (message?: string): ValidationRule => ({
    pattern: /^[\d\s\-\+\(\)]+$/,
    message: message || "Invalid phone number",
  }),

  url: (message?: string): ValidationRule => ({
    pattern: /^https?:\/\/.+/,
    message: message || "Invalid URL",
  }),

  numeric: (message?: string): ValidationRule => ({
    pattern: /^\d+$/,
    message: message || "Must be a number",
  }),

  alphanumeric: (message?: string): ValidationRule => ({
    pattern: /^[a-zA-Z0-9]+$/,
    message: message || "Must contain only letters and numbers",
  }),

  futureDate: (message?: string): ValidationRule => ({
    custom: (value: string) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    message: message || "Date cannot be in the past",
  }),

  timeAfter: (
    compareField: string,
    compareValue: string,
    message?: string
  ): ValidationRule => ({
    custom: (value: string) => {
      if (!value || !compareValue) return true;
      return value > compareValue;
    },
    message: message || `Must be after ${compareField}`,
  }),
};

/**
 * Scroll to the first error field
 */
export function scrollToFirstError(errors: ValidationErrors) {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(
      `[name="${firstErrorField}"]`
    ) as HTMLElement;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  }
}
