import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_DIR = path.join(process.cwd(), 'data');
const CRM_FILE = path.join(DATA_DIR, 'crm_leads.json');

function getDeals() {
  if (!fs.existsSync(CRM_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(CRM_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveDeals(deals: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CRM_FILE, JSON.stringify(deals, null, 2));
}

export async function GET(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;
  const deals = getDeals();
  let deal = deals.find((d: any) => d.id === dealId || d.dealId === dealId);

  // If deal doesn't exist yet, create a clean default demo deal for this ID
  if (!deal) {
    deal = {
      id: dealId,
      dealId: dealId,
      companyName: 'Apex Partner Corp',
      contactName: 'Commercial Director',
      phone: '+1 (514) 555-0199',
      email: 'finance@apexclient.ca',
      amountRequested: 65000,
      monthlyRevenue: 55000,
      useOfFunds: 'Working Capital & Inventory Bridge',
      stage: 1, // 1: Intake/Bank, 2: Pre-Screened, 3: Underwriting (BCC Fund), 4: Approved Offer, 5: Funded
      status: 'AWAITING_BANK_CONNECT',
      mandateSigned: false,
      plaidConnected: false,
      documents: [],
      createdAt: new Date().toISOString(),
      accountExec: {
        name: 'Apex Capital Desk',
        phone: '+1 (514) 800-APEX',
        email: 'partners@bccfund.com'
      }
    };
    deals.unshift(deal);
    saveDeals(deals);
  }

  return NextResponse.json({ deal }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;
  const body = await request.json();
  const deals = getDeals();
  let dealIndex = deals.findIndex((d: any) => d.id === dealId || d.dealId === dealId);

  if (dealIndex === -1) {
    const newDeal = {
      id: dealId,
      dealId: dealId,
      createdAt: new Date().toISOString(),
      ...body
    };
    deals.unshift(newDeal);
    saveDeals(deals);
    return NextResponse.json({ success: true, deal: newDeal });
  }

  deals[dealIndex] = {
    ...deals[dealIndex],
    ...body,
    updatedAt: new Date().toISOString()
  };

  saveDeals(deals);
  return NextResponse.json({ success: true, deal: deals[dealIndex] });
}
