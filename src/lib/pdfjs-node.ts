'use server';

// A biblioteca pdfjs-dist não é totalmente compatível com o ambiente do servidor Next.js por padrão.
// Precisamos fazer alguns ajustes para que funcione corretamente.
// Veja: https://github.com/mozilla/pdf.js/issues/17627

import * as pdfjsLib from 'pdfjs-dist';
import {DOMMatrix } from 'canvas';

// Fornece um polyfill para DOMMatrix, que não existe no ambiente Node.js.
if (typeof (global as any).DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = DOMMatrix;
}

// Desativa o uso de workers, que causam o erro "Promise.withResolvers is not a function".
pdfjsLib.GlobalWorkerOptions.workerSrc = false;

export { pdfjsLib };
