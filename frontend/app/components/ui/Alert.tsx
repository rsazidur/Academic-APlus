interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}

export function Alert({ variant = "error", children }: AlertProps) {
  const variantStyles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className={`rounded-xl border-2 p-4 text-base ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}
