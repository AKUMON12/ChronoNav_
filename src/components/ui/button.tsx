import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variantStyles = {
      primary: "bg-brand-primary text-white hover:bg-opacity-90",
      secondary: "bg-brand-secondary text-white hover:bg-opacity-90",
      outline: "border border-brand-border text-brand-dark hover:bg-brand-light",
      ghost: "text-brand-dark hover:bg-brand-light",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold transition-colors focus:outline-none disabled:opacity-50",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
