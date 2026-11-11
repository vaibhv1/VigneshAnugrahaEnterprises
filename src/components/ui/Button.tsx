import { Link } from "react-router-dom";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

const variants = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  secondary: "border border-navy/20 bg-white text-navy hover:border-gold",
  gold: "bg-gold text-navy hover:bg-gold-bright",
  ghost: "border border-white/40 text-white hover:border-gold",
} as const;

export type ButtonVariant = keyof typeof variants;

const base =
  "inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold tracking-wide transition duration-200 motion-reduce:transition-none";

type Shared = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type AsLink = Shared & { to: string };
type AsButton = Shared &
  { to?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export function Button({ variant = "primary", className, children, ...props }: AsLink | AsButton) {
  const classes = cn(base, variants[variant], className);
  if ("to" in props && props.to) {
    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }
  const { type = "button", ...buttonProps } = props as AsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
