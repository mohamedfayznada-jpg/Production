// ======================================================
// MES CORE V28 Enterprise - Export
// ======================================================

import analytics from "./analytics.js";
import production from "./production.js";
import quality from "./quality.js";
import waste from "./waste.js";
import tpm from "./tpm.js";

class ExportManager {
    download(content, filename, type) {
        const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const a = document.createElement("a");
        a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    }
    async json(filename = "report.json") { this.download(JSON.stringify(analytics.exportDashboard(), null, 2), filename, "application/json"); }
    async text(filename = "report.txt") { this.download(analytics.toJSON(), filename, "text/plain"); }
    async csv(filename = "production.csv") {
        const data = production.all(); if (!data.length) return;
        const headers = Object.keys(data[0]);
        const escape = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
        this.download([headers.join(","), ...data.map(row => headers.map(key => escape(row[key])).join(","))].join("\n"), filename, "text/csv;charset=utf-8");
    }
    async html(filename = "report.html") {
        const pre = document.createElement("pre"); pre.textContent = JSON.stringify(analytics.exportDashboard(), null, 2);
        const html = `<!doctype html><html><head><meta charset="UTF-8"><title>MES CORE Report</title></head><body><h2>MES CORE V28 Report</h2>${pre.outerHTML}</body></html>`;
        this.download(html, filename, "text/html;charset=utf-8");
    }
    async excel(filename = "MES_CORE.xlsx") {
        if (typeof XLSX === "undefined") throw new Error("XLSX library is not loaded");
        const workbook = XLSX.utils.book_new();
        const sheets = { Production: production.all(), Quality: quality.all(), Waste: waste.all(), TPM: tpm.all() };
        Object.entries(sheets).forEach(([name, rows]) => XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), name));
        XLSX.writeFile(workbook, filename);
    }
    async pdf(filename = "MES_CORE.pdf") {
        if (typeof jspdf === "undefined") throw new Error("jsPDF library is not loaded");
        const doc = new jspdf.jsPDF(); doc.setFontSize(18); doc.text("MES CORE V28 Report", 15, 20); doc.setFontSize(9);
        const lines = JSON.stringify(analytics.exportDashboard(), null, 2).match(/.{1,90}/g) || [];
        lines.slice(0, 80).forEach((line, index) => doc.text(line, 15, 30 + index * 4)); doc.save(filename);
    }
    image(canvasId, filename = "chart.png") { const canvas = document.getElementById(canvasId); if (!canvas) return; const link = document.createElement("a"); link.href = canvas.toDataURL("image/png"); link.download = filename; link.click(); }
    print() { window.print(); }
    async copyJSON() { await navigator.clipboard.writeText(analytics.toJSON()); }
    async copyText(text) { await navigator.clipboard.writeText(text); }
    downloadBlob(blob, filename) { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); }
    downloadURL(url, filename) { const link = document.createElement("a"); link.href = url; link.download = filename; link.target = "_blank"; link.click(); }
    async exportAll() { await this.json("dashboard.json"); await this.csv("production.csv"); await this.html("report.html"); }
    async share(filename, content, type = "text/plain") { const file = new File([content], filename, { type }); if (navigator.share) await navigator.share({ files: [file] }); }
    destroy() { return true; }
}

const exporter = new ExportManager();
export default exporter;
export { exporter, ExportManager };
