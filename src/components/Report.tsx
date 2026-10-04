import { ArrowDown, CheckCircle2, RotateCcw, Square, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Level, Result } from "@/lib/engine";
import { SPEECH_LANG, useI18n } from "@/lib/i18n";

export const LEVEL_STYLE: Record<Level, { text: string; bg: string; stroke: string }> = {
  low: { text: "text-risk-low", bg: "bg-risk-low", stroke: "stroke-risk-low" },
  moderate: { text: "text-risk-moderate", bg: "bg-risk-moderate", stroke: "stroke-risk-moderate" },
  high: { text: "text-risk-high", bg: "bg-risk-high", stroke: "stroke-risk-high" },
  critical: { text: "text-risk-critical", bg: "bg-risk-critical", stroke: "stroke-risk-critical" },
};

function Gauge({ score, level }: { score: number; level: Level }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1100);
      setV(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);
  const c = 2 * Math.PI * 52;
  return (
    <div className="relative h-40 w-40 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r="52" className="fill-none stroke-ink-foreground/10" strokeWidth="10" />
        <circle cx="60" cy="60" r="52" className={`fill-none ${LEVEL_STYLE[level].stroke}`} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><div className="font-display text-5xl font-bold">{v}</div><div className="text-sm text-ink-muted">/ 100</div></div>
      </div>
    </div>
  );
}

export function Report({ result, onReset, aiNote }: { result: Result; onReset: () => void; aiNote?: string }) {
  const { t, lang, simple, setSimple } = useI18n();
  const [speaking, setSpeaking] = useState(false);
  const { level, flags, score } = result;
  const why = level === "low" ? t.ui.whyLow : level === "moderate" ? t.ui.whyMod : t.ui.whyHigh;

  useEffect(() => () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); }, []);

  const speak = () => {
    const s = window.speechSynthesis;
    if (!s) return;
    if (speaking) { s.cancel(); setSpeaking(false); return; }
    const parts = [
      `${t.levels[level]}. ${t.ui.indicators} ${score} / 100.`,
      ...flags.map((f) => `${t.flags[f.key].title}. ${simple ? t.flags[f.key].simple : t.flags[f.key].explain}`),
      why, t.ui.next + ". " + t.nextSteps.join(" "),
    ];
    const u = new SpeechSynthesisUtterance(parts.join(" "));
    u.lang = SPEECH_LANG[lang];
    const voice = s.getVoices().find((v) => v.lang.startsWith(lang));
    if (voice) u.voice = voice;
    u.rate = 0.92;
    u.onend = () => setSpeaking(false);
    s.cancel(); s.speak(u); setSpeaking(true);
  };

  return (
    <div className="animate-rise space-y-6">
      <div className="overflow-hidden rounded-3xl bg-ink-hero p-6 text-ink-foreground shadow-float md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="font-semibold uppercase tracking-[0.2em] text-ink-muted">{t.ui.report}</span>
          <span className="rounded-full border border-ink-foreground/15 px-3 py-1 text-ink-muted">{aiNote ?? t.ui.local}</span>
        </div>
        <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <Gauge score={score} level={level} />
          <div>
            <div className="text-ink-muted">{t.ui.indicators}</div>
            <div className={`font-display text-4xl font-bold uppercase md:text-5xl ${LEVEL_STYLE[level].text}`}>{t.levels[level]}</div>
            <p className="mt-2 text-lg">{flags.length ? t.ui.detected : t.ui.none}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={speak} className="inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 font-semibold text-ink transition hover:brightness-110">
            {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-5 w-5" />} {speaking ? t.ui.stop : t.ui.listen}
          </button>
          <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-ink-foreground/20 px-5 py-3">
            <input type="checkbox" checked={simple} onChange={(e) => setSimple(e.target.checked)} className="h-5 w-5 accent-[var(--saffron)]" />
            <span className="font-semibold">{t.ui.simple}</span>
          </label>
        </div>
      </div>

      {flags.length > 0 ? (
        <section className="rounded-3xl border bg-card p-6 shadow-card md:p-8">
          <h2 className="text-2xl font-bold">{t.ui.why}</h2>
          <ol className="mt-6 space-y-4">
            {flags.map((f, i) => (
              <li key={f.key} className="animate-rise rounded-2xl border bg-background p-5" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${f.severity === "red" ? "bg-risk-critical" : "bg-risk-high"}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.ui.signal}</span>
                </div>
                <h3 className="mt-1 text-xl font-bold">{t.flags[f.key].title}</h3>
                <ArrowDown className="my-2 h-4 w-4 text-muted-foreground" />
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.ui.evidence}</div>
                <blockquote className="mt-1 rounded-lg bg-accent px-3 py-2 font-medium text-accent-foreground">"{f.evidence}"</blockquote>
                <ArrowDown className="my-2 h-4 w-4 text-muted-foreground" />
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.ui.matters}</div>
                <p className="mt-1 text-lg leading-relaxed">{simple ? t.flags[f.key].simple : t.flags[f.key].explain}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="flex gap-4 rounded-3xl border bg-card p-6 shadow-card md:p-8">
          <CheckCircle2 className="h-8 w-8 shrink-0 text-risk-low" />
          <div><h2 className="text-2xl font-bold">{t.ui.none}</h2><p className="mt-2 text-lg text-muted-foreground">{t.ui.noneBody}</p></div>
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold">{t.ui.whyMatters}</h2>
          <p className="mt-3 text-lg leading-relaxed">{why}</p>
        </section>
        <section className="rounded-3xl border bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold">{t.ui.next}</h2>
          <ol className="mt-3 space-y-3">
            {t.nextSteps.map((s, i) => (
              <li key={i} className="flex gap-3 text-lg"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </section>
      </div>

      <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">{t.ui.disclaimer}</p>
      <button onClick={onReset} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
        <RotateCcw className="h-4 w-4" /> {t.ui.again}
      </button>
    </div>
  );
}
