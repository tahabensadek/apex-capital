# CapitalFacile — capitalfacile.ca

Lead-generation site and internal tools for **CapitalFacile** (9576-7406 Québec inc., NEQ 1182595141):
revenue-based business funding for Quebec SMBs turned down by their bank.

Funnel: Google Ads → landing page → 4-step application → instant SMS alert → callback in under 5 minutes
→ signed mandate → file presented to the partner funder.

## Run locally

```bash
cp .env.example .env.local   # fill in what you have
npm install
npm run dev                  # http://localhost:3000
```

## Where things live

| What | Where |
| :--- | :--- |
| Company info, contact, **fee %**, legal disclosure | `src/lib/brand.ts` (+ env vars in `.env.example`) |
| Landing page | `src/app/page.tsx`, `src/components/*` |
| Lead intake + SMS alerts | `src/app/api/lead/route.ts` |
| Password protection for internal pages | `src/proxy.ts` (`ADMIN_USER` / `ADMIN_PASSWORD`) |
| Client mandate (FR/EN templates) | `lending_documents/` |
| Call script, funder email | `playbook/` |

## Before running paid traffic

- [ ] Funder's written confirmation of the client fee (`playbook/Courriel_AFN_Confirmation_Honoraires.md`)
- [ ] Funder's written approval of site, ads and call script (partner agreement s. 3 and 5)
- [ ] "CapitalFacile" registered as a trade name with the Registraire des entreprises
- [ ] `info@capitalfacile.ca` mailbox exists
- [ ] Vercel env vars set: `TELNYX_*`, `ADMIN_PASSWORD`, `LEAD_WEBHOOK_URL`
- [ ] Mandate reviewed by a Quebec lawyer
- [ ] Privacy policy page (Law 25)
