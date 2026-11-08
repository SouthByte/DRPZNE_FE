import type { APIRoute } from 'astro';
import { CMS_URL } from 'astro:env/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Newsletter sign-up: stores the email in the CMS "Subscribers" collection.
export const POST: APIRoute = async ({ request }) => {
  let body: { email?: unknown; company?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  // Honeypot filled in: pretend it worked so bots don't retry.
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ ok: true }, 200);

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(email) || email.length > 254) return json({ error: 'Enter a valid email' }, 400);

  const res = await fetch(`${CMS_URL.replace(/\/$/, '')}/api/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, source: 'footer' }),
  });

  // Already subscribed shows up as a unique-email validation error; treat it as success.
  if (res.ok || res.status === 400) return json({ ok: true }, 200);
  console.error('[subscribe] CMS returned', res.status);
  return json({ error: 'Could not subscribe right now' }, 502);
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
