import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "w-full rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-300 disabled:opacity-60 transform hover:scale-[1.02] active:scale-[0.98]";
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 shadow-md",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
