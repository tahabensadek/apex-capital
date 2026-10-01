import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { verifyLeadSignature } from "@/lib/leadLink";
import { getLead } from "@/lib/leadStore";
import { LeadActions } from "./LeadActions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lead — CapitalFacile",
  robots: { index: false, follow: false },
};

export default async function LeadPage(props: PageProps<"/l/[id]">) {
  const { id } = await props.params;
  const { k } = await props.searchParams;
  const sig = typeof k === "string" ? k : "";
  if (!verifyLeadSignature(id, sig)) notFound();
  const lead = await getLead(id);
  if (!lead) notFound();
  return <LeadActions initialLead={lead} sig={sig} />;
}
