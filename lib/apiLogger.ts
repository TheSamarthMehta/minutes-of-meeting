import type { NextRequest } from "next/server";

const SENSITIVE_KEYS = [
  "password",
  "token",
  "authorization",
  "cookie",
  "privatekey",
  "apikey",
  "secret",
  "smtp_pass",
];

function maskIfSensitive(key: string, value: unknown): unknown {
  const lower = key.toLowerCase();
  if (SENSITIVE_KEYS.some((k) => lower.includes(k))) {
    return "***";
  }
  return value;
}

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = sanitize(maskIfSensitive(key, val));
    }
    return result;
  }

  return value;
}

export function logApiIncoming(
  label: string,
  request: NextRequest,
  payload?: unknown
): void {
  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams.entries());
  const user = {
    id: request.headers.get("x-user-id") ?? null,
    email: request.headers.get("x-user-email") ?? null,
    role: request.headers.get("x-user-role") ?? null,
  };

  console.log("[API IN]", {
    label,
    method: request.method,
    path: url.pathname,
    query,
    user: sanitize(user),
    payload: sanitize(payload),
    at: new Date().toISOString(),
  });
}

export function logApiOutgoing(
  label: string,
  status: number,
  payload: unknown,
  startedAt: number
): void {
  console.log("[API OUT]", {
    label,
    status,
    durationMs: Date.now() - startedAt,
    payload: sanitize(payload),
    at: new Date().toISOString(),
  });
}

export function logApiError(
  label: string,
  error: unknown,
  startedAt: number
): void {
  const message = error instanceof Error ? error.message : String(error);
  console.error("[API ERR]", {
    label,
    durationMs: Date.now() - startedAt,
    error: message,
    at: new Date().toISOString(),
  });
}
