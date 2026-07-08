// Client-side resume text extraction. Runs in the browser only.

export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    return extractPdf(file);
  }
  if (name.endsWith(".docx") || file.type.includes("wordprocessingml")) {
    return extractDocx(file);
  }
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return file.text();
  }
  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or TXT.");
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs: any = await import("pdfjs-dist");
  // Use worker via CDN to keep bundling simple
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ") + "\n\n";
  }
  return out.trim();
}

async function extractDocx(file: File): Promise<string> {
  // @ts-expect-error - browser subpath has no types
  const mammoth: any = await import("mammoth/mammoth.browser.js").catch(() => import("mammoth"));
  const buf = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buf });
  return (result.value as string).trim();
}
