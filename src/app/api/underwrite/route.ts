import { NextResponse } from 'next/server';
import { runUnderwritingEngine, FlinksAccountData } from '@/lib/underwritingEngine';

export async function POST(request: Request) {
  try {
    const body: FlinksAccountData = await request.json();
    
    if (!body || !body.transactions) {
      return NextResponse.json(
        { error: 'Transactions bancaires requises pour la souscription algorithmique.' },
        { status: 400 }
      );
    }

    const evaluation = runUnderwritingEngine(body);
    return NextResponse.json({ success: true, evaluation });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erreur lors du calcul de souscription.', details: error.message },
      { status: 500 }
    );
  }
}
