import InvoiceForm from "@/components/InvoiceForm";
import { FilePlus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouveau Document — SoluFacture",
  description: "Créez une facture ou un proforma professionnel en quelques clics.",
};

export default function CreateInvoicePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <FilePlus className="w-4 h-4" />
            <span>Créer un nouveau document</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Nouvelle Facture / Proforma
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Remplissez les informations ci-dessous pour générer votre document.
          </p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Brouillon
          </span>
        </div>
      </div>

      {/* The form — no onSubmit prop passed from Server Component
          (App Router rule: functions cannot cross the Server→Client boundary).
          InvoiceForm handles submission internally. */}
      <InvoiceForm />
    </div>
  );
}
