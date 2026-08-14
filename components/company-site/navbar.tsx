"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MMMonogram } from "@/components/brand/mm-monogram";

const productLinks = [
  {
    label: "InsightMend",
    description: "Enterprise decision intelligence",
    href: "https://insightmend.com",
  },
  {
    label: "LifeMeld",
    description: "AI for everyday life",
    href: "https://www.lifemeldai.com",
  },
  {
    label: "TechMeld",
    description: "Technology intelligence platform",
    href: "/techmeld",
  },
];

const assistantLinks = [
  {
    label: "MINA",
    description: "Life assistant, inside LifeMeld",
    href: "/assistants/mina",
  },
  {
    label: "MIRA",
    description: "Business assistant, inside InsightMend",
    href: "/assistants/mira",
  },
];

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Technology", href: "/technology" },
  { label: "Blog", href: "/techmeld/news" },
  { label: "Research", href: "/research" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const noMotion = useReducedMotion();
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="site-header">
      <nav className="nav-container">
        <Link href="/" className="brand" aria-label="MetricMend AI home">
          <span className="mm-monogram-wrap">
            <MMMonogram size={34} decorative />
          </span>
          <span className="brand-wordmark">MetricMend AI</span>
        </Link>

        <div className="nav-main">
          <div className="desktop-nav">
            <Link href="/">Home</Link>
            <Link
              href="/products"
              className={isCurrent("/products") ? "nav-current" : undefined}
              aria-current={isCurrent("/products") ? "page" : undefined}
            >
              Products
            </Link>

            {primaryLinks.filter((item) => item.href !== "/").map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={isCurrent(item.href) ? "nav-current" : undefined}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="nav-side">
          <Dropdown
            label="Product Apps"
            items={[...productLinks, ...assistantLinks]}
            active={pathname.startsWith("/assistants")}
          />

          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav"
            initial={noMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={noMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <p className="mobile-label">Products</p>
            {productLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                target={isExternalHref(item.href) ? "_blank" : undefined}
                rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Link>
            ))}

            <p className="mobile-label">Assistants</p>
            {assistantLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <p className="mobile-label">Company</p>
            {primaryLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

type DropdownProps = {
  label: string;
  active?: boolean;
  items: {
    label: string;
    description: string;
    href: string;
  }[];
};

function Dropdown({ label, items, active = false }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown${open ? " is-open" : ""}`}>
      <button
        type="button"
        className={`dropdown-trigger${active ? " nav-current" : ""}`}
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <ChevronDown className="dropdown-chevron" size={15} />
      </button>

      <div className="dropdown-menu" role="menu" aria-hidden={!open}>
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="dropdown-item"
            role="menuitem"
            onClick={() => setOpen(false)}
            target={isExternalHref(item.href) ? "_blank" : undefined}
            rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
