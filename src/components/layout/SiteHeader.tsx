"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV, PARTNER_HREF } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { buttonClass } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { useHydrated } from "@/components/layout/Providers";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hydrated = useHydrated();
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const setCartOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const first = menuRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && menuRef.current) {
        const els = [...menuRef.current.querySelectorAll<HTMLElement>("a,button")];
        const [f, l] = [els[0], els[els.length - 1]];
        if (e.shiftKey && document.activeElement === f) (e.preventDefault(), l.focus());
        else if (!e.shiftKey && document.activeElement === l) (e.preventDefault(), toggleRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-yellow px-4 py-2 font-semibold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <div
          className={`mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 rounded-full border pl-4 pr-2 transition-all duration-500 sm:pl-6 ${
            scrolled || open ? "border-ink/5 bg-paper/90 shadow-[0_10px_40px_-18px_rgba(0,24,56,0.45)] backdrop-blur-xl" : "border-ink/5 bg-paper/75 backdrop-blur-md"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="ReShade Colours — home">
            <Logo className="h-11 w-auto" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative rounded-full px-4 py-2 text-[0.94rem] font-medium transition-colors ${
                      isActive(item.href) ? "text-navy" : "text-ink-soft hover:text-navy"
                    }`}
                  >
                    {isActive(item.href) && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-navy/[0.07]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative grid size-11 place-items-center rounded-full text-navy transition hover:bg-navy/5"
              aria-label={`Open cart${hydrated && count ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 7h12l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5L6 7Z" />
                <path d="M9 7V5.5a3 3 0 0 1 6 0V7" />
              </svg>
              <AnimatePresence>
                {hydrated && count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-red px-1 text-[0.68rem] font-bold leading-5 text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link href={PARTNER_HREF} className={buttonClass("navy", "sm", "hidden !h-11 !px-5 sm:inline-flex")} aria-current={isActive(PARTNER_HREF) ? "page" : undefined}>
              Become a Partner
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="grid size-11 place-items-center rounded-full bg-navy text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-navy px-6 pb-10 pt-28 text-white lg:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 44px) 44px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 44px) 44px)" }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {[...NAV, { href: PARTNER_HREF, label: "Become a Partner" }].map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={`block py-2 font-display text-[2.6rem] font-extrabold leading-tight tracking-tight ${isActive(item.href) ? "text-yellow" : "text-white"}`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto pt-10">
              <Link href={PARTNER_HREF} className={buttonClass("primary", "lg", "w-full")}>
                Become a Partner
              </Link>
              <p className="mt-6 text-sm text-white/65">A sustainability initiative with Enactus Humber Polytechnic.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
