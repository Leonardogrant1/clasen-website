import { NextRequest, NextResponse } from "next/server";
import { buildAuthHeader } from "@/lib/oauth1";

const CONSUMER_KEY = process.env.IS24_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.IS24_CONSUMER_SECRET!;
const ACCESS_TOKEN = process.env.IS24_ACCESS_TOKEN!;
const ACCESS_TOKEN_SECRET = process.env.IS24_ACCESS_TOKEN_SECRET!;

const RESOURCE_URL =
  "https://rest.immobilienscout24.de/restapi/api/offer/v1.0/user/me/realestate/";

export async function GET(request: NextRequest) {

  if (!ACCESS_TOKEN || !ACCESS_TOKEN_SECRET) {
    return NextResponse.json({ error: "Not authenticated. Visit /api/oauth/init first." }, { status: 401 });
  }

  const authHeader = buildAuthHeader(
    "GET",
    RESOURCE_URL,
    CONSUMER_KEY,
    CONSUMER_SECRET,
    ACCESS_TOKEN,
    ACCESS_TOKEN_SECRET
  );

  const res = await fetch(RESOURCE_URL, {
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "IS24 request failed", detail: text },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
