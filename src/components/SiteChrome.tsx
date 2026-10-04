import { Link } from "@tanstack/react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/engine";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/analyze", label: "Analyze" },
  { to: "/learn", label: "Learn" },
  { to: "/safety", label: "Safety Center" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-saffron text-ink">
        <ShieldCheck className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">
        Nivesh<span className="text-saffron">Rakshak</span>
      </span>
    </Link>
  );
}

function LangSwitch() {
  const { lang, setLang } = useI18n();
  const opts: [Lang, string][] = [["en", "English"], ["hi", "हिंदी"], ["mr", "मराठी"]];
  return (
    <div className="flex rounded-full border border-ink-foreground/15 p-0.5 text-sm" role="group" aria-label="Language">
      {opts.map(([k, l]) => (
        <button key={k} onClick={() => setLang(k)} aria-pressed={lang === k}
          className={`rounded-full px-3 py-1 transition ${lang === k ? "bg-ink-foreground text-ink font-semibold" : "text-ink-muted hover:text-ink-foreground"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink-foreground/10 bg-ink/90 text-ink-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="rounded-lg px-3 py-2 text-[15px] text-ink-muted transition hover:text-ink-foreground"
              activeProps={{ className: "text-ink-foreground font-semibold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitch />
          <Link to="/analyze" className="rounded-full bg-saffron px-5 py-2 text-[15px] font-semibold text-ink transition hover:brightness-110">
            Analyze Now
          </Link>
        </div>
        <button className="lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="animate-rise border-t border-ink-foreground/10 px-5 pb-6 lg:hidden">
          <nav className="flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="border-b border-ink-foreground/10 py-4 text-lg">
                {n.label}
              </Link>
            ))}
          </nav>
          <LangSwitch />
          <Link to="/analyze" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-saffron py-3 text-center font-semibold text-ink">
            Analyze Now
          </Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-ink-muted">Detect before you invest.</p>
          <p className="mt-1 text-sm text-ink-muted">Track A — Digital Fraud & Scam Resilience</p>
        </div>
        <nav className="flex flex-col gap-2 text-ink-muted">
          {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-ink-foreground">{n.label}</Link>)}
        </nav>
        <div className="text-sm leading-relaxed text-ink-muted">
          <p className="font-semibold text-ink-foreground">Disclaimer</p>
          <p className="mt-2">NiveshRakshak provides educational safety screening, not investment advice or a definitive fraud determination. Always independently verify financial claims through appropriate official sources.</p>
          <p className="mt-3">Built as a hackathon prototype focused on investor safety. Not affiliated with or endorsed by any regulator.</p>
        </div>
      </div>
    </footer>
  );
}
