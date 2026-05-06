


import { NextRequest, NextResponse } from "next/server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json();

    console.log(body);

    const distinctId = req.headers.get("x-posthog-distinct-id") ?? body.email ?? "anonymous";
    const sessionId = req.headers.get("x-posthog-session-id") ?? undefined;
    const posthog = getPostHogClient();
    posthog.capture({
        distinctId,
        event: "contact_message_received",
        properties: {
            has_phone: !!body.phone,
            ...(sessionId ? { $session_id: sessionId } : {}),
        },
    });
    await posthog.flush();

    return NextResponse.json({ message: "Success" });
}