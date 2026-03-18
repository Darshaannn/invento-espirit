"use client";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clinical PDF Export Utility v10
 * "Deep Sanitization" Mode - Recursively flattens all colors to HEX to prevent LAB/OKLCH crashes.
 */
export const exportToPDF = async (elementId: string, filename: string) => {
    console.log("[Clinical Export] Starting v10 Deep Sanitization...");

    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`[Clinical Export] Target ${elementId} missing.`);
        return false;
    }

    const feedback = document.createElement('div');
    feedback.id = 'export-feedback-overlay';
    feedback.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.95);
        color: white; z-index: 100000; display: flex; flex-direction: column;
        align-items: center; justify-content: center; font-family: sans-serif;
    `;
    feedback.innerHTML = `
        <div style="width: 50px; height: 50px; border: 3px solid #8B0000; border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
        <p style="margin-top: 30px; font-weight: 900; letter-spacing: 0.3em; font-size: 14px;">GENERATING CLINICAL REPORT</p>
        <p style="margin-top: 10px; font-size: 10px; opacity: 0.5;">CONVERTING COLOR VECTORS (V10)</p>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(feedback);

    try {
        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#F5F1EE',
            logging: false,
            onclone: (clonedDoc) => {
                // 1. Recursive Color Flattening
                const allElements = clonedDoc.getElementsByTagName("*");
                for (let i = 0; i < allElements.length; i++) {
                    const el = allElements[i] as HTMLElement;
                    const style = window.getComputedStyle(el);

                    // Detect unsupported color formats in computed style
                    const fixColor = (colorStr: string) => {
                        if (colorStr.includes('lab') || colorStr.includes('oklch')) {
                            // High-performance fallback: Just use a generic gray or the primary burgundy
                            if (colorStr.includes('8B0000')) return '#8B0000';
                            return '#1A1A1A';
                        }
                        return colorStr;
                    };

                    if (el.style) {
                        el.style.color = fixColor(style.color);
                        el.style.backgroundColor = fixColor(style.backgroundColor);
                        el.style.borderColor = fixColor(style.borderColor);
                        el.style.animation = 'none';
                        el.style.transition = 'none';
                        el.style.transform = 'none';
                        el.style.boxShadow = 'none';
                    }
                }

                // 2. Head-level sanitization
                const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                styles.forEach(s => {
                    if (s.textContent?.includes('lab(') || s.textContent?.includes('oklch(')) {
                        s.remove();
                    }
                });

                // 3. Layout Lock
                const target = clonedDoc.getElementById(elementId);
                if (target) {
                    target.style.width = '1200px';
                    target.style.padding = '60px';
                    target.style.background = '#F5F1EE';
                    target.querySelectorAll('button, input, nav').forEach(item => ((item as HTMLElement).style.display = 'none'));
                }
            }
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // AUTO-SAVE HANDSHAKE
        pdf.save(`${filename}.pdf`);

        console.log("[Clinical Export] Archive dispatched.");
        if (document.body.contains(feedback)) document.body.removeChild(feedback);
        return true;

    } catch (error) {
        console.error('[Clinical Export] Deep sanitization failure:', error);
        if (document.body.contains(feedback)) document.body.removeChild(feedback);

        // AUTOMATIC FALLBACK: Trigger Print Dialog immediately
        console.log("[Clinical Export] Triggering native print failsafe...");
        window.print();
        return false;
    }
};
