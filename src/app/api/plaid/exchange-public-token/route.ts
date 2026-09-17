import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaidClient';
import { runUnderwritingEngine, FlinksAccountData } from '@/lib/underwritingEngine';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CRM_FILE = path.join(DATA_DIR, 'crm_leads.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { public_token, dealId, institution = 'RBC Royal Bank', businessName = 'Apex Client' } = body;

    let accountData: FlinksAccountData;

    // Check if live Plaid API or simulated sandbox exchange
    if (public_token && !public_token.startsWith('link-sandbox-apex-mock') && process.env.PLAID_CLIENT_ID && process.env.PLAID_CLIENT_ID !== 'sandbox_client_id') {
      const exchangeResponse = await plaidClient.itemPublicTokenExchange({
        public_token: public_token,
      });

      const accessToken = exchangeResponse.data.access_token;
      const itemId = exchangeResponse.data.item_id;

      // Fetch accounts and balances
      const accountsResponse = await plaidClient.accountsGet({
        access_token: accessToken,
      });

      const primaryAccount = accountsResponse.data.accounts[0] || {};

      // Fetch 12-month transactions
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      const endDate = new Date();

      const transactionsResponse = await plaidClient.transactionsGet({
        access_token: accessToken,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      });

      const txs = transactionsResponse.data.transactions.map((t: any) => ({
        id: t.transaction_id,
        date: t.date,
        description: t.name || t.merchant_name || 'Commercial Deposit/Transfer',
        amount: -t.amount, // Plaid represents positive as outflow, we invert
        balance: primaryAccount.balances.current || 0
      }));

      accountData = {
        accountNumber: primaryAccount.mask ? `****${primaryAccount.mask}` : '****4892',
        institution: institution || 'Canadian Commercial Bank',
        holderName: businessName,
        businessName: businessName,
        currentBalance: primaryAccount.balances.current || 28450,
        transactions: txs
      };
    } else {
      // High-grade simulated realistic Canadian commercial bank payload for instant testing
      const now = new Date();
      const mockTxs = [];
      const baseMonthlyRev = 48000 + Math.floor(Math.random() * 25000);
      let runningBal = 24500;

      for (let m = 0; m < 6; m++) {
        const d = new Date();
        d.setMonth(now.getMonth() - m);
        const monthStr = d.toISOString().split('T')[0].substring(0, 7);

        // 4 major client deposits per month
        for (let i = 1; i <= 4; i++) {
          const dep = Math.round((baseMonthlyRev / 4) * (0.85 + Math.random() * 0.3));
          runningBal += dep;
          mockTxs.push({
            id: `tx_${m}_${i}`,
            date: `${monthStr}-${String(i * 6).padStart(2, '0')}`,
            description: `WIRE IN / CLIENT SETTLEMENT REF#${1000 + i * m}`,
            amount: dep,
            balance: runningBal
          });

          // Operating expenses / payroll debits
          const debit = Math.round(dep * 0.72);
          runningBal -= debit;
          mockTxs.push({
            id: `deb_${m}_${i}`,
            date: `${monthStr}-${String(i * 6 + 1).padStart(2, '0')}`,
            description: `PRE-AUTHORIZED DEBIT - PAYROLL / SUPPLIES`,
            amount: -debit,
            balance: runningBal
          });
        }
      }

      accountData = {
        accountNumber: '****9182',
        institution: institution,
        holderName: businessName,
        businessName: businessName,
        currentBalance: Math.max(12400, runningBal),
        transactions: mockTxs
      };
    }

    // Run Apex Automated Underwriting Engine on the Plaid data
    const underwritingResult = runUnderwritingEngine(accountData);

    // If dealId is provided, update persistent CRM data
    if (dealId && fs.existsSync(CRM_FILE)) {
      try {
        const crmData = JSON.parse(fs.readFileSync(CRM_FILE, 'utf-8'));
        const dealIndex = crmData.findIndex((d: any) => d.id === dealId || d.dealId === dealId);
        if (dealIndex !== -1) {
          crmData[dealIndex].status = 'UNDERWRITING_REVIEW';
          crmData[dealIndex].stage = 3;
          crmData[dealIndex].plaidConnected = true;
          crmData[dealIndex].plaidData = {
            institution: accountData.institution,
            accountNumber: accountData.accountNumber,
            currentBalance: accountData.currentBalance,
            verifiedAt: new Date().toISOString()
          };
          crmData[dealIndex].underwriting = underwritingResult;
          fs.writeFileSync(CRM_FILE, JSON.stringify(crmData, null, 2));
        }
      } catch (err) {
        console.error('Failed to update CRM data:', err);
      }
    }

    return NextResponse.json({
      success: true,
      account: {
        institution: accountData.institution,
        accountNumber: accountData.accountNumber,
        currentBalance: accountData.currentBalance,
      },
      underwriting: underwritingResult
    });
  } catch (error: any) {
    console.error('Plaid exchange error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to exchange token' }, { status: 500 });
  }
}
