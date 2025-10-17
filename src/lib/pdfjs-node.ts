import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

// ✅ Corrige "DOMMatrix is not defined" no ambiente Node
if (typeof (global as any).DOMMatrix === "undefined") {
    (global as any).DOMMatrix = class DOMMatrix {};
}

// ✅ Importa pdfjs-dist compatível com Node
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// ✅ Caminho absoluto até o worker no diretório public
const workerPath = path.join(process.cwd(), "public", "pdf.worker.min.mjs");

// ⚠️ Verifica se o arquivo realmente existe
if (!fs.existsSync(workerPath)) {
    throw new Error(`❌ Worker não encontrado em: ${workerPath}`);
}

// ✅ Converte para URL válida (necessário no Windows)
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();

// (opcional) debug
console.log("✅ pdfjs worker definido em:", pdfjsLib.GlobalWorkerOptions.workerSrc);

// ✅ Exporta a instância configurada
export { pdfjsLib };
