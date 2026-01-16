import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
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
  const baseStyles = "relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98] outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md border border-transparent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-md border border-transparent",
    outline: "border border-border bg-transparent hover:bg-muted hover:text-foreground text-foreground",
    ghost: "hover:bg-muted/50 hover:text-foreground text-muted-foreground",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
