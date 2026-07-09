/**
 * Vercel Serverless Function — entry point untuk deploy Vercel.
 *
 * File ini membungkus Express app dari server.ts sebagai serverless handler
 * menggunakan serverless-http. Untuk deploy Vercel:
 *   - Vercel routing `vercel.json` forward semua /api/* dan / ke handler ini
 *   - server.ts app instance di-reuse (single source of truth untuk routes)
 *   - startServer() dari server.ts tidak dipanggil di serverless environment
 *
 * Untuk local dev / Docker / Cloud Run, tetap pakai `npm run dev`
 * yang eksekusi server.ts langsung (Express monolith mode).
 */

import serverless from 'serverless-http';
import { app } from '../server';

// Serve frontend static files (dist/) juga lewat handler ini di production Vercel
import path from 'path';
import express from 'express';

const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback — kalau tidak match /api/*, serve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

export default serverless(app);
