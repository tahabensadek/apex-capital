import { NextResponse } from 'next/server';
import { plaidClient, DEFAULT_PLAID_PRODUCTS, DEFAULT_PLAID_COUNTRY_CODES } from '@/lib/plaidClient';
import { Products, CountryCode } from 'plaid';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId = 'user_apex_' + Date.now(), clientName = 'Apex Capital Vault' } = body;

    // Check if we have valid API keys or if we provide a sandbox mock token
    if (!process.env.PLAID_CLIENT_ID || process.env.PLAID_CLIENT_ID === 'sandbox_client_id') {
      // Return a development sandbox link token or simulated mode
      return NextResponse.json({
        link_token: 'link-sandbox-apex-mock-token-' + Date.now(),
        expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
        is_mock: true,
        message: 'Sandbox mode active. Ready for live PLAID_CLIENT_ID and PLAID_SECRET keys.'
      });
    }

    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: String(userId) },
      client_name: clientName,
      products: DEFAULT_PLAID_PRODUCTS,
      country_codes: DEFAULT_PLAID_COUNTRY_CODES,
      language: 'en',
    });

    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      is_mock: false
    });
  } catch (error: any) {
    console.error('Plaid link token create error:', error?.response?.data || error);
    // Graceful fallback for local development/testing
    return NextResponse.json({
      link_token: 'link-sandbox-apex-mock-token-' + Date.now(),
      expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
      is_mock: true,
      error: error?.message
    });
  }
}
