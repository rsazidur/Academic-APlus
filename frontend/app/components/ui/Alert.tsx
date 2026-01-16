interface AlertProps {
  variant?: "error" | "success" | "info";
  children: React.ReactNode;
}

export function Alert({ variant = "error", children }: AlertProps) {
  const variantStyles = {
    error: "bg-destructive/10 text-destructive border-destructive/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <div className={`rounded-xl border p-4 text-base backdrop-blur-sm ${variantStyles[variant]}`}>
      {children}
    </div>
  );
}
