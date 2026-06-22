// ================================================================
// SoluFacture — Utilitaire d'impression / export PDF
// Génère une fenêtre d'impression dédiée sans quitter la page.
// ================================================================

import type { Invoice } from "@/types";
import { EMETTEUR } from "./invoices-data";

function formatMoney(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Ouvre une fenêtre d'impression temporaire avec la facture mise en page,
 * déclenche window.print(), puis ferme la fenêtre.
 * N'affecte pas la page courante.
 */
export function printInvoice(invoice: Invoice): void {
  const statutLabel =
    invoice.statut === "PAYEE"
      ? "Payée"
      : invoice.statut === "EN_ATTENTE"
      ? "En attente"
      : "Annulée";

  const typeLabel =
    invoice.type === "PROFORMA" ? "Facture Proforma" : "Facture";

  const itemsHTML = invoice.items
    .map(
      (item, idx) => `
      <tr style="background:${idx % 2 === 0 ? "#ffffff" : "#f8fafc"}">
        <td style="padding:10px 5px;font-size:11pt;color:#1e293b;">${item.designation}</td>
        <td style="padding:10px 5px;text-align:center;font-size:11pt;color:#475569;">${item.quantite}</td>
        <td style="padding:10px 5px;text-align:right;font-size:11pt;color:#475569;">${formatMoney(item.prixUnitaireHT)} FCFA</td>
        <td style="padding:10px 5px;text-align:right;font-size:11pt;font-weight:600;color:#0f172a;">${formatMoney(item.quantite * item.prixUnitaireHT)} FCFA</td>
      </tr>`
    )
    .join("");

  const proformaNote =
    invoice.type === "PROFORMA"
      ? `<p style="font-style:italic;color:#64748b;font-size:9pt;margin-top:6px;">
           Ce document est une facture proforma et ne constitue pas une demande de paiement.
           Il est valable jusqu'au ${formatDate(invoice.dateEcheance)}.
         </p>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${invoice.numeroFacture}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', Arial, sans-serif;
      font-size: 11pt;
      color: #1e293b;
      background: #fff;
      padding: 1.5cm 2cm;
    }

    /* ── EN-TÊTE ── */
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0369a1 100%);
      border-radius: 12px;
      padding: 28px 32px;
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-left .badges { display: flex; gap: 8px; margin-bottom: 10px; }
    .badge {
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 9pt;
      font-weight: 600;
      border: 1px solid rgba(255,255,255,0.3);
      color: #e0f2fe;
    }
    .badge-type { background: rgba(255,255,255,0.1); }
    .badge-statut { background: rgba(16,185,129,0.2); color: #6ee7b7; border-color: rgba(16,185,129,0.3); }
    .invoice-number {
      font-size: 28pt;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      font-family: monospace;
    }
    .invoice-date { color: #93c5fd; font-size: 10pt; margin-top: 6px; }
    .header-right { text-align: right; }
    .company-name { font-size: 13pt; font-weight: 700; color: #fff; }
    .company-sub { font-size: 9pt; color: #93c5fd; margin-top: 4px; line-height: 1.6; }

    /* ── PARTIES ── */
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    .party-block { padding: 16px 20px; border: 1px solid #e2e8f0; border-radius: 12px; }
    .party-label {
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .party-name { font-size: 12pt; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
    .party-info { font-size: 9.5pt; color: #475569; line-height: 1.7; }
    .party-email { color: #0369a1; }

    /* ── MÉTADONNÉES ── */
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      margin-bottom: 24px;
      overflow: hidden;
    }
    .meta-item {
      padding: 12px 16px;
      border-right: 1px solid #e2e8f0;
    }
    .meta-item:last-child { border-right: none; }
    .meta-label { font-size: 8pt; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .meta-value { font-size: 11pt; font-weight: 700; color: #0f172a; }

    /* ── TABLEAU ── */
    .section-title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .items-table thead tr { background: #f8fafc; }
    .items-table th {
      padding: 10px 16px;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      border-bottom: 1px solid #e2e8f0;
      text-align: left;
    }
    .items-table th.right { text-align: right; }
    .items-table th.center { text-align: center; }
    .items-table td { border-bottom: 1px solid #f1f5f9; }
    .items-table tbody tr:last-child td { border-bottom: none; }

    /* ── TOTAUX ── */
    .totals-wrapper { display: flex; justify-content: flex-end; margin-bottom: 28px; }
    .totals-box {
      width: 350px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      border-bottom: 1px solid #f1f5f9;
      background: #f8fafc;
    }
    .totals-row.ttc {
      background: #eff6ff;
      border-bottom: none;
      padding: 14px 16px;
    }
    .totals-label { font-size: 10pt; color: #475569; }
    .totals-label.bold { font-size: 12pt; font-weight: 700; color: #0f172a; }
    .totals-value { font-size: 10pt; font-weight: 600; color: #0f172a; }
    .totals-value.ttc { font-size: 14pt; font-weight: 800; color: #0369a1; }

    /* ── PIED ── */
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      font-size: 9pt;
      color: #94a3b8;
      line-height: 1.7;
    }
    .footer strong { color: #475569; }
    .footer-center { text-align: center; margin-top: 12px; font-weight: 600; color: #64748b; }

    @media print {
      body { padding: 0; }
      @page { margin: 1.2cm; size: A4; }
    }
  </style>
</head>
<body>
  <!-- EN-TÊTE -->
  <div class="header">
    <div class="header-left">
      <div class="badges">
        <span class="badge badge-type">${typeLabel}</span>
        <span class="badge badge-statut">${statutLabel}</span>
      </div>
      <div class="invoice-number">${invoice.numeroFacture}</div>
      <div class="invoice-date">Émis le ${formatDate(invoice.dateEmission)}</div>
    </div>
    <div class="header-right">
      <div class="company-name">${EMETTEUR.nom}</div>
      <div class="company-sub">
        ${EMETTEUR.email}<br/>
        ${EMETTEUR.telephone}
      </div>
    </div>
  </div>

  <!-- ÉMETTEUR / CLIENT -->
  <div class="parties">
    <div class="party-block">
      <div class="party-label">Émetteur</div>
      <div class="party-name">${EMETTEUR.nom}</div>
      <div class="party-info">
        ${EMETTEUR.adresse}<br/>
        NINEA : ${EMETTEUR.ninea}<br/>
        RC : ${EMETTEUR.rc}<br/>
        ${EMETTEUR.telephone}<br/>
        <span class="party-email">${EMETTEUR.email}</span>
      </div>
    </div>
    <div class="party-block">
      <div class="party-label">Facturé à</div>
      <div class="party-name">${invoice.client.raisonSociale}</div>
      <div class="party-info">
        ${invoice.client.adresse}<br/>
        ${invoice.client.telephone}<br/>
        <span class="party-email">${invoice.client.email}</span>
      </div>
    </div>
  </div>

  <!-- MÉTADONNÉES -->
  <div class="meta-grid">
    <div class="meta-item">
      <div class="meta-label">Numéro</div>
      <div class="meta-value">${invoice.numeroFacture}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Date d'émission</div>
      <div class="meta-value">${formatDate(invoice.dateEmission)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Échéance</div>
      <div class="meta-value">${formatDate(invoice.dateEcheance)}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">TVA applicable</div>
      <div class="meta-value">${(invoice.tauxTVA * 100).toFixed(0)}%</div>
    </div>
  </div>

  <!-- ARTICLES -->
  <div class="section-title">Détail des prestations</div>
  <table class="items-table">
    <thead>
      <tr>
        <th>Désignation</th>
        <th class="center">Qté</th>
        <th class="right">Prix unit. HT</th>
        <th class="right">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHTML}
    </tbody>
  </table>

  <!-- TOTAUX -->
  <div class="totals-wrapper">
    <div class="totals-box">
      <div class="totals-row">
        <span class="totals-label">Total HT</span>
        <span class="totals-value">${formatMoney(invoice.totalHT)} FCFA</span>
      </div>
      <div class="totals-row">
        <span class="totals-label">TVA (${(invoice.tauxTVA * 100).toFixed(0)}%)</span>
        <span class="totals-value">${formatMoney(invoice.totalTVA)} FCFA</span>
      </div>
      <div class="totals-row ttc">
        <span class="totals-label bold">Total TTC</span>
        <span class="totals-value ttc">${formatMoney(invoice.totalTTC)} FCFA</span>
      </div>
    </div>
  </div>

  <!-- PIED -->
  <div class="footer">
    <p>
      Arrêtée la présente ${invoice.type === "PROFORMA" ? "facture proforma" : "facture"} à la somme de
      <strong>${formatMoney(invoice.totalTTC)} FCFA TTC</strong>.
    </p>
    ${proformaNote}
    <p style="margin-top:6px;">En cas de retard de paiement, des pénalités de retard seront appliquées conformément à la législation en vigueur.</p>
    <div class="footer-center">Merci pour votre confiance — ${EMETTEUR.nom}</div>
  </div>

  <script>
    window.onload = function() {
      window.print();
      // Ferme la fenêtre après l'impression (ou annulation)
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    // Fallback si les popups sont bloqués
    alert("Veuillez autoriser les fenêtres popup pour télécharger le PDF.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}
