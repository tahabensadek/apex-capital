import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      businessName,
      ownerName,
      phone,
      email,
      province,
      amount,
      purpose,
      timeInBusiness,
      monthlyRevenue,
      hasFlinksConnected,
      uploadedFileName,
      timestamp,
    } = body;

    // 1. Log lead to local JSON database / persistent storage
    const leadsDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(leadsDir)) {
      fs.mkdirSync(leadsDir, { recursive: true });
    }
    const leadsFile = path.join(leadsDir, "leads.json");
    let leads = [];
    if (fs.existsSync(leadsFile)) {
      try {
        leads = JSON.parse(fs.readFileSync(leadsFile, "utf-8"));
      } catch (e) {
        leads = [];
      }
    }

    const newLead = {
      id: "APEX-" + Date.now().toString(36).toUpperCase(),
      businessName: businessName || "Entreprise Commerciale",
      ownerName: ownerName || "Dirigeant",
      phone: phone || "+15145550199",
      email: email || "direction@entreprise.ca",
      province: province || "QC",
      amount: Number(amount) || 65000,
      purpose: purpose || "Fonds de roulement",
      timeInBusiness: timeInBusiness || "1-2 Ans",
      monthlyRevenue: monthlyRevenue || "$50,000 / mois",
      hasFlinksConnected: !!hasFlinksConnected,
      uploadedFileName: uploadedFileName || "",
      status: "NEW_INBOUND_URGENT",
      createdAt: timestamp || new Date().toISOString(),
      merchantGrowthPackage: {
        company: businessName,
        contactName: ownerName,
        phone,
        email,
        province,
        requestedAmount: amount,
        estimatedRevenue: monthlyRevenue,
        flinksVerified: hasFlinksConnected,
      },
    };

    leads.unshift(newLead);
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), "utf-8");

    // Also populate CRM deals for immediate portal access
    const crmFile = path.join(leadsDir, "crm_leads.json");
    let crmDeals = [];
    if (fs.existsSync(crmFile)) {
      try {
        crmDeals = JSON.parse(fs.readFileSync(crmFile, "utf-8"));
      } catch (e) {
        crmDeals = [];
      }
    }
    const newDeal = {
      id: newLead.id,
      dealId: newLead.id,
      companyName: newLead.businessName,
      contactName: newLead.ownerName,
      phone: newLead.phone,
      email: newLead.email,
      amountRequested: newLead.amount,
      monthlyRevenue: typeof monthlyRevenue === 'number' ? monthlyRevenue : 65000,
      useOfFunds: newLead.purpose,
      stage: 1,
      status: 'AWAITING_BANK_CONNECT',
      mandateSigned: false,
      plaidConnected: !!hasFlinksConnected,
      documents: uploadedFileName ? [{ name: uploadedFileName, type: 'Bank Statement PDF', uploadedAt: new Date().toISOString() }] : [],
      createdAt: new Date().toISOString(),
      accountExec: {
        name: 'Taha Bensadek (Direct Desk)',
        phone: '+1 (514) 800-APEX',
        email: 'partners@bccfund.com'
      }
    };
    crmDeals.unshift(newDeal);
    fs.writeFileSync(crmFile, JSON.stringify(crmDeals, null, 2), "utf-8");

    const isEnglish = body.lang === "en" || body.province === "AB" || body.province === "ON" || body.province === "BC";

    // 2. Telnyx SMS Alert simulation / API call
    const telnyxApiKey = process.env.TELNYX_API_KEY;
    const fromNumber = process.env.TELNYX_FROM_NUMBER || "+18005550199";
    const adminPhone = process.env.ADMIN_PHONE || "+15145550199";

    const adminAlertMessage = `🚨 NEW APEX LEAD: ${businessName} | Req: $${Number(
      amount
    ).toLocaleString()} | Rev: ${monthlyRevenue} | Contact: ${ownerName} (${phone}) [${isEnglish ? 'EN' : 'FR'}] -> CALL WITHIN 3 MINS`;

    const customerSmsMessage = isEnglish
      ? `Hi ${ownerName || "there"}, this is Taha from Apex Capital. I received your $${Number(
          amount
        ).toLocaleString()} funding request for ${businessName}. I'm reviewing your file right now and will call you in 2 minutes.`
      : `Salut ${ownerName || ""}, c'est Taha d'Apex Capital. J'ai bien reçu ta demande de ${Number(
          amount
        ).toLocaleString()} $ pour ${businessName}. Je prépare ton offre et je t'appelle dans 2 minutes.`;

    console.log("-----------------------------------------");
    console.log("⚡ TELNYX BILINGUAL DISPATCH ENGINE ⚡");
    console.log("TO ADMIN:", adminPhone, "| MSG:", adminAlertMessage);
    console.log("TO CUSTOMER:", phone, "| MSG:", customerSmsMessage);
    console.log("-----------------------------------------");

    if (telnyxApiKey && phone) {
      try {
        // Send SMS to Customer
        await fetch("https://api.telnyx.com/v2/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${telnyxApiKey}`,
          },
          body: JSON.stringify({
            from: fromNumber,
            to: phone,
            text: customerSmsMessage,
          }),
        });

        // Send SMS to Admin (Taha)
        await fetch("https://api.telnyx.com/v2/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${telnyxApiKey}`,
          },
          body: JSON.stringify({
            from: fromNumber,
            to: adminPhone,
            text: adminAlertMessage,
          }),
        });
      } catch (telnyxErr) {
        console.error("Telnyx real dispatch error:", telnyxErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      message: "Lead processed and queued for instant Telnyx dispatch.",
      lead: newLead,
    });
  } catch (error: any) {
    console.error("Lead processing error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
