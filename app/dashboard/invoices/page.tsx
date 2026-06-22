"use client";

import { useState, useMemo } from "react";
import { FileText, Search, Filter, Download, Eye, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOCK_INVOICES } from "@/lib/invoices-data";
import { printInvoice } from "@/lib/print-invoice";
import type { InvoiceStatut, InvoiceType, Invoice } from "@/types";

// ── Helpers ────────────────────────────────────────────────────────
function formatMoney(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateFR(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Style maps ────────────────────────────────────────────────────
const STATUT_STYLES: Record<InvoiceStatut, string> = {
  PAYEE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  EN_ATTENTE: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  ANNULEE: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
};

const STATUT_LABELS: Record<InvoiceStatut, string> = {
  PAYEE: "Payée",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulée",
};

type FilterStatut = "ALL" | InvoiceStatut;
type FilterType = "ALL" | InvoiceType;

// ── Component ─────────────────────────────────────────────────────
export default function InvoicesPage() {
  const router = useRouter();

  // Filtres
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState<FilterStatut>("ALL");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Factures filtrées
  const filtered = useMemo(() => {
    return MOCK_INVOICES.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch =
        q === "" ||
        inv.numeroFacture.toLowerCase().includes(q) ||
        inv.client.raisonSociale.toLowerCase().includes(q);
      const matchStatut = filterStatut === "ALL" || inv.statut === filterStatut;
      const matchType = filterType === "ALL" || inv.type === filterType;
      return matchSearch && matchStatut && matchType;
    });
  }, [search, filterStatut, filterType]);

  // Navigation vers le détail
  function handleView(id: string) {
    router.push(`/dashboard/invoices/${encodeURIComponent(id)}`);
  }

  // Impression directe — ouvre une fenêtre de print temporaire, sans quitter la liste
  function handlePdf(invoice: Invoice) {
    printInvoice(invoice);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes Factures</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} / {MOCK_INVOICES.length} documents
          </p>
        </div>
        <Link
          href="/dashboard/create"
          id="btn-invoices-new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer self-start sm:self-auto transition-all duration-200 hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0369a1, #0284c7)" }}
        >
          <FileText className="w-4 h-4" />
          Nouveau document
        </Link>
      </div>

      {/* ── Toolbar ── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="invoice-search"
              type="search"
              placeholder="Rechercher par numéro, client…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700
                bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400
                text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
            />
          </div>

          {/* Bouton Filtres */}
          <button
            id="btn-toggle-filters"
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer
              ${showFilters
                ? "border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20"
                : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {(filterStatut !== "ALL" || filterType !== "ALL") && (
              <span className="w-2 h-2 rounded-full bg-sky-500" />
            )}
          </button>

          <button
            id="btn-export-invoices"
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Statut :</span>
            </div>
            {(["ALL", "PAYEE", "EN_ATTENTE", "ANNULEE"] as FilterStatut[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatut(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                  ${filterStatut === s
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-400"}`}
              >
                {s === "ALL" ? "Tous" : STATUT_LABELS[s as InvoiceStatut]}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Type :</span>
            </div>
            {(["ALL", "FACTURE", "PROFORMA"] as FilterType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                  ${filterType === t
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-sky-400"}`}
              >
                {t === "ALL" ? "Tous" : t === "FACTURE" ? "Facture" : "Proforma"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40">
                {["Numéro", "Type", "Client", "Montant TTC", "Statut", "Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-600">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucun document ne correspond à votre recherche.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150 cursor-pointer"
                    onClick={() => handleView(inv.id)}
                  >
                    <td className="px-6 py-4 font-mono font-medium text-sky-600 dark:text-sky-400">
                      {inv.numeroFacture}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full
                          ${inv.type === "FACTURE"
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                            : "bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800"}`}
                      >
                        {inv.type === "FACTURE" ? "Facture" : "Proforma"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                      {inv.client.raisonSociale}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300 tabular-nums font-medium">
                      {formatMoney(inv.totalTTC)} FCFA
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUT_STYLES[inv.statut]}`}>
                        {STATUT_LABELS[inv.statut]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {formatDateFR(inv.dateEmission)}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()} // empêche le clic de ligne
                      >
                        {/* Bouton Voir — navigue vers la page de détail */}
                        <button
                          id={`btn-view-${inv.id}`}
                          type="button"
                          onClick={() => handleView(inv.id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700
                            text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700
                            hover:text-slate-900 dark:hover:text-white transition-all duration-150 cursor-pointer"
                          title={`Voir le détail de ${inv.numeroFacture}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Voir
                        </button>

                        {/* Bouton PDF — impression directe sans quitter la page liste */}
                        <button
                          id={`btn-pdf-${inv.id}`}
                          type="button"
                          onClick={() => handlePdf(inv)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-sky-200 dark:border-sky-800
                            text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20
                            hover:text-sky-800 dark:hover:text-sky-300 transition-all duration-150 cursor-pointer"
                          title={`Imprimer / télécharger ${inv.numeroFacture} en PDF`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-xs text-slate-400">
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-slate-400">
              Cliquez sur une ligne pour voir le détail
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
