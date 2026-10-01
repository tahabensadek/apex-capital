import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Politique de confidentialité — ${BRAND.name}`,
  description: `Comment ${BRAND.name} recueille, utilise et protège vos renseignements personnels.`,
};

const UPDATED = "1er octobre 2026";
const UPDATED_EN = "October 1, 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <div className="space-y-2 text-sm text-slate-300 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-4 py-12">
      <article className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="text-sm text-emerald-400 hover:underline">
          ← {BRAND.name}
        </Link>

        <header className="space-y-1">
          <h1 className="text-3xl font-black text-white">Politique de confidentialité</h1>
          <p className="text-xs text-slate-500">
            Dernière mise à jour : {UPDATED} · <a href="#english" className="underline">English version below</a>
          </p>
        </header>

        <Section title="1. Qui sommes-nous">
          <p>
            {BRAND.legalName}, faisant affaires sous le nom {BRAND.name} (NEQ {BRAND.neq}), {BRAND.address}. Nous sommes un
            intermédiaire en financement commercial : nous aidons les entreprises à présenter une demande de financement à
            notre bailleur de fonds partenaire.
          </p>
          <p>
            <strong>Responsable de la protection des renseignements personnels :</strong> {BRAND.founder}, président —{" "}
            <a href={`mailto:${BRAND.email}`} className="text-emerald-400 underline">{BRAND.email}</a>, {BRAND.phoneDisplay}.
          </p>
        </Section>

        <Section title="2. Renseignements que nous recueillons">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Formulaire de demande :</strong> nom de l&apos;entreprise, votre nom, téléphone, courriel, province, montant demandé, utilisation des fonds, secteur, ancienneté, revenus mensuels approximatifs, paiements refusés (NSF), avance de fonds en cours.</li>
            <li><strong>Préparation du dossier (si vous poursuivez) :</strong> relevés bancaires d&apos;entreprise, pièce d&apos;identité avec photo, spécimen de chèque, documents corporatifs, mandat signé.</li>
            <li><strong>Suivi de la demande :</strong> date et heure de nos appels, statut du dossier, montant financé, le cas échéant.</li>
            <li><strong>Provenance publicitaire :</strong> l&apos;identifiant de clic Google Ads (gclid) et les paramètres de campagne (UTM) présents dans l&apos;adresse de la page lorsque vous envoyez le formulaire.</li>
            <li><strong>Témoins (cookies) :</strong> témoins Google Ads servant à mesurer l&apos;efficacité de nos publicités, <strong>seulement si vous les acceptez</strong>. Ils sont désactivés par défaut.</li>
          </ul>
        </Section>

        <Section title="3. Pourquoi nous les utilisons">
          <ul className="list-disc pl-5 space-y-1">
            <li>Vous rappeler rapidement et évaluer si votre profil correspond aux critères du bailleur de fonds.</li>
            <li>Préparer votre dossier et, <strong>avec votre consentement</strong> (mandat signé), le présenter au bailleur de fonds.</li>
            <li>Percevoir nos honoraires si vous êtes financé, et respecter nos obligations légales et comptables.</li>
            <li>Mesurer quelles publicités mènent à des demandes et à des financements, afin de dépenser moins par client.</li>
          </ul>
          <p>Nous ne vendons pas vos renseignements et ne les utilisons pas pour prendre de décision de financement : c&apos;est le bailleur de fonds qui décide.</p>
        </Section>

        <Section title="4. Avec qui nous les partageons">
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Notre bailleur de fonds partenaire</strong>, seulement après la signature de votre mandat, pour analyser et gérer votre financement.</li>
            <li><strong>Nos fournisseurs de services</strong>, qui agissent pour notre compte : hébergement du site (Vercel), base de données (Upstash), envoi de textos (Telnyx), publicité et mesure (Google), signature électronique et tenue de livres.</li>
          </ul>
          <p>
            <strong>Communication à l&apos;extérieur du Québec :</strong> certains de ces fournisseurs, ainsi que notre bailleur de fonds
            partenaire, sont situés ou conservent des données à l&apos;extérieur du Québec, notamment aux États-Unis. Nous évaluons leurs
            mesures de protection avant de leur confier des renseignements.
          </p>
        </Section>

        <Section title="5. Conservation et sécurité">
          <p>
            Nous conservons vos renseignements le temps nécessaire aux fins ci-dessus, puis au plus deux (2) ans après la fin de notre
            mandat ou de nos échanges, sauf obligation légale de les garder plus longtemps (par exemple, les registres comptables). Ils
            sont ensuite détruits ou anonymisés. L&apos;accès est limité aux personnes qui en ont besoin, et les communications sont chiffrées.
          </p>
        </Section>

        <Section title="6. Vos droits">
          <p>
            Vous pouvez en tout temps demander l&apos;accès à vos renseignements, leur rectification, ou retirer votre consentement (ce qui
            peut nous empêcher de poursuivre votre dossier). Écrivez à{" "}
            <a href={`mailto:${BRAND.email}`} className="text-emerald-400 underline">{BRAND.email}</a>. Nous répondons dans un délai de 30 jours.
            Pour refuser les textos, répondez ARRET.
          </p>
          <p>
            Si vous n&apos;êtes pas satisfait de notre réponse, vous pouvez porter plainte auprès de la Commission d&apos;accès à
            l&apos;information du Québec (cai.gouv.qc.ca).
          </p>
        </Section>

        <Section title="7. Témoins (cookies)">
          <p>
            Les témoins publicitaires de Google Ads sont désactivés tant que vous ne cliquez pas sur « Accepter » dans la bannière. Si vous
            refusez, Google peut quand même recevoir des signaux sans témoin (par exemple, qu&apos;une demande a été envoyée) pour estimer
            l&apos;efficacité de nos annonces de façon agrégée. Pour changer votre choix, effacez les données de ce site dans votre navigateur.
          </p>
        </Section>

        <hr className="border-slate-800" />

        <div id="english" className="space-y-8">
          <header className="space-y-1">
            <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Last updated: {UPDATED_EN}. If the versions differ, the French version prevails.</p>
          </header>

          <Section title="1. Who we are">
            <p>
              {BRAND.legalName}, doing business as {BRAND.name} (NEQ {BRAND.neq}), {BRAND.address}. We are a commercial financing
              intermediary that helps businesses apply for funding with our partner funder.
            </p>
            <p>
              <strong>Privacy officer:</strong> {BRAND.founder}, President — <a href={`mailto:${BRAND.email}`} className="text-emerald-400 underline">{BRAND.email}</a>, {BRAND.phoneDisplay}.
            </p>
          </Section>

          <Section title="2. What we collect">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Application form:</strong> business name, your name, phone, email, province, amount requested, use of funds, industry, time in business, approximate monthly revenue, bounced payments (NSF), existing cash advance.</li>
              <li><strong>File preparation (if you proceed):</strong> business bank statements, photo ID, void cheque, corporate documents, signed mandate.</li>
              <li><strong>Follow-up:</strong> time of our calls, file status, amount funded if applicable.</li>
              <li><strong>Ad source:</strong> the Google Ads click ID (gclid) and campaign (UTM) parameters in the page address when you submit the form.</li>
              <li><strong>Cookies:</strong> Google Ads cookies to measure our ads, <strong>only if you accept them</strong>. They are off by default.</li>
            </ul>
          </Section>

          <Section title="3. Why we use it">
            <ul className="list-disc pl-5 space-y-1">
              <li>To call you back quickly and assess whether your profile fits the funder&apos;s criteria.</li>
              <li>To prepare your file and, <strong>with your consent</strong> (signed mandate), present it to the funder.</li>
              <li>To collect our fee if you are funded, and meet our legal and accounting obligations.</li>
              <li>To measure which ads lead to applications and fundings, so we spend less per client.</li>
            </ul>
            <p>We do not sell your information or use it to make funding decisions: the funder decides.</p>
          </Section>

          <Section title="4. Who we share it with">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Our partner funder</strong>, only after you sign the mandate, to review and administer your funding.</li>
              <li><strong>Service providers</strong> acting on our behalf: website hosting (Vercel), database (Upstash), text messaging (Telnyx), advertising and measurement (Google), e-signature and bookkeeping.</li>
            </ul>
            <p>
              <strong>Outside Quebec:</strong> some of these providers and our partner funder are located, or store data, outside Quebec,
              including in the United States. We assess their safeguards before sharing information with them.
            </p>
          </Section>

          <Section title="5. Retention and security">
            <p>
              We keep your information as long as needed for the purposes above, then at most two (2) years after our mandate or
              communications end, unless the law requires longer (e.g. accounting records). It is then destroyed or anonymized. Access is
              limited to those who need it, and communications are encrypted.
            </p>
          </Section>

          <Section title="6. Your rights">
            <p>
              You may at any time request access to or correction of your information, or withdraw your consent (which may prevent us from
              continuing your file). Write to <a href={`mailto:${BRAND.email}`} className="text-emerald-400 underline">{BRAND.email}</a>. We answer within 30 days. To stop text messages, reply STOP.
            </p>
            <p>If you are not satisfied with our answer, you may file a complaint with Quebec&apos;s Commission d&apos;accès à l&apos;information (cai.gouv.qc.ca).</p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Google Ads cookies stay off until you click &quot;Accept&quot; in the banner. If you decline, Google may still receive cookieless
              signals (for example, that an application was sent) to estimate ad performance in aggregate. To change your choice, clear this
              site&apos;s data in your browser.
            </p>
          </Section>
        </div>
      </article>
    </main>
  );
}
