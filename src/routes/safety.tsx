import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Investor Safety Center — NiveshRakshak" },
      { name: "description", content: "A simple checklist before you invest, and what to do if something feels suspicious." },
      { property: "og:title", content: "Investor Safety Center — NiveshRakshak" },
      { property: "og:description", content: "Before you invest checklist and steps to take if something feels wrong." },
    ],
  }),
  component: Safety,
});

const CHECKS = [
  "Verify who is contacting you",
  "Be cautious of guaranteed returns",
  "Don't act under pressure",
  "Verify regulatory claims independently",
  "Never share OTP/password/PIN/CVV",
  "Don't send money to unknown accounts",
];
const STEPS = [
  ["Pause", "Stop before replying, clicking or paying."],
  ["Don't send money", "No transfers based on the message alone."],
  ["Don't share credentials", "OTP, password, PIN and CVV stay with you."],
  ["Verify independently", "Use official websites and numbers you find yourself."],
  ["Report", "Use appropriate official reporting/grievance channels."],
];

function Safety() {
  const [done, setDone] = useState<boolean[]>(CHECKS.map(() => false));
  const count = done.filter(Boolean).length;
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-semibold uppercase tracking-[0.2em] text-saffron">Safety Center</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">Investor Safety Center</h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border bg-card p-6 shadow-card md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Before you invest</h2>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{count}/{CHECKS.length}</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-risk-low transition-all" style={{ width: `${(count / CHECKS.length) * 100}%` }} /></div>
          <ul className="mt-6 space-y-3">
            {CHECKS.map((c, i) => (
              <li key={c}>
                <button onClick={() => setDone(done.map((d, j) => (j === i ? !d : d)))} aria-pressed={done[i]}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left text-lg transition ${done[i] ? "border-risk-low bg-risk-low/10" : "hover:bg-muted"}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 ${done[i] ? "border-risk-low bg-risk-low text-primary-foreground" : ""}`}>{done[i] && <Check className="h-4 w-4" />}</span>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl bg-ink-hero p-6 text-ink-foreground shadow-float md:p-8">
          <h2 className="text-2xl font-bold">If something feels suspicious</h2>
          <ol className="mt-6 space-y-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron font-display text-lg font-bold text-ink">{i + 1}</span>
                <div><div className="text-lg font-bold">{t}</div><div className="text-ink-muted">{d}</div></div>
              </li>
            ))}
          </ol>
          <Link to="/analyze" className="mt-8 inline-flex rounded-full bg-ink-foreground px-6 py-3 font-bold text-ink">Screen a message</Link>
        </section>
      </div>
    </div>
  );
}
