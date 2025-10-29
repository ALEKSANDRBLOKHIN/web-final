const BASE = import.meta.env.VITE_API_BASE_URL || "";


const RETRY_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  retries = 3,
  backoffMs = 400
): Promise<T> {
  let lastErr: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
        ...init,
      });


      if (!res.ok && RETRY_STATUSES.has(res.status) && attempt < retries) {
        await sleep(backoffMs * (attempt + 1)); 
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
      }

      return res.status === 204
        ? (undefined as T)
        : await res.json();
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        await sleep(backoffMs * (attempt + 1));
        continue;
      }
      throw e;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}
