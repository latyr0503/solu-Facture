import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { getInvoiceById, EMETTEUR } from "@/lib/invoices-data";
import type { InvoiceStatut, InvoiceType } from "@/types";
import PrintButton from "./PrintButton";
import StatusChanger from "./StatusChanger";

// ── Types ──────────────────────────────────────────────────────────
interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Metadata dynamique ─────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const invoice = getInvoiceById(decodeURIComponent(id));
  if (!invoice) return { title: "Facture introuvable — SoluFacture" };
  return {
    title: `${invoice.numeroFacture} — SoluFacture`,
    description: `Détail du document ${invoice.numeroFacture} pour ${invoice.client.raisonSociale}`,
  };
}

// ── Helpers ────────────────────────────────────────────────────────
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

const STATUT_CONFIG: Record<
  InvoiceStatut,
  { label: string; icon: React.ElementType; className: string }
> = {
  PAYEE: {
    label: "Payée",
    icon: CheckCircle,
    className:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  },
  EN_ATTENTE: {
    label: "En attente",
    icon: Clock,
    className:
      "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  },
  ANNULEE: {
    label: "Annulée",
    icon: XCircle,
    className:
      "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
};

const TYPE_CONFIG: Record<InvoiceType, { label: string; className: string }> = {
  FACTURE: {
    label: "Facture",
    className:
      "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
  },
  PROFORMA: {
    label: "Facture Proforma",
    className:
      "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",
  },
};

// ── Page ───────────────────────────────────────────────────────────
export default async function InvoiceDetailPage({ params }: PageProps) {
  const { id } = await params;
  const invoice = getInvoiceById(decodeURIComponent(id));

  if (!invoice) notFound();

  const statut = STATUT_CONFIG[invoice.statut];
  const type = TYPE_CONFIG[invoice.type];
  const StatutIcon = statut.icon;

  return (
    <>
      {/* ── Contenu de la page (écran) ── */}
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Barre de navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux factures
          </Link>

          <PrintButton invoice={invoice} />
        </div>

        {/* Grille principale : document à gauche, sidebar à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* ── Document imprimable ── */}
        <div
          id="printable-invoice"
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
        >
          {/* ══ EN-TÊTE DU DOCUMENT ══ */}
          <div
            className="px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0369a1 100%)" }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${type.className} print:border print:border-slate-300`}>
                  {type.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statut.className}`}>
                  <StatutIcon className="w-3 h-3" />
                  {statut.label}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
                {invoice.numeroFacture}
              </h1>
              <p className="text-sky-300 text-sm mt-1">
                Émis le {formatDate(invoice.dateEmission)}
              </p>
            </div>

            {/* Logo / Nom entreprise */}
            <div className="text-right">
              <p className="text-white font-bold text-lg">{EMETTEUR.nom}</p>
              <p className="text-sky-300 text-sm">{EMETTEUR.email}</p>
              <p className="text-sky-300 text-sm">{EMETTEUR.telephone}</p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* ══ PARTIES : ÉMETTEUR / CLIENT ══ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Émetteur */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-sky-100 dark:bg-sky-900/30">
                    <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Émetteur
                  </h2>
                </div>
                <div className="pl-9 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{EMETTEUR.nom}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{EMETTEUR.adresse}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">NINEA : {EMETTEUR.ninea}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">RC : {EMETTEUR.rc}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{EMETTEUR.telephone}</p>
                  <p className="text-sm text-sky-600 dark:text-sky-400">{EMETTEUR.email}</p>
                </div>
              </div>

              {/* Client */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Facturé à
                  </h2>
                </div>
                <div className="pl-9 space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{invoice.client.raisonSociale}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.client.adresse}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.client.telephone}</p>
                  <p className="text-sm text-sky-600 dark:text-sky-400">{invoice.client.email}</p>
                </div>
              </div>
            </div>

            {/* ══ MÉTADONNÉES DU DOCUMENT ══ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              {[
                { icon: Hash, label: "Numéro", value: invoice.numeroFacture },
                { icon: Calendar, label: "Date d'émission", value: formatDate(invoice.dateEmission) },
                { icon: Calendar, label: "Échéance", value: formatDate(invoice.dateEcheance) },
                { icon: CheckCircle, label: "TVA applicable", value: `${(invoice.tauxTVA * 100).toFixed(0)}%` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Icon className="w-3 h-3" />
                    {label}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>

            {/* ══ TABLEAU DES ARTICLES ══ */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                Détail des prestations
              </h2>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Désignation
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-20">
                        Qté
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-36">
                        Prix unit. HT
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-36">
                        Total HT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {invoice.items.map((item, idx) => {
                      const lineTotal = item.quantite * item.prixUnitaireHT;
                      return (
                        <tr
                          key={item.id}
                          className={idx % 2 === 0 ? "bg-white dark:bg-transparent" : "bg-slate-50/50 dark:bg-slate-800/20"}
                        >
                          <td className="px-5 py-3.5 text-slate-800 dark:text-slate-200 font-medium">
                            {item.designation}
                          </td>
                          <td className="px-5 py-3.5 text-center text-slate-600 dark:text-slate-400 tabular-nums">
                            {item.quantite}
                          </td>
                          <td className="px-5 py-3.5 text-right text-slate-600 dark:text-slate-400 tabular-nums">
                            {formatMoney(item.prixUnitaireHT)} FCFA
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-slate-900 dark:text-white tabular-nums">
                            {formatMoney(lineTotal)} FCFA
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ══ RÉCAPITULATIF DES TOTAUX ══ */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total HT</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatMoney(invoice.totalHT)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-5 py-3 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      TVA ({(invoice.tauxTVA * 100).toFixed(0)}%)
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatMoney(invoice.totalTVA)} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-5 py-4 bg-sky-50 dark:bg-sky-900/20">
                    <span className="font-bold text-slate-900 dark:text-white">Total TTC</span>
                    <span className="text-xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                      {formatMoney(invoice.totalTTC)} FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

          {/* ══ MENTIONS LÉGALES ══ */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-400 dark:text-slate-500">
              <p>
                Arrêtée la présente {invoice.type === "PROFORMA" ? "facture proforma" : "facture"} à la somme de{" "}
                <strong className="text-slate-600 dark:text-slate-300">
                  {formatMoney(invoice.totalTTC)} FCFA TTC
                </strong>.
              </p>
              {invoice.type === "PROFORMA" && (
                <p className="italic">
                  Ce document est une facture proforma et ne constitue pas une demande de paiement.
                  Il est valable jusqu&apos;au {formatDate(invoice.dateEcheance)}.
                </p>
              )}
              <p>
                En cas de retard de paiement, des pénalités de retard seront appliquées conformément à la législation en vigueur.
              </p>
              <p className="text-center pt-2 font-medium text-slate-500 dark:text-slate-400">
                Merci pour votre confiance — {EMETTEUR.nom}
              </p>
            </div>
          </div>
        </div>
        {/* ───────────────────────────────────────────────────────
             SIDEBAR DROITE : Statut + Actions
        ─────────────────────────────────────────────────────── */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          {/* Changeur de statut */}
          <StatusChanger
            initialStatut={invoice.statut}
            invoiceNumber={invoice.numeroFacture}
          />

          {/* Bloc info rapide */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Informations</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Client</span>
                <span className="font-medium text-slate-900 dark:text-white text-right max-w-[140px] truncate">
                  {invoice.client.raisonSociale}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Total TTC</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                  {formatMoney(invoice.totalTTC)} FCFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Échéance</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatDate(invoice.dateEcheance)}
                </span>
              </div>
            </div>
          </div>

          {/* Bouton PDF dans la sidebar aussi */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Actions</h3>
            <PrintButton invoice={invoice} flexCol={true} />
          </div>
        </aside>

        </div>{/* fin grille */}

        {/* Bouton retour bas de page */}
        <div className="flex items-center">
          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la liste
          </Link>
        </div>
      </div>
    </>
  );
}
