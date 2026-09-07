import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type TransactionData = {
  id: string;
  customData?: Record<string, unknown> | null;
  currencyCode?: string | null;
  details?: { totals?: { total?: string | null } | null } | null;
};

/** ويبهوك Paddle: يسجّل الشراء عند اكتمال العملية. يجب أن يكون الرابط مسجلاً في لوحة Paddle. */
export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  const apiKey = process.env.PADDLE_API_KEY;
  if (!secret || !apiKey) return NextResponse.json({ error: "غير مضبوط" }, { status: 503 });

  const signature = request.headers.get("paddle-signature") || "";
  const raw = await request.text();
  const paddle = new Paddle(apiKey, {
    environment: process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? Environment.production : Environment.sandbox,
  });

  let event;
  try {
    event = await paddle.webhooks.unmarshal(raw, secret, signature);
  } catch {
    return NextResponse.json({ error: "توقيع غير صالح" }, { status: 400 });
  }
  if (!event) return NextResponse.json({ error: "حدث غير معروف" }, { status: 400 });

  const admin = adminClient();
  const { error: dup } = await admin.from("webhook_events").insert({ id: event.eventId, provider: "paddle" });
  if (dup) return NextResponse.json({ ok: true, duplicate: true });

  if (event.eventType === EventName.TransactionCompleted) {
    const data = event.data as unknown as TransactionData;
    const custom = (data.customData ?? {}) as { assessment_id?: string; user_id?: string };
    if (custom.user_id) {
      const minor = Number(data.details?.totals?.total ?? NaN);
      await admin.from("purchases").upsert(
        {
          user_id: custom.user_id,
          assessment_id: custom.assessment_id ?? null,
          provider: "paddle",
          provider_ref: data.id,
          amount: Number.isFinite(minor) ? minor / 100 : null,
          currency: data.currencyCode ?? null,
          status: "paid",
        },
        { onConflict: "provider_ref" },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
