import { NextRequest, NextResponse } from "next/server";
import { buildAuthHeader, parseOAuthBody } from "@/lib/oauth1";
import { getPostHogClient } from "@/lib/posthog-server";

const CONSUMER_KEY = process.env.IS24_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.IS24_CONSUMER_SECRET!;

const ACCESS_TOKEN_URL =
  "https://rest.immobilienscout24.de/restapi/security/oauth/access_token";

/**
 * Step 2 — IS24 redirects here after the user grants/denies access.
 *
 * Query params from IS24:
 *   state          "authorized" | "rejected" | error string
 *   oauth_token    the request token echoed back
 *   oauth_verifier the PIN to exchange for an access token
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const oauthToken = searchParams.get("oauth_token");
  const verifier = searchParams.get("oauth_verifier");

  // User denied access
  if (state === "rejected") {
    const posthog = getPostHogClient();
    posthog.capture({ distinctId: "server", event: "oauth_authorization_rejected", properties: { provider: "is24" } });
    await posthog.flush();
    return NextResponse.json(
      { error: "The user rejected authorization." },
      { status: 401 }
    );
  }

  if (state !== "authorized") {
    return NextResponse.json(
      { error: `Unexpected authorization state: ${state}` },
      { status: 500 }
    );
  }

  if (!oauthToken || !verifier) {
    return NextResponse.json(
      { error: "Missing oauth_token or oauth_verifier." },
      { status: 400 }
    );
  }

  // Validate that the returned token matches what we stored
  const storedToken = request.cookies.get("is24_request_token")?.value;
  const storedSecret = request.cookies.get("is24_request_token_secret")?.value ?? "";

  if (!storedToken || storedToken !== oauthToken) {
    return NextResponse.json(
      { error: "Request token mismatch — possible CSRF." },
      { status: 400 }
    );
  }

  // Exchange request token + verifier for access token
  const authHeader = buildAuthHeader(
    "POST",
    ACCESS_TOKEN_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    storedToken,
    storedSecret,
    { oauth_verifier: verifier }
  );

  const res = await fetch(ACCESS_TOKEN_URL, {
    method: "POST",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Failed to obtain access token", detail: text },
      { status: 502 }
    );
  }

  const params = parseOAuthBody(await res.text());

  // Store the access token and clean up the temporary request token
  const response = NextResponse.redirect(new URL("/", request.url));
  const cookieOpts = { httpOnly: true, sameSite: "lax", path: "/" } as const;

  response.cookies.set("is24_access_token", params.oauth_token, cookieOpts);
  response.cookies.set("is24_access_token_secret", params.oauth_token_secret, cookieOpts);
  response.cookies.delete("is24_request_token");
  response.cookies.delete("is24_request_token_secret");

  const posthog = getPostHogClient();
  posthog.capture({ distinctId: "server", event: "oauth_authorization_completed", properties: { provider: "is24" } });
  await posthog.flush();

  return response;
}
