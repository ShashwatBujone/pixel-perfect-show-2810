import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, ImageIcon, Loader2, Sparkles, Type, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Report } from "@/components/Report";
import { analyze, DEMOS, type Result } from "@/lib/engine";
import { extractImage, extractPdf, MAX_BYTES } from "@/lib/extract";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/analyze")({
  validateSearch: z.object({ demo: z.enum(["high", "moderate", "low"]).optional() }),
  head: () => ({
    meta: [
      { title: "Analyze a message — NiveshRakshak" },
      { name: "description", content: "Paste text or upload a screenshot or PDF to screen investment content for scam warning signals." },
      { property: "og:title", content: "Analyze a suspicious investment message — NiveshRakshak" },
      { property: "og:description", content: "Explainable red-flag screening in English, Hindi and Marathi." },
    ],
  }),
  component: AnalyzePage,
});

type Tab = "text" | "image" | "pdf";
const DEMO_LIST = [
  { key: "high" as const, label: "Demo 1 — High Risk Scam", dot: "bg-risk-critical" },
  { key: "moderate" as const, label: "Demo 2 — Moderate Risk", dot: "bg-risk-moderate" },
  { key: "low" as const, label: "Demo 3 — Low Risk", dot: "bg-risk-low" },
];

function AnalyzePage() {
  const { t } = useI18n();
  const { demo } = Route.useSearch();
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [ocr, setOcr] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [drag, setDrag] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const run = useCallback(async (content: string) => {
    setError(null); setResult(null);
    for (let i = 0; i < 4; i++) { setStep(i); await new Promise((r) => setTimeout(r, 550)); }
    setStep(-1);
    setResult(analyze(content));
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadDemo = (k: keyof typeof DEMOS) => { setTab("text"); setFile(null); setText(DEMOS[k]); void run(DEMOS[k]); };

  useEffect(() => { if (demo) loadDemo(demo); }, [demo]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickFile = (f: File | undefined) => {
    setError(null);
    if (!f) return;
    const okImg = ["image/png", "image/jpeg", "image/jpg"].includes(f.type);
    const okPdf = f.type === "application/pdf";
    if ((tab === "image" && !okImg) || (tab === "pdf" && !okPdf)) {
      setError(tab === "image" ? "Unsupported file. Please choose a PNG or JPG screenshot." : "Unsupported file. Please choose a PDF document.");
      return;
    }
    if (f.size > MAX_BYTES) { setError("This file is larger than 10 MB. Please choose a smaller file."); return; }
    setFile(f);
  };

  const submit = async () => {
    setError(null);
    if (tab === "text") {
      if (text.trim().length < 8) { setError("Please paste a message to check — it looks empty or too short."); return; }
      return run(text);
    }
    if (!file) { setError("Please choose a file first."); return; }
    try {
      setStep(0);
      let extracted = "";
      if (tab === "image") { setOcr(0); extracted = await extractImage(file, setOcr); setOcr(null); }
      else extracted = await extractPdf(file);
      if (extracted.length < 8) {
        setStep(-1);
        setError(tab === "image" ? "We couldn't read text in this image. Try a clearer screenshot, or paste the text instead." : "This PDF has no readable text (it may be scanned or protected). Try a screenshot instead.");
        return;
      }
      setText(extracted);
      await run(extracted);
    } catch {
      setStep(-1); setOcr(null);
      setError(tab === "image" ? "We couldn't process this image. Please try another screenshot." : "This PDF couldn't be opened. It may be damaged or invalid.");
    }
  };

  const busy = step >= 0;
  const tabs: [Tab, string, typeof Type][] = [["text", "Paste Text", Type], ["image", "Upload Screenshot", ImageIcon], ["pdf", "Upload PDF", FileText]];

  return (
    <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:py-16">
      <h1 className="text-4xl font-extrabold md:text-6xl">Check before you act.</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground md:text-xl">Paste or upload investment-related content and we'll screen it for potential warning signals.</p>

      <div className="mt-8 rounded-3xl border-2 border-dashed border-saffron/60 bg-accent/60 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 font-display text-lg font-bold"><Sparkles className="h-5 w-5 text-saffron" /> TRY LIVE DEMO</span>
          {DEMO_LIST.map((d) => (
            <button key={d.key} disabled={busy} onClick={() => loadDemo(d.key)}
              className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 font-semibold shadow-card transition hover:-translate-y-0.5 disabled:opacity-50">
              <span className={`h-2.5 w-2.5 rounded-full ${d.dot}`} />{d.label}
            </button>
          ))}
        </div>
      </div>

      {busy ? (
        <div className="mt-8 rounded-3xl bg-ink-hero p-8 text-ink-foreground shadow-float">
          <div className="relative h-24 overflow-hidden rounded-xl border border-ink-foreground/10 bg-ink-foreground/5 grid-lines">
            <div className="absolute inset-x-0 h-0.5 animate-scan bg-saffron shadow-[0_0_24px_var(--saffron)]" />
          </div>
          <ol className="mt-6 space-y-3">
            {t.steps.map((s, i) => (
              <li key={i} className={`flex items-center gap-3 text-lg transition ${i <= step ? "opacity-100" : "opacity-35"}`}>
                {i < step ? <span className="h-3 w-3 rounded-full bg-risk-low" /> : i === step ? <Loader2 className="h-4 w-4 animate-spin text-saffron" /> : <span className="h-3 w-3 rounded-full border border-ink-muted" />}
                {s}{i === 0 && ocr !== null && <span className="text-ink-muted"> ({Math.round(ocr * 100)}%)</span>}
              </li>
            ))}
          </ol>
        </div>
      ) : result ? (
        <div className="mt-8"><Report result={result} onReset={() => { setResult(null); setText(""); setFile(null); }} /></div>
      ) : (
        <div className="mt-8 rounded-3xl border bg-card p-4 shadow-card md:p-6">
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1" role="tablist">
            {tabs.map(([k, l, Icon]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setFile(null); setError(null); }}
                className={`flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-sm font-semibold transition sm:flex-row sm:justify-center sm:text-base ${tab === k ? "bg-card shadow-card" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />{l}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "text" ? (
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
                placeholder="Paste a suspicious investment message, advertisement, email, or financial claim here..."
                className="w-full resize-y rounded-2xl border bg-background p-5 text-lg leading-relaxed outline-none focus:ring-4 focus:ring-ring/30" />
            ) : (
              <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
                className={`flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition ${drag ? "scale-[1.01] border-saffron bg-accent" : "bg-background hover:border-saffron"}`}>
                <input type="file" className="sr-only" accept={tab === "image" ? "image/png,image/jpeg" : "application/pdf"} onChange={(e) => pickFile(e.target.files?.[0])} />
                <UploadCloud className={`h-12 w-12 text-saffron transition ${drag ? "-translate-y-1" : ""}`} />
                <span className="text-lg font-semibold">{tab === "image" ? "Drop a screenshot here or browse files" : "Drop a PDF here or browse files"}</span>
                <span className="text-sm text-muted-foreground">{tab === "image" ? "PNG, JPG or JPEG · up to 10 MB · read on your device" : "PDF · up to 10 MB · read on your device"}</span>
              </label>
            )}
            {file && (
              <div className="mt-3 flex animate-rise items-center justify-between rounded-xl bg-muted px-4 py-3">
                <span className="truncate font-medium">{file.name} <span className="text-muted-foreground">· {(file.size / 1024).toFixed(0)} KB</span></span>
                <button onClick={() => setFile(null)} aria-label="Remove file"><X className="h-5 w-5" /></button>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" className="mt-4 flex animate-rise items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />{error}
            </div>
          )}

          <button onClick={submit} className="mt-5 w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground transition hover:opacity-90 sm:w-auto sm:px-10">
            Analyze for Risk
          </button>
          <p className="mt-4 text-sm text-muted-foreground">We will never ask for your OTP, password, PIN, CVV or banking credentials. Screening runs in your browser.</p>
        </div>
      )}
    </div>
  );
}
