"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { localeNames } from "@/i18n/routing";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const mobileLangRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === `/${locale}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen && !mobileLangOpen) return;
    const onPointerDown = (e: Event) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (langOpen && !langRef.current?.contains(target)) setLangOpen(false);
      if (mobileLangOpen && !mobileLangRef.current?.contains(target))
        setMobileLangOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [langOpen, mobileLangOpen]);

  const links = [
    { href: "", label: t("home") },
    { href: "/products", label: t("products") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const getLocalizedHref = (segment: string, targetLocale: string) => {
    const raw = pathname.replace(/^\/(zh|en|es|pt|ru|ja|ko)/, "");
    if (segment === "") return `/${targetLocale}`;
    return `/${targetLocale}${segment}`;
  };

  const currentLangName = localeNames[locale] || locale.toUpperCase();

  const isActive = (linkHref: string) => {
    if (linkHref === "") return pathname === `/${locale}`;
    return pathname === `/${locale}${linkHref}`;
  };

  // Dark mode = transparent bg + white text (only on home page hero, not scrolled)
  const darkMode = isHome && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        darkMode
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-md shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="w-9 h-9 flex items-center justify-center bg-mountain-800 text-white font-serif text-sm font-bold group-hover:bg-peak-gold transition-colors duration-300">
            MZ
          </div>
          <span
            className={`font-serif text-lg tracking-wide hidden sm:block transition-colors duration-300 ${
              darkMode ? "text-white" : "text-mountain-800"
            }`}
          >
            牧洲手套
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "text-peak-gold"
                  : darkMode
                    ? "text-white/80 hover:text-white"
                    : "text-alpine-500 hover:text-mountain-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={`/${locale}/inquiry`}
            className={`ml-2 px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              darkMode
                ? "bg-white/20 text-white border border-white/30 hover:bg-white hover:text-mountain-800"
                : "bg-mountain-800 text-white hover:bg-mountain-700"
            }`}
          >
            {t("inquiry")}
          </Link>

          {/* Desktop lang dropdown */}
          <div className="relative ml-2" ref={langRef}>
            <button
              onClick={() => {
                setLangOpen(!langOpen);
                setMobileLangOpen(false);
              }}
              aria-label="切换语言"
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-md transition-all duration-300 ${
                darkMode
                  ? "text-white border-white/40 hover:bg-white/15"
                  : "text-mountain-800 border-alpine-400/50 hover:bg-glacier-100"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{currentLangName}</span>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={`transition-transform ${langOpen ? "rotate-180" : ""}`}>
                <path d="M6 9L1 4h10z" />
              </svg>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-alpine-400/30 rounded-md py-1 min-w-[140px] z-50"
                >
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link
                      key={code}
                      href={getLocalizedHref("", code)}
                      className={`block px-4 py-2 text-sm hover:bg-glacier-100 transition-colors ${
                        locale === code ? "text-peak-gold font-semibold" : "text-alpine-700"
                      }`}
                    >
                      {name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile lang dropdown */}
          <div className="relative" ref={mobileLangRef}>
            <button
              onClick={() => {
                setMobileLangOpen(!mobileLangOpen);
                setLangOpen(false);
              }}
              aria-label="切换语言"
              className={`flex items-center gap-1 px-2 py-2 text-sm font-medium border rounded-md ${
                darkMode
                  ? "text-white border-white/40"
                  : "text-mountain-800 border-alpine-400/50"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-xs">{currentLangName}</span>
            </button>
            <AnimatePresence>
              {mobileLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute right-0 top-full mt-1 bg-white shadow-lg py-1 min-w-[90px] z-50"
                >
                  {Object.entries(localeNames).map(([code, name]) => (
                    <Link
                      key={code}
                      href={getLocalizedHref("", code)}
                      onClick={() => setMobileLangOpen(false)}
                      className={`block px-3 py-2 text-xs hover:bg-glacier-100 transition-colors ${
                        locale === code ? "text-peak-gold font-medium" : "text-alpine-500"
                      }`}
                    >
                      {name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`flex flex-col gap-1.5 p-2 ${darkMode ? "text-white" : "text-mountain-800"}`}
            aria-label="Menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-current"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-5 h-0.5 bg-current"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-5 h-0.5 bg-current"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-alpine-400/30 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-peak-gold bg-glacier-100"
                      : "text-mountain-800 hover:bg-glacier-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={`/${locale}/inquiry`}
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 text-base font-semibold text-center bg-mountain-800 text-white hover:bg-mountain-700 transition-colors"
              >
                {t("inquiry")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
