// lib/utils/export.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. Dynamic import of jsPDF + html2canvas — these are ~400kb combined.
//    Only loaded when user clicks "Download PDF", not on page load.
// 2. scale: 2 for retina-quality output while keeping file size reasonable.
// 3. Multi-page support — content taller than A4 is split across pages.
// 4. Returns a promise so callers can show loading states.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportOptions {
  elementId: string;
  filename?: string;
  darkBg?: boolean; // set true if element has dark background
}

export async function exportToPDF({
  elementId,
  filename = `invento-report-${new Date().toISOString().split("T")[0]}.pdf`,
  darkBg = false,
}: ExportOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  // Dynamic import — loaded only when this function is called
  // html-to-image is used instead of html2canvas to properly support Tailwind v4 oklab/oklch colors
  const [{ default: jsPDF }, { toPng }] = await Promise.all([
    import("jspdf"),
    import("html-to-image"),
  ]);

  const imgData = await toPng(element, {
    pixelRatio: 2,
    backgroundColor: darkBg ? "#1A1A1A" : "#F5F1EE",
    skipAutoScale: true,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10; // mm
  const imgW = pageW - margin * 2;

  // Calculate proportion based on DOM element size
  const imgH = (element.scrollHeight * imgW) / element.scrollWidth;

  let heightLeft = imgH;
  let yPosition = margin;
  let isFirstPage = true;

  while (heightLeft > 0) {
    if (!isFirstPage) pdf.addPage();

    pdf.addImage(imgData, "PNG", margin, yPosition, imgW, imgH);
    heightLeft -= pageH - margin * 2;
    yPosition = -(pageH - margin * 2 - margin) + (imgH - heightLeft);
    isFirstPage = false;
  }

  pdf.save(filename);
}

/**
 * Simplified wrapper for the clinical report page
 */
export async function exportReportToPDF(elementId: string, filename: string): Promise<void> {
  return exportToPDF({ elementId, filename, darkBg: false });
}
