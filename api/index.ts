/**
 * Vercel Serverless Function — entry point.
 *
 * Reuse Express app dari server.ts (yang diexpose via `export { app }`).
 * Vercel Node runtime bisa langsung handle Express app sebagai (req, res) handler
 * tanpa perlu serverless-http wrapper (Express app compatible dengan Node http.RequestListener signature).
 *
 * Untuk local/Docker/Cloud Run, tetap pakai `npm run dev` yang eksekusi server.ts
 * secara langsung (Express monolith mode). server.ts sudah di-guard supaya tidak
 * memicu app.listen() ketika VERCEL env var terset.
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { app } from '../server.js';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return (app as any)(req, res);
}
