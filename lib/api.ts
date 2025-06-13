// A simple API client using the NEXT_PUBLIC_API_URL environment variable
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables.");
}

export async function fetcher<T = any>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, init);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error (${res.status}): ${text}`);
  }

  return res.json();
}
