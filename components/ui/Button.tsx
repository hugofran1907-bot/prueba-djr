import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "light" | "outline" | "outline-light" | "burgundy";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-cream hover:bg-burgundy",
  burgundy: "bg-burgundy text-cream hover:bg-navy",
  light: "bg-cream text-navy hover:bg-white",
  outline: "border border-navy/80 text-navy hover:bg-navy hover:text-cream",
  "outline-light": "border border-cream/70 text-cream hover:bg-cream hover:text-navy",
};

const base =
  "group inline-flex min-h-11 items-center justify-center gap-3 rounded-full px-6 whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-[background-color,color,border-color,transform] duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-45";

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      className={cn("h-3 w-6 transition-transform duration-500 ease-editorial group-hover:translate-x-1", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", arrow = false, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      <span>{children}</span>
      {arrow && <ArrowIcon />}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant };

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...props} />;
}
