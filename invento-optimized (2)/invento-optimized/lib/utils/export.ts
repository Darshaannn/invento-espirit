// lib/utils/export.ts
// PDF export using html2canvas + jsPDF.
// Lazy-imported so these heavy libs (~400kb combined) don't bloat initial bundle.

export async function exportReportToPDF(
  elementId: string,
  filename = `invento-report-${new Date().toISOString().split("T")[0]}.pdf`
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`#${elementId} not found in DOM`);

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const canvas = await html2canvas(element, {
    scale:           2,
    useCORS:         true,
    allowTaint:      false,
    backgroundColor: "#F5F1EE",
    logging:         false,
    windowWidth:     element.scrollWidth,
    windowHeight:    element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf     = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW   = pdf.internal.pageSize.getWidth();
  const pageH   = pdf.internal.pageSize.getHeight();
  const margin  = 10;
  const imgW    = pageW - margin * 2;
  const imgH    = (canvas.height * imgW) / canvas.width;

  let heightLeft = imgH;
  let position   = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgW, imgH);
  heightLeft -= pageH - margin * 2;

  while (heightLeft > 0) {
    pdf.addPage();
    position   = -(imgH - heightLeft) - margin;
    pdf.addImage(imgData, "PNG", margin, position, imgW, imgH);
    heightLeft -= pageH - margin * 2;
  }

  pdf.save(filename);
}
