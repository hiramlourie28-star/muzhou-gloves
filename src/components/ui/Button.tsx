"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  children: React.ReactNode;
}

export default function Button({ href, onClick, variant = "primary", children }: ButtonProps) {
  const locale = useLocale();

  const base = "inline-flex items-center px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300";
  const variants = {
    primary: "bg-mountain-800 text-white hover:bg-mountain-700",
    outline: "border border-mountain-800 text-mountain-800 hover:bg-mountain-800 hover:text-white",
    ghost: "text-alpine-500 hover:text-mountain-800",
  };

  const cls = `${base} ${variants[variant]}`;

  if (href) {
    const localized = href.startsWith("/") ? `/${locale}${href}` : href;
    return <Link href={localized} className={cls}>{children}</Link>;
  }

  return <button onClick={onClick} className={cls}>{children}</button>;
}
