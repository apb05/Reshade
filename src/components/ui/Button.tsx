import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "navy" | "outline" | "outline-light" | "ghost" | "red";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-tight transition-[transform,background-color,color,box-shadow] duration-300 ease-[var(--ease-out-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45";

const sizes = { md: "h-12 px-6 text-[0.95rem]", lg: "h-14 px-8 text-base", sm: "h-10 px-4 text-sm" };

const variants: Record<Variant, string> = {
  primary: "bg-yellow text-navy shadow-[0_8px_30px_-10px_rgba(248,188,36,0.9)] hover:shadow-[0_14px_40px_-12px_rgba(248,188,36,1)] hover:-translate-y-0.5",
  navy: "bg-navy text-white hover:bg-navy-deep hover:-translate-y-0.5",
  red: "bg-red text-white hover:-translate-y-0.5",
  outline: "border-2 border-navy/80 text-navy hover:bg-navy hover:text-white",
  "outline-light": "border-2 border-white/70 text-white hover:bg-white hover:text-navy",
  ghost: "text-navy hover:bg-navy/5",
};

export function buttonClass(variant: Variant = "primary", size: keyof typeof sizes = "md", extra = "") {
  return `${base} ${sizes[size]} ${variants[variant]} ${extra}`;
}

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

type Common = { variant?: Variant; size?: keyof typeof sizes; arrow?: boolean; children: ReactNode; className?: string };

export function LinkButton({ variant, size, arrow, children, className = "", ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      <span className="relative">{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({ variant, size, arrow, children, className = "", ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      <span className="relative inline-flex items-center gap-2">{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
