// ============================================================
// SoluFacture — Centralized Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  nom: string;
}

export interface Client {
  id: string;
  raisonSociale: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface InvoiceItem {
  id: string;
  designation: string;
  quantite: number;
  prixUnitaireHT: number;
}

export type InvoiceType = "FACTURE" | "PROFORMA";

export type InvoiceStatut = "PAYEE" | "EN_ATTENTE" | "ANNULEE";

export interface Invoice {
  id: string;
  numeroFacture: string;
  type: InvoiceType;
  dateEmission: string; // ISO date string YYYY-MM-DD
  dateEcheance: string; // ISO date string YYYY-MM-DD
  statut: InvoiceStatut;
  tauxTVA: number; // e.g., 0.18
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  client: Client;
  items: InvoiceItem[];
}

export interface Emetteur {
  nom: string;
  adresse: string;
  ninea: string;
  rc: string;
  telephone: string;
  email: string;
}
