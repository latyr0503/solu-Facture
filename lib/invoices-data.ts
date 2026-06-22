// ================================================================
// SoluFacture — Shared Mock Invoice Data
// Source unique de vérité pour la liste ET les pages de détail.
// ================================================================

import type { Invoice } from "@/types";

export const EMETTEUR = {
  nom: "Xarala Digital Services SARL",
  adresse: "12, Rue Carnot, Dakar – Sénégal",
  ninea: "007654321 2H1",
  rc: "SN-DKR-2021-A-1234",
  telephone: "+221 33 821 00 00",
  email: "facturation@xarala.sn",
};

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "FAC-2026-028",
    numeroFacture: "FAC-2026-028",
    type: "FACTURE",
    dateEmission: "2026-06-20",
    dateEcheance: "2026-07-20",
    statut: "PAYEE",
    tauxTVA: 0.18,
    totalHT: 850000,
    totalTVA: 153000,
    totalTTC: 1003000,
    client: {
      id: "cli-001",
      raisonSociale: "Gaindé Technologies",
      adresse: "Avenue Cheikh Anta Diop, Dakar",
      telephone: "+221 77 123 45 67",
      email: "contact@gainde-tech.sn",
    },
    items: [
      { id: "i1", designation: "Développement application web (React/Next.js)", quantite: 1, prixUnitaireHT: 500000 },
      { id: "i2", designation: "Intégration API REST & documentation", quantite: 1, prixUnitaireHT: 200000 },
      { id: "i3", designation: "Formation utilisateurs (2 jours)", quantite: 1, prixUnitaireHT: 150000 },
    ],
  },
  {
    id: "PRO-2026-027",
    numeroFacture: "PRO-2026-027",
    type: "PROFORMA",
    dateEmission: "2026-06-18",
    dateEcheance: "2026-07-18",
    statut: "EN_ATTENTE",
    tauxTVA: 0.18,
    totalHT: 319652,
    totalTVA: 57537,
    totalTTC: 377190,
    client: {
      id: "cli-002",
      raisonSociale: "Teranga Services SARL",
      adresse: "Rue 10 × 13, Médina, Dakar",
      telephone: "+221 33 867 88 99",
      email: "direction@teranga-services.sn",
    },
    items: [
      { id: "i4", designation: "Audit système d'information", quantite: 1, prixUnitaireHT: 180000 },
      { id: "i5", designation: "Rapport de recommandations", quantite: 1, prixUnitaireHT: 80000 },
      { id: "i6", designation: "Déplacement & frais de mission", quantite: 3, prixUnitaireHT: 19884 },
    ],
  },
  {
    id: "FAC-2026-026",
    numeroFacture: "FAC-2026-026",
    type: "FACTURE",
    dateEmission: "2026-06-15",
    dateEcheance: "2026-07-15",
    statut: "PAYEE",
    tauxTVA: 0.18,
    totalHT: 1200000,
    totalTVA: 216000,
    totalTTC: 1416000,
    client: {
      id: "cli-003",
      raisonSociale: "Digital Dakar Agency",
      adresse: "Plateau, Dakar",
      telephone: "+221 77 456 78 90",
      email: "billing@digitaldakar.agency",
    },
    items: [
      { id: "i7", designation: "Refonte identité visuelle & charte graphique", quantite: 1, prixUnitaireHT: 350000 },
      { id: "i8", designation: "Création site vitrine (5 pages)", quantite: 1, prixUnitaireHT: 450000 },
      { id: "i9", designation: "Campagne réseaux sociaux (3 mois)", quantite: 3, prixUnitaireHT: 133333 },
    ],
  },
  {
    id: "PRO-2026-025",
    numeroFacture: "PRO-2026-025",
    type: "PROFORMA",
    dateEmission: "2026-06-12",
    dateEcheance: "2026-07-12",
    statut: "EN_ATTENTE",
    tauxTVA: 0.18,
    totalHT: 240000,
    totalTVA: 43200,
    totalTTC: 283200,
    client: {
      id: "cli-004",
      raisonSociale: "SenAgri Consulting",
      adresse: "Thiès, Sénégal",
      telephone: "+221 70 234 56 78",
      email: "admin@senagri.sn",
    },
    items: [
      { id: "i10", designation: "Formation logiciels agricoles", quantite: 2, prixUnitaireHT: 80000 },
      { id: "i11", designation: "Maintenance annuelle logiciel", quantite: 1, prixUnitaireHT: 80000 },
    ],
  },
  {
    id: "FAC-2026-024",
    numeroFacture: "FAC-2026-024",
    type: "FACTURE",
    dateEmission: "2026-06-08",
    dateEcheance: "2026-07-08",
    statut: "ANNULEE",
    tauxTVA: 0.18,
    totalHT: 560750,
    totalTVA: 100935,
    totalTTC: 661685,
    client: {
      id: "cli-005",
      raisonSociale: "Baobab Holding Group",
      adresse: "Almadies, Dakar",
      telephone: "+221 33 820 11 22",
      email: "facturation@baobab-holding.sn",
    },
    items: [
      { id: "i12", designation: "Conseil stratégique (10 heures)", quantite: 10, prixUnitaireHT: 45000 },
      { id: "i13", designation: "Rédaction contrats commerciaux", quantite: 3, prixUnitaireHT: 35000 },
      { id: "i14", designation: "Veille juridique trimestrielle", quantite: 1, prixUnitaireHT: 115750 },
    ],
  },
  {
    id: "FAC-2026-023",
    numeroFacture: "FAC-2026-023",
    type: "FACTURE",
    dateEmission: "2026-06-02",
    dateEcheance: "2026-07-02",
    statut: "PAYEE",
    tauxTVA: 0.18,
    totalHT: 1800000,
    totalTVA: 324000,
    totalTTC: 2124000,
    client: {
      id: "cli-006",
      raisonSociale: "Sunugal Finance",
      adresse: "Rue du Docteur Thèze, Dakar",
      telephone: "+221 33 889 00 11",
      email: "comptabilite@sunugal-finance.sn",
    },
    items: [
      { id: "i15", designation: "Plateforme de gestion financière (licence annuelle)", quantite: 1, prixUnitaireHT: 1200000 },
      { id: "i16", designation: "Déploiement & configuration serveur", quantite: 1, prixUnitaireHT: 350000 },
      { id: "i17", designation: "Support technique premium (12 mois)", quantite: 12, prixUnitaireHT: 20833 },
    ],
  },
  {
    id: "PRO-2026-022",
    numeroFacture: "PRO-2026-022",
    type: "PROFORMA",
    dateEmission: "2026-05-28",
    dateEcheance: "2026-06-28",
    statut: "EN_ATTENTE",
    tauxTVA: 0.18,
    totalHT: 400000,
    totalTVA: 72000,
    totalTTC: 472000,
    client: {
      id: "cli-007",
      raisonSociale: "Thiès Innovation Hub",
      adresse: "Zone Industrielle de Thiès",
      telephone: "+221 77 890 12 34",
      email: "tech@thies-hub.sn",
    },
    items: [
      { id: "i18", designation: "Ateliers de formation développement (5 jours)", quantite: 5, prixUnitaireHT: 60000 },
      { id: "i19", designation: "Supports pédagogiques & licences outils", quantite: 20, prixUnitaireHT: 5000 },
    ],
  },
];

/** Recherche une facture par son id (= numeroFacture) */
export function getInvoiceById(id: string): Invoice | undefined {
  return MOCK_INVOICES.find((inv) => inv.id === id);
}
