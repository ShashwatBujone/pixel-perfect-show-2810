import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgePercent, Building2, Hourglass, KeyRound, MonitorSmartphone, Share2, UserX, Wallet } from "lucide-react";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Common investment scam signals — NiveshRakshak" },
      { name: "description", content: "Learn the eight most common investment scam signals and what to do about each." },
      { property: "og:title", content: "Common Investment Scam Signals — NiveshRakshak" },
      { property: "og:description", content: "What it looks like, why it is risky, and what you can do." },
    ],
  }),
  component: Learn,
});

const CARDS = [
  { i: BadgePercent, t: "Guaranteed Returns", look: "“Assured 3% every month”, “risk-free profit”, “double your money”.", risk: "All market investments carry risk. Fixed promises hide that.", do: "Treat any guarantee as a reason to verify, not to invest." },
  { i: Hourglass, t: "Urgency & Pressure", look: "“Only 5 seats left”, “offer ends tonight”, “act now”.", risk: "Pressure stops you from checking facts or asking family.", do: "Pause. A genuine opportunity can wait a day." },
  { i: Building2, t: "Fake Regulatory Approval", look: "“SEBI approved scheme”, “RBI certified”, official-looking logos.", risk: "Regulator names are borrowed to look trustworthy.", do: "Check registration yourself on the regulator's official website." },
  { i: Wallet, t: "Upfront Fees", look: "“Pay ₹5,000 activation fee”, “registration charge to unlock profits”.", risk: "Money sent to unknown accounts is very hard to recover.", do: "Don't pay to “unlock” returns. Verify the receiver first." },
  { i: UserX, t: "Impersonation", look: "Someone claims to be a known broker, celebrity, bank or official.", risk: "Familiar names lower your guard.", do: "Contact the organisation through its official number or website." },
  { i: KeyRound, t: "OTP / Password Requests", look: "“Share the OTP to verify your account”, “tell us your PIN”.", risk: "These give direct access to your money and accounts.", do: "Never share OTP, password, PIN or CVV with anyone." },
  { i: MonitorSmartphone, t: "Fake Investment Platforms", look: "Apps or sites showing huge profits but blocking withdrawals.", risk: "Displayed balances can be fake; deposits may be lost.", do: "Use only platforms of registered intermediaries you have verified." },
  { i: Share2, t: "Social Media Investment Scams", look: "WhatsApp/Telegram “tip” groups, paid influencer promotions.", risk: "Group hype and fake screenshots create false trust.", do: "Don't act on tips from groups. Verify the advisor's registration." },
];

function Learn() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-14">
      <p className="font-semibold uppercase tracking-[0.2em] text-saffron">Learn</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">Common Investment Scam Signals</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">Short, plain explanations. Learn to spot the pattern once — recognise it everywhere.</p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map(({ i: I, t, look, risk, do: d }, n) => (
          <article key={t} className="animate-rise flex flex-col rounded-3xl border bg-card p-6 shadow-card transition hover:-translate-y-1" style={{ animationDelay: `${n * 50}ms` }}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground"><I className="h-6 w-6" /></span>
            <h2 className="mt-4 text-xl font-bold">{t}</h2>
            <dl className="mt-3 space-y-3">
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What it looks like</dt><dd className="mt-1">{look}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Why it is risky</dt><dd className="mt-1">{risk}</dd></div>
              <div><dt className="text-xs font-bold uppercase tracking-wider text-risk-low">What you can do</dt><dd className="mt-1 font-semibold">{d}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <Link to="/analyze" className="mt-12 inline-flex rounded-full bg-primary px-7 py-4 text-lg font-bold text-primary-foreground">Check a message now</Link>
    </div>
  );
}
