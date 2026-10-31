const BASE_URL = process.env.COC_API_BASE ?? "https://api.clashofclans.com/v1";

export class CocError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "CocError";
    this.status = status;
  }
}

function friendlyMessage(status: number, reason: string): string {
  switch (status) {
    case 400:
      return "The request was not valid. Check the tag or search text.";
    case 403:
      return `API key rejected${reason ? ` (${reason})` : ""}. Check that the key is correct and that its allowed IP matches your current IP.`;
    case 404:
      return "Nothing found for that tag. Check it and try again.";
    case 429:
      return "Too many requests. Wait a few seconds and retry.";
    case 503:
      return "Clash of Clans is under maintenance right now. Try again later.";
    default:
      return `Clash of Clans API returned an error (${status}).`;
  }
}

export async function cocFetch<T>(path: string, revalidate = 60): Promise<T> {
  const token = process.env.COC_API_TOKEN;
  if (!token) {
    throw new CocError(
      500,
      "COC_API_TOKEN is not set. Copy .env.example to .env.local and add your key.",
    );
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    let reason = "";
    try {
      const body = await res.json();
      reason = body.reason ?? body.message ?? "";
    } catch {
      // body JSON nahi tha, koi baat nahi
    }
    throw new CocError(res.status, friendlyMessage(res.status, reason));
  }

  return (await res.json()) as T;
}
