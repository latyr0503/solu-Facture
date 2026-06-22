"use client";

import { Download, Printer } from "lucide-react";
import { useState } from "react";
import { printInvoice } from "@/lib/print-invoice";
import type { Invoice } from "@/types";

interface PrintButtonProps {
  invoice: Invoice;
  flexCol?: boolean;
}

/**
 * Client Component isolé — déclenche printInvoice() pour générer
 * une fenêtre d'impression dédiée, identique au bouton PDF de la liste.
 * N'affecte pas la page de détail.
 */
export default function PrintButton({ invoice, flexCol = false }: PrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  function handlePrint() {
    setIsPrinting(true);
    setTimeout(() => {
      printInvoice(invoice);
      setIsPrinting(false);
    }, 100);
  }

  return (
    <div className={`flex ${flexCol ? "flex-col gap-3" : "flex-row items-center gap-3"} print:hidden`}>
      {/* Bouton Imprimer */}
      <button
        id="btn-print-invoice"
        type="button"
        onClick={handlePrint}
        disabled={isPrinting}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300
          hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer disabled:opacity-60"
        aria-label={`Imprimer ${invoice.numeroFacture}`}
      >
        <Printer className="w-4 h-4" />
        Imprimer
      </button>

      {/* Bouton Télécharger PDF */}
      <button
        id="btn-download-pdf"
        type="button"
        onClick={handlePrint}
        disabled={isPrinting}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white
          transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #0369a1, #0284c7)" }}
        aria-label={`Télécharger le PDF de ${invoice.numeroFacture}`}
      >
        <Download className="w-4 h-4" />
        {isPrinting ? "Préparation…" : "Télécharger PDF"}
      </button>
    </div>
  );
}
