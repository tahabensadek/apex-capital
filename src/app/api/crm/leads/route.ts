import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface CRMLead {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  province: string;
  amount: number;
  monthlyRevenue: string;
  stage: 'INBOUND_NEW' | 'CONTACTED_FLINKS' | 'UNDERWRITING' | 'MANDATE_SIGNED' | 'SENT_TO_LENDER' | 'FUNDED' | 'RENEWAL_READY';
  lender: 'MERCHANT_GROWTH' | 'AFN' | 'LIQUID_CAPITAL' | 'EQUIREX' | 'PENDING';
  tier: 'TIER_A' | 'TIER_B' | 'TIER_C';
  hasFlinksConnected: boolean;
  apexCommission: number;
  notes: string[];
  createdAt: string;
  lastActivity: string;
  minutesAgo: number;
}

const DEFAULT_LEADS: CRMLead[] = [
  {
    id: 'APX-901',
    businessName: 'Sommet Toiture & Rénovation Inc.',
    ownerName: 'Jean-Philippe Tremblay',
    phone: '514-819-4921',
    email: 'jp.tremblay@sommettoiture.ca',
    province: 'QC',
    amount: 75000,
    monthlyRevenue: '$85,000 / mois',
    stage: 'INBOUND_NEW',
    lender: 'MERCHANT_GROWTH',
    tier: 'TIER_A',
    hasFlinksConnected: true,
    apexCommission: 4875,
    notes: ['Urgence matériaux toiture pour lundi', 'Revenus propres sur RBC', '0 MCA existant'],
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    lastActivity: 'Formulaire complété il y a 2 min',
    minutesAgo: 2,
  },
  {
    id: 'APX-902',
    businessName: 'Apex Logistics Freight Ltd.',
    ownerName: 'Harpreet Singh',
    phone: '403-992-1844',
    email: 'h.singh@apexlogistics.ca',
    province: 'AB',
    amount: 110000,
    monthlyRevenue: '$140,000 / mois',
    stage: 'UNDERWRITING',
    lender: 'AFN',
    tier: 'TIER_B',
    hasFlinksConnected: true,
    apexCommission: 7150,
    notes: ['Réparation moteur diesel x 2 camions', '1 MCA Thinking Capital actif', 'Amir AFN notifié'],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastActivity: 'Offre AFN émise en attente signature',
    minutesAgo: 45,
  },
  {
    id: 'APX-903',
    businessName: 'Excavation & Pavage Boréal Inc.',
    ownerName: 'Mathieu Roy',
    phone: '418-560-3312',
    email: 'mroy@borealexcavation.com',
    province: 'QC',
    amount: 85000,
    monthlyRevenue: '$95,000 / mois',
    stage: 'MANDATE_SIGNED',
    lender: 'MERCHANT_GROWTH',
    tier: 'TIER_A',
    hasFlinksConnected: true,
    apexCommission: 5525,
    notes: ['Mandat 5% Direction to Pay signé', 'Flinks RBC validé', 'Envoi closing Merchant Growth'],
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    lastActivity: 'Mandat signé il y a 20 min',
    minutesAgo: 120,
  },
  {
    id: 'APX-904',
    businessName: 'Centre Mécanique & Carrosserie Laurentien',
    ownerName: 'Stéphane Bouchard',
    phone: '450-712-8840',
    email: 'sbouchard@garage-laurentien.ca',
    province: 'QC',
    amount: 45000,
    monthlyRevenue: '$55,000 / mois',
    stage: 'FUNDED',
    lender: 'MERCHANT_GROWTH',
    tier: 'TIER_A',
    hasFlinksConnected: true,
    apexCommission: 2925,
    notes: ['Fonds déboursés 24h virés', 'Commission reçue dans compte Apex', 'Client enchanté'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: 'Virement commission 2 925 $ reçu',
    minutesAgo: 1440,
  },
  {
    id: 'APX-905',
    businessName: 'Clinique Dentaire & Santé Urbaine',
    ownerName: 'Dr. Sarah El-Khatib',
    phone: '514-339-0112',
    email: 'sarah@dentaireurbain.com',
    province: 'QC',
    amount: 125000,
    monthlyRevenue: '$160,000 / mois',
    stage: 'SENT_TO_LENDER',
    lender: 'MERCHANT_GROWTH',
    tier: 'TIER_A',
    hasFlinksConnected: true,
    apexCommission: 8125,
    notes: ['Achat équipement laser & fauteuils', 'Dossier transmis à Kevin Clark chez MG'],
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    lastActivity: 'En cours de décaissement',
    minutesAgo: 180,
  }
];

function getLeadsFilePath(): string {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  return path.join(dataDir, 'crm_leads.json');
}

export async function GET() {
  try {
    const filePath = getLeadsFilePath();
    let leads: CRMLead[] = [];

    if (fs.existsSync(filePath)) {
      try {
        leads = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        leads = DEFAULT_LEADS;
      }
    } else {
      leads = DEFAULT_LEADS;
      fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf-8');
    }

    return NextResponse.json({ success: true, leads }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const filePath = getLeadsFilePath();
    let leads: CRMLead[] = [];

    if (fs.existsSync(filePath)) {
      try {
        leads = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      } catch (e) {
        leads = DEFAULT_LEADS;
      }
    } else {
      leads = DEFAULT_LEADS;
    }

    if (body.action === 'UPDATE_STAGE') {
      const { leadId, stage } = body;
      leads = leads.map(l => l.id === leadId ? { ...l, stage, lastActivity: `Étape changée: ${stage}` } : l);
    } else if (body.action === 'ADD_NOTE') {
      const { leadId, note } = body;
      leads = leads.map(l => l.id === leadId ? { ...l, notes: [note, ...l.notes], lastActivity: `Note ajoutée: ${note.slice(0, 30)}...` } : l);
    } else if (body.action === 'ASSIGN_LENDER') {
      const { leadId, lender } = body;
      leads = leads.map(l => l.id === leadId ? { ...l, lender, lastActivity: `Prêteur assigné: ${lender}` } : l);
    } else if (body.action === 'NEW_LEAD') {
      leads.unshift(body.lead);
    }

    fs.writeFileSync(filePath, JSON.stringify(leads, null, 2), 'utf-8');
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
