import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        className={`mt-2 w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
}
