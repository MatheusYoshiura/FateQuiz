import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

if (!process.env.GEMINI_API_KEY) {
  throw new GenkitError(
    'A chave de API do Gemini não foi encontrada. Defina a variável de ambiente GEMINI_API_KEY.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});