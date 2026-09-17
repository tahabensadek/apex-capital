import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid';

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID || 'sandbox_client_id';
const PLAID_SECRET = process.env.PLAID_SECRET || 'sandbox_secret';
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

export const plaidClient = new PlaidApi(configuration);

export const DEFAULT_PLAID_PRODUCTS = [Products.Transactions, Products.Auth];
export const DEFAULT_PLAID_COUNTRY_CODES = [CountryCode.Ca, CountryCode.Us];
