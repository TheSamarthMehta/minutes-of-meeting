"use client";

import { SearchableDropdownDynamic } from "./SearchableDropdownDynamic";

interface DynamicSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  onAddNew: () => void;
  isLoading?: boolean;
  error?: string;
}

export function DynamicSelect(props: DynamicSelectProps) {
  return <SearchableDropdownDynamic {...props} />;
}
