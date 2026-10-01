import { NextResponse } from "next/server";
import { verifyLeadSignature } from "@/lib/leadLink";
import { LEAD_STATUSES, getLead, updateLead, type LeadStatus } from "@/lib/leadStore";

export const dynamic = "force-dynamic";

/** Updates from the one-tap lead page: log a call, or change the status. Auth = signed link. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { k?: string; action?: string; status?: string; fundedAmount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!verifyLeadSignature(id, body.k)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (body.action === "call") {
    const updated = await updateLead(id, {
      firstCalledAt: lead.firstCalledAt ?? new Date().toISOString(),
      callAttempts: lead.callAttempts + 1,
    });
    await notifyWebhook("lead.called", updated);
    return NextResponse.json({ lead: updated });
  }

  if (body.action === "status") {
    const status = body.status as LeadStatus;
    if (!LEAD_STATUSES.includes(status)) {
      return NextResponse.json({ error: "invalid_status" }, { status: 400 });
    }
    const patch: Parameters<typeof updateLead>[1] = { status };
    if (status === "FUNDED") {
      const amount = Math.round(Number(body.fundedAmount) || 0);
      if (amount <= 0) return NextResponse.json({ error: "funded_amount_required" }, { status: 400 });
      patch.fundedAmount = amount;
      patch.fundedAt = lead.fundedAt ?? new Date().toISOString();
    }
    const updated = await updateLead(id, patch);
    await notifyWebhook("lead.updated", updated);
    return NextResponse.json({ lead: updated });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}

async function notifyWebhook(event: string, lead: unknown) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url || !lead) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...(lead as object) }),
    });
  } catch (err) {
    console.error("Lead webhook error", (err as Error).message);
  }
}
