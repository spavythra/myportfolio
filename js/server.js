// Minimal server proxy for IP -> organization lookup (for add/personalized-greeting)
//
// Usage:
// 1. npm install express node-fetch
// 2. NODE_ENV=production node server.js
//
// Notes:
// - This proxies enrichment requests to ipapi.co server-side to avoid exposing the third-party call from browsers
// - Cache is in-memory (Map) with TTL to reduce rate-limit usage. For production use a persistent cache (Redis).
// - Do NOT log or persist raw IPs without legal review. This example only keeps a transient cache mapping IP -> org.
// - Ensure you serve this over HTTPS in production and add any rate limiting / auth as needed.

const express = require('express');
const fetch = require('node-fetch'); // If using Node 18+, you can use global fetch instead.
const app = express();

app.set('trust proxy', true); // if behind a proxy (Heroku, Vercel, nginx), use X-Forwarded-For

// Simple in-memory cache: ip -> { org, ts }
const cache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getClientIp(req) {
  // Try X-Forwarded-For first, then fallback to socket address.
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    // x-forwarded-for may be a comma-separated list; take the first public-looking one
    return xff.split(',')[0].trim();
  }
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : null;
}

async function lookupOrgForIp(ip) {
  if (!ip) return null;

  // Check cache
  const cached = cache.get(ip);
  const now = Date.now();
  if (cached && (now - cached.ts) < CACHE_TTL_MS) {
    return cached.org || null;
  }

  try {
    // Query ipapi.co server-side; this avoids exposing client-side requests.
    // Use the JSON endpoint for best compatibility.
    const url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
    const res = await fetch(url, { method: 'GET', timeout: 5000 });
    if (!res.ok) {
      // fallback: try generic json endpoint without ip
      const fallback = await fetch('https://ipapi.co/json/');
      if (!fallback.ok) {
        cache.set(ip, { org: null, ts: now });
        return null;
      }
      const fj = await fallback.json();
      const forg = fj.org || fj.organization || null;
      cache.set(ip, { org: forg, ts: now });
      return forg;
    }
    const j = await res.json();
    const org = j.org || j.organization || null;
    cache.set(ip, { org: org, ts: now });
    return org;
  } catch (err) {
    // on error, cache null for a short time to avoid repeated failing lookups
    cache.set(ip, { org: null, ts: now });
    return null;
  }
}

// Lightweight endpoint: returns { org: "...", source: "ipapi.co" }
app.get('/whoami', async (req, res) => {
  try {
    const ip = getClientIp(req);
    // IMPORTANT: we do not store the IP or return it. We only return the inferred org.
    const org = await lookupOrgForIp(ip);
    res.set('Cache-Control', 'public, max-age=300'); // instruct CDN/browser proxies to cache for a short time
    return res.json({ org: org || null });
  } catch (err) {
    return res.status(500).json({ org: null });
  }
});

// Optional health endpoint
app.get('/_health', (req, res) => res.send('OK'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // Do not log client IPs here in production
  // Keep logs minimal to reduce PII exposure
  console.log(`whoami proxy listening on ${port}`);
});