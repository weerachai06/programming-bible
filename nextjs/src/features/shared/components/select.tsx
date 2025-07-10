"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps, useId } from "react";

export const selectVariants = cva(
  "rounded-lg border border-solid transition-colors flex items-center justify-between bg-background text-foreground",
  {
    variants: {
      size: {
        sm: "px-3 py-2 text-sm min-h-8",
        md: "px-4 py-2 text-base min-h-10",
        lg: "px-5 py-3 text-lg min-h-12",
      },
      variant: {
        default:
          "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
        outline: "border-gray-300 bg-transparent hover:bg-gray-50",
        ghost: "border-transparent hover:bg-gray-100",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<ComponentProps<"select">, "size">,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * A reusable select dropdown component with label, error handling, and helper text support.
 *
 * @param props - Additional HTML select element properties
 * @param props.options - Array of option objects with value, label, and optional disabled properties
 * @param props.placeholder - Optional placeholder text shown as the first disabled option
 * @param props.label - Optional label text displayed above the select input
 * @param props.error - Optional error message displayed below the select in red text
 * @param props.helperText - Optional helper text displayed below the select when no error is present
 * @param props.className - Additional CSS classes to apply to the select element
 * @param props.size - Size variant for the select component styling
 * @param props.variant - Style variant for the select component styling
 *
 * @returns A styled select dropdown component with accessibility features
 *
 * @example
 * ```tsx
 * <Select
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2', disabled: true }
 *   ]}
 *   label="Choose an option"
 *   placeholder="Select..."
 *   helperText="Please select one option"
 * />
 * ```
 */
export const Select = ({
  options,
  placeholder,
  label,
  error,
  helperText,
  className,
  size,
  variant,
  ...props
}: SelectProps) => {
  const selectId = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <select
        {...props}
        id={selectId}
        className={selectVariants({ size, variant, className })}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
