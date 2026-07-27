// ======================================================
// MES CORE V27 Enterprise
// File: /js/export.js
// Part 1 / 5
// ======================================================

import analytics from "./analytics.js";

class ExportManager {

    async json(filename = "report.json") {

        const data = analytics.exportDashboard();

        this.download(

            JSON.stringify(data, null, 2),

            filename,

            "application/json"

        );

    }

    async text(filename = "report.txt") {

        this.download(

            analytics.toJSON(),

            filename,

            "text/plain"

        );

    }

    download(content, filename, type) {

        const blob = new Blob(

            [content],

            {

                type

            }

        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = filename;

        document.body.appendChild(a);

        a.click();

        a.remove();

        URL.revokeObjectURL(url);

    }

}

const exporter = new ExportManager();

export default exporter;

export {

    ExportManager

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/export.js
// Part 2 / 5
// ======================================================

ExportManager.prototype.csv = async function (

    filename = "report.csv"

) {

    const data = analytics.production();

    if (!data.length) return;

    const headers = Object.keys(data[0]);

    const rows = [

        headers.join(","),

        ...data.map(row =>

            headers

                .map(key => `"${row[key] ?? ""}"`)

                .join(",")

        )

    ];

    this.download(

        rows.join("\n"),

        filename,

        "text/csv"

    );

};

ExportManager.prototype.html = async function (

    filename = "report.html"

) {

    const dashboard = analytics.exportDashboard();

    const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>MES Report</title>
<style>
body{
font-family:Arial;
padding:30px;
}
pre{
background:#f4f4f4;
padding:20px;
overflow:auto;
}
</style>
</head>
<body>
<h2>MES CORE Report</h2>
<pre>${JSON.stringify(dashboard, null, 2)}</pre>
</body>
</html>
`;

    this.download(

        html,

        filename,

        "text/html"

    );

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/export.js
// Part 3 / 5
// ======================================================

ExportManager.prototype.excel = async function (

    filename = "report.xlsx"

) {

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(

        analytics.production()

    );

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Production"

    );

    XLSX.writeFile(

        workbook,

        filename

    );

};

ExportManager.prototype.pdf = async function (

    filename = "report.pdf"

) {

    const doc = new jspdf.jsPDF();

    doc.setFontSize(18);

    doc.text(

        "MES CORE Report",

        15,

        20

    );

    doc.setFontSize(10);

    doc.text(

        analytics.toJSON(),

        15,

        35

    );

    doc.save(

        filename

    );

};

ExportManager.prototype.image = function (

    canvasId,

    filename = "chart.png"

) {

    const canvas = document.getElementById(

        canvasId

    );

    if (!canvas) return;

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");

    link.download = filename;

    link.click();

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/export.js
// Part 4 / 5
// ======================================================

ExportManager.prototype.print = function () {

    window.print();

};

ExportManager.prototype.copyJSON = async function () {

    await navigator.clipboard.writeText(

        analytics.toJSON()

    );

};

ExportManager.prototype.copyText = async function (

    text

) {

    await navigator.clipboard.writeText(

        text

    );

};

ExportManager.prototype.downloadBlob = function (

    blob,

    filename

) {

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);

};

ExportManager.prototype.downloadURL = function (

    url,

    filename

) {

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    link.target = "_blank";

    link.click();

};
// ======================================================
// MES CORE V27 Enterprise
// File: /js/export.js
// Part 5 / 5
// ======================================================

ExportManager.prototype.exportAll = async function () {

    await this.json("dashboard.json");

    await this.csv("production.csv");

    await this.html("report.html");

};

ExportManager.prototype.share = async function (

    filename,

    content,

    type = "text/plain"

) {

    const file = new File(

        [content],

        filename,

        {

            type

        }

    );

    if (navigator.share) {

        await navigator.share({

            files: [file]

        });

    }

};

ExportManager.prototype.destroy = function () {

    return true;

};

export default exporter;

export {

    exporter,

    ExportManager

};
