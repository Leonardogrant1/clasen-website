import crypto from "crypto";

function encode(s: string) {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) =>
    "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

/**
 * Builds an OAuth 1.0a Authorization header with HMAC-SHA1 signature.
 *
 * @param method       HTTP method (GET, POST, …)
 * @param url          Full request URL, no query string
 * @param consumerKey  OAuth consumer key
 * @param consumerSecret OAuth consumer secret
 * @param token        OAuth token (empty string for request-token step)
 * @param tokenSecret  OAuth token secret (empty string for request-token step)
 * @param extraParams  Additional OAuth params to include in signature (e.g. oauth_callback, oauth_verifier)
 */
export function buildAuthHeader(
  method: string,
  url: string,
  consumerKey: string,
  consumerSecret: string,
  token = "",
  tokenSecret = "",
  extraParams: Record<string, string> = {}
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
    ...extraParams,
  };
  if (token) oauthParams.oauth_token = token;

  // Signature base string: METHOD&url&params (all percent-encoded, params sorted)
  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encode(k)}=${encode(oauthParams[k])}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    encode(url),
    encode(sortedParams),
  ].join("&");

  const signingKey = `${encode(consumerSecret)}&${encode(tokenSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  return (
    "OAuth " +
    Object.keys(oauthParams)
      .map((k) => `${encode(k)}="${encode(oauthParams[k])}"`)
      .join(", ")
  );
}

/** Parses an application/x-www-form-urlencoded OAuth response body. */
export function parseOAuthBody(body: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(body));
}
