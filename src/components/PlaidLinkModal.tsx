"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  X, 
  KeyRound, 
  Smartphone, 
  AlertCircle,
  Sparkles,
  Loader2
} from "lucide-react";

interface PlaidBank {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  popular?: boolean;
}

const CANADIAN_BANKS: PlaidBank[] = [
  { id: "rbc", name: "RBC Royal Bank", logo: "🦁", primaryColor: "bg-blue-600", popular: true },
  { id: "td", name: "TD Canada Trust", logo: "🟩", primaryColor: "bg-emerald-600", popular: true },
  { id: "desjardins", name: "Desjardins", logo: "🟢", primaryColor: "bg-green-700", popular: true },
  { id: "scotia", name: "Scotiabank", logo: "🔴", primaryColor: "bg-red-600", popular: true },
  { id: "bmo", name: "BMO Bank of Montreal", logo: "🔵", primaryColor: "bg-blue-700", popular: true },
  { id: "cibc", name: "CIBC", logo: "🏛️", primaryColor: "bg-rose-700", popular: true },
  { id: "nbc", name: "Banque Nationale (NBC)", logo: "⚡", primaryColor: "bg-red-700", popular: true },
  { id: "tangerine", name: "Tangerine", logo: "🍊", primaryColor: "bg-orange-600" },
  { id: "laurentian", name: "Banque Laurentienne", logo: "🏢", primaryColor: "bg-teal-700" },
  { id: "atb", name: "ATB Financial", logo: "🔷", primaryColor: "bg-sky-700" },
  { id: "vancity", name: "Vancity Credit Union", logo: "🌲", primaryColor: "bg-emerald-800" },
];

interface PlaidLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { institution: string; accountNumber: string; balance: number }) => void;
  businessName?: string;
}

export const PlaidLinkModal: React.FC<PlaidLinkModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  businessName = "Apex Client Corp"
}) => {
  const [step, setStep] = useState<"SELECT_BANK" | "CREDENTIALS" | "MFA" | "SELECT_ACCOUNT" | "SUCCESS">("SELECT_BANK");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<PlaidBank | null>(null);
  const [username, setUsername] = useState<string>("user_good");
  const [password, setPassword] = useState<string>("pass_good");
  const [mfaCode, setMfaCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("Operating Chequing (*4928)");

  useEffect(() => {
    if (isOpen) {
      setStep("SELECT_BANK");
      setSearchQuery("");
      setSelectedBank(null);
      setIsLoading(false);
      setMfaCode("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredBanks = CANADIAN_BANKS.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBank = (bank: PlaidBank) => {
    setSelectedBank(bank);
    setStep("CREDENTIALS");
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("MFA");
    }, 1200);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("SELECT_ACCOUNT");
    }, 1000);
  };

  const handleAccountConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("SUCCESS");
      setTimeout(() => {
        onSuccess({
          institution: selectedBank?.name || "RBC Royal Bank",
          accountNumber: "004-9281-4820",
          balance: 48950.00
        });
      }, 1200);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Plaid Header Bar */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {step !== "SELECT_BANK" && step !== "SUCCESS" && (
              <button
                onClick={() => {
                  if (step === "CREDENTIALS") setStep("SELECT_BANK");
                  if (step === "MFA") setStep("CREDENTIALS");
                  if (step === "SELECT_ACCOUNT") setStep("MFA");
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center space-x-1.5">
              <div className="w-5 h-5 bg-white rounded flex items-center justify-center font-black text-[10px] text-black tracking-tighter">
                plaid
              </div>
              <span className="text-xs font-bold text-slate-300">Open Banking Secure Link</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              <Lock className="w-2.5 h-2.5" />
              <span>256-Bit SSL</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-100">

          {/* STEP 1: SELECT INSTITUTION */}
          {step === "SELECT_BANK" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-white">Sélectionnez votre Institution</h3>
                <p className="text-xs text-slate-400">
                  Connectez votre compte d'affaires pour vérification instantanée des liquidités (aucun relevé papier requis).
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une banque canadienne..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Popular Banks Grid */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Institutions Populaires au Canada
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => handleSelectBank(bank)}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-800/60 transition text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-lg">
                          {bank.logo}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                            {bank.name}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Connexion directe API Open Banking
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 text-center flex items-center justify-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vos identifiants ne sont jamais stockés. Chiffrement bancaire de bout en bout.</span>
              </div>
            </div>
          )}

          {/* STEP 2: CREDENTIALS LOGIN */}
          {step === "CREDENTIALS" && selectedBank && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-2xl shadow-lg">
                  {selectedBank.logo}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Connexion à {selectedBank.name}</h3>
                  <p className="text-xs text-slate-400">
                    Saisissez vos identifiants d'accès bancaire en ligne entreprise.
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Nom d'utilisateur / Numéro de carte d'accès
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Mot de passe / NIP
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-start space-x-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Connexion en mode lecture seule (Read-Only). Apex Capital analyse uniquement les flux 90 jours pour votre approbation.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sécurisation de la session bancaire...</span>
                  </>
                ) : (
                  <>
                    <span>Continuer vers la vérification</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: 2FA MFA CODE */}
          {step === "MFA" && (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Authentification à 2 Facteurs (2FA)</h3>
                  <p className="text-xs text-slate-400">
                    Un code de sécurité sécurisé a été envoyé par SMS à votre numéro enregistré.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-center">
                <label className="block text-xs text-slate-300 font-semibold">
                  Entrez le code à 6 chiffres
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="133700"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-36 mx-auto bg-slate-900 border-2 border-emerald-500/50 rounded-lg px-3 py-2 text-center font-mono text-lg font-bold text-white tracking-widest focus:outline-none focus:border-emerald-400"
                />
                <div className="text-[10px] text-slate-500">
                  (Test Sandbox : vous pouvez entrer n'importe quel code à 6 chiffres)
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validation du code bancaire...</span>
                  </>
                ) : (
                  <span>Confirmer le code</span>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: SELECT ACCOUNT */}
          {step === "SELECT_ACCOUNT" && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white">Sélectionnez le Compte Principal</h3>
                <p className="text-xs text-slate-400">
                  Choisissez le compte d'opérations sur lequel vos ventes commerciales sont déposées.
                </p>
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => setSelectedAccount("Compte Opérations Commerciales (*4928)")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedAccount.includes("4928")
                      ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <span>Compte Opérations Courantes (CAD)</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                        Recommandé
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Transit: 00412 | Folio: 4928-109
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-emerald-400">48 950,00 $ CAD</div>
                    <div className="text-[9px] text-slate-500">Solde disponible</div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedAccount("Compte Épargne Entreprise (*1104)")}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    selectedAccount.includes("1104")
                      ? "bg-emerald-950/40 border-emerald-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-300">Compte Réserve / Épargne (CAD)</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">Folio: 1104-883</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-300">12 400,00 $ CAD</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAccountConfirm}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Extraction des flux 90 jours...</span>
                  </>
                ) : (
                  <span>Autoriser la synchronisation instantanée</span>
                )}
              </button>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === "SUCCESS" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">Connexion Réussie !</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Les 90 derniers jours de relevés bancaires ont été transmis au moteur de souscription.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calcul automatique des offres de crédit en cours...</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
