import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import * as pdfjsLib from "pdfjs-dist";

// ✅ Corrige "DOMMatrix is not defined"
if (typeof (global as any).DOMMatrix === "undefined") {
    (global as any).DOMMatrix = class DOMMatrix {};
}

// ⚠️ No Node, o worker não é necessário. Mas vamos definir o worker apenas se existir
// A importação do worker é diferente agora
const workerPath = path.join(process.cwd(), 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.mjs');

if (fs.existsSync(workerPath)) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();
    console.log("✅ pdfjs worker definido em:", pdfjsLib.GlobalWorkerOptions.workerSrc);
} else {
    console.warn("⚠️ pdfjs worker não encontrado. Continuando sem worker.");
}

export { pdfjsLib };
