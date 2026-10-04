import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, FileSearch, Gauge, Languages, Lock, MessageSquareWarning, ScanText, ShieldCheck, Volume2, ListChecks, User } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NiveshRakshak — Detect before you invest" },
      { name: "description", content: "Screen suspicious investment messages, ads, screenshots and PDFs for scam warning signals — in English, Hindi and Marathi." },
      { property: "og:title", content: "NiveshRakshak — Detect before you invest" },
      { property: "og:description", content: "Explainable investor safety screening for Bharat." },
    ],
  }),
  component: Home,
});

const FLOW = ["Input", "Analyze", "Detect red flags", "Risk assessment", "Explain", "Safe next steps"];
const ARCH = [
  { icon: User, t: "User" },
  { icon: FileSearch, t: "Text / Image / PDF" },
  { icon: ScanText, t: "OCR + document extraction" },
  { icon: MessageSquareWarning, t: "Red-flag engine" },
  { icon: Brain, t: "Content context analysis" },
  { icon: Gauge, t: "Risk scoring (0–100)" },
  { icon: ListChecks, t: "Explainable safety report" },
  { icon: Languages, t: "Regional language + voice" },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-hero text-ink-foreground">
        <div className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 px-4 py-1.5 text-sm text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-saffron" /> Investor safety screening · English · हिंदी · मराठी
            </span>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] md:text-7xl">
              Before you invest,<br /><span className="text-saffron">check what you're being told.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-muted md:text-xl">
              NiveshRakshak uses AI-powered safety screening to help Indian investors identify potential scam signals, misleading claims and suspicious investment content.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/analyze" className="inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-4 text-lg font-bold text-ink transition hover:brightness-110">
                Check a suspicious message <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how" className="rounded-full border border-ink-foreground/25 px-7 py-4 text-lg font-semibold transition hover:bg-ink-foreground/10">How it works</a>
            </div>
          </div>

          <div className="animate-rise [animation-delay:150ms]">
            <div className="relative mx-auto max-w-md rounded-3xl border border-ink-foreground/10 bg-ink-foreground/[0.06] p-6 shadow-float backdrop-blur">
              <div className="flex items-center justify-between text-sm text-ink-muted">
                <span className="font-semibold uppercase tracking-[0.18em]">Investment Message Scan</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 animate-pulse rounded-full bg-risk-critical" />Live</span>
              </div>
              <div className="relative mt-4 overflow-hidden rounded-xl bg-ink/60 p-4 text-[15px] leading-relaxed text-ink-muted">
                <div className="absolute inset-x-0 h-0.5 animate-scan bg-saffron/80 shadow-[0_0_20px_var(--saffron)]" />
                "Get <mark className="rounded bg-risk-critical/25 px-1 text-ink-foreground">guaranteed 30% returns</mark> in 60 days. <mark className="rounded bg-risk-high/25 px-1 text-ink-foreground">SEBI approved</mark>. <mark className="rounded bg-risk-critical/25 px-1 text-ink-foreground">Limited seats</mark>. <mark className="rounded bg-risk-critical/25 px-1 text-ink-foreground">Pay ₹10,000 today</mark>…"
              </div>
              <div className="mt-5 text-sm text-ink-muted">Risk Level</div>
              <div className="font-display text-4xl font-extrabold text-risk-critical">HIGH RISK</div>
              <div className="mt-4 text-sm text-ink-muted">Potential warning signals</div>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {["Guaranteed returns", "Urgency", "Payment request", "Regulatory claim"].map((s) => (
                  <li key={s} className="flex items-center gap-2 rounded-lg bg-ink-foreground/5 px-3 py-2 text-sm"><span className="text-saffron">✓</span>{s}</li>
                ))}
              </ul>
              <Link to="/analyze" search={{ demo: "high" }} className="mt-5 block rounded-xl bg-ink-foreground py-3 text-center font-bold text-ink transition hover:opacity-90">
                View Safety Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20">
        <p className="font-semibold uppercase tracking-[0.2em] text-saffron">How it works</p>
        <h2 className="mt-2 max-w-2xl text-4xl font-extrabold md:text-5xl">Pause. Understand. Verify.</h2>
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {FLOW.map((f, i) => (
            <li key={f} className="rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-1">
              <div className="font-display text-3xl font-extrabold text-saffron">0{i + 1}</div>
              <div className="mt-3 text-lg font-bold">{f}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 md:grid-cols-3">
        {[
          { icon: ListChecks, t: "Explainable, not a black box", d: "Every flag shows the signal, the exact words that triggered it, and why it matters." },
          { icon: Languages, t: "Built for Bharat", d: "Results in English, हिंदी and मराठी, a Simple Mode in plain words, and large readable text." },
          { icon: Volume2, t: "Listen, don't just read", d: "Hear the report read aloud using your phone's built-in voice — no extra app needed." },
        ].map(({ icon: I, t, d }) => (
          <div key={t} className="rounded-3xl border bg-card p-7 shadow-card">
            <I className="h-8 w-8 text-primary" /><h3 className="mt-4 text-2xl font-bold">{t}</h3><p className="mt-2 text-lg text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="font-semibold uppercase tracking-[0.2em] text-saffron">Architecture</p>
          <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">From message to safety report</h2>
          <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ARCH.map(({ icon: I, t }, i) => (
              <li key={t} className="relative rounded-2xl border border-ink-foreground/10 bg-ink-foreground/5 p-5">
                <span className="text-sm text-ink-muted">Step {i + 1}</span>
                <I className="mt-3 h-7 w-7 text-saffron" />
                <div className="mt-3 text-lg font-bold">{t}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 rounded-3xl border bg-card p-8 shadow-card md:grid-cols-[auto_1fr] md:p-12">
          <Lock className="h-12 w-12 text-primary" />
          <div>
            <h2 className="text-3xl font-extrabold md:text-4xl">Privacy by Design</h2>
            <ul className="mt-5 space-y-3 text-lg">
              <li>NiveshRakshak does not ask users for OTPs, passwords, PINs, CVVs or banking credentials.</li>
              <li>Uploaded content is used for screening and should not be unnecessarily retained. In this prototype, text, screenshots and PDFs are read in your browser and are not stored.</li>
              <li>If an external AI service is enabled in future, content would be sent to it for analysis — we will say so clearly.</li>
            </ul>
            <p className="mt-6 rounded-2xl bg-muted p-4 text-muted-foreground">NiveshRakshak provides educational safety screening, not investment advice or a definitive fraud determination. Always independently verify financial claims through appropriate official sources.</p>
          </div>
        </div>
      </section>
    </>
  );
}
