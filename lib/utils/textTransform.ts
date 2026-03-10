/**
 * Text transformation utilities for input fields
 */

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes the first letter of each word
 */
export function capitalizeWords(text: string): string {
  if (!text) return text;
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Converts text to uppercase (for code fields)
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * Handles onChange event with first letter capitalization
 */
export function handleCapitalizeFirstChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setter: (value: string) => void
) {
  const value = e.target.value;
  if (value.length === 1) {
    setter(value.toUpperCase());
  } else {
    setter(value);
  }
}

/**
 * Handles onChange event with uppercase transformation (for code fields)
 */
export function handleUppercaseChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setter: (value: string) => void
) {
  setter(e.target.value.toUpperCase());
}
