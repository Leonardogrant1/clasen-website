import { NextRequest, NextResponse } from "next/server";
import { buildAuthHeader, parseOAuthBody } from "@/lib/oauth1";
import { getPostHogClient } from "@/lib/posthog-server";

const CONSUMER_KEY = process.env.IS24_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.IS24_CONSUMER_SECRET!;

const REQUEST_TOKEN_URL =
  "https://rest.immobilienscout24.de/restapi/security/oauth/request_token";
const ACCESS_CONFIRMATION_URL =
  "https://rest.immobilienscout24.de/restapi/security/oauth/confirm_access";

/**
 * Step 1 — redirect the user to IS24 authorization.
 *
 * GET /api/oauth/init
 *   → fetches an unauthorized request token from IS24
 *   → stores it in httpOnly cookies
 *   → redirects the browser to the IS24 consent screen
 */
export async function GET(request: NextRequest) {
  const callbackUrl = new URL("/api/oauth/callback", request.url).toString();

  const authHeader = buildAuthHeader(
    "POST",
    REQUEST_TOKEN_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    "",
    "",
    { oauth_callback: callbackUrl }
  );

  const res = await fetch(REQUEST_TOKEN_URL, {
    method: "POST",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to obtain request token", detail: text },
      { status: 502 }
    );
  }

  const params = parseOAuthBody(await res.text());

  const redirectUrl = `${ACCESS_CONFIRMATION_URL}?oauth_token=${encodeURIComponent(params.oauth_token)}`;
  const response = NextResponse.redirect(redirectUrl);

  // Persist the request token for the callback
  const cookieOpts = { httpOnly: true, sameSite: "lax", path: "/" } as const;
  response.cookies.set("is24_request_token", params.oauth_token, cookieOpts);
  response.cookies.set("is24_request_token_secret", params.oauth_token_secret, cookieOpts);

  const posthog = getPostHogClient();
  posthog.capture({
    distinctId: "server",
    event: "oauth_authorization_started",
    properties: { provider: "is24" },
  });
  await posthog.flush();

  return response;
}
