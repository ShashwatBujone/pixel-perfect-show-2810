// Browser-only text extraction. Files are processed on the device; nothing is uploaded.
export const MAX_BYTES = 10 * 1024 * 1024;

export async function extractImage(file: File, onProgress?: (p: number) => void): Promise<string> {
  const { default: Tesseract } = await import("tesseract.js");
  const res = await Tesseract.recognize(file, "eng+hin", {
    logger: (m: { status: string; progress: number }) => { if (m.status === "recognizing text") onProgress?.(m.progress); },
  });
  return res.data.text.trim();
}

export async function extractPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= Math.min(doc.numPages, 20); i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => ("str" in it ? it.str : "")).join(" "));
  }
  return pages.join("\n").trim();
}
