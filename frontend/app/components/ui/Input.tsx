import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>
      <input
        className={`w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-base text-slate-100 placeholder:text-slate-500 transition-all focus:border-primary/50 focus:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
