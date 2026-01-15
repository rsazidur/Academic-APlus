import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <select
        className={`mt-2 w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
