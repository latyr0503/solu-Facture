"use client"

import { useState } from "react"
import { CheckCircle, Clock, XCircle, Check } from "lucide-react"
import type { InvoiceStatut } from "@/types"

// ── Config des statuts ────────────────────────────────────────────
const STATUTS: {
  value: InvoiceStatut
  label: string
  icon: React.ElementType
  activeClass: string
  ringClass: string
}[] = [
  {
    value: "EN_ATTENTE",
    label: "En attente",
    icon: Clock,
    activeClass: "bg-amber-500 text-white border-amber-500 shadow-amber-500/25",
    ringClass:
      "hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400",
  },
  {
    value: "PAYEE",
    label: "Payée",
    icon: CheckCircle,
    activeClass:
      "bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/25",
    ringClass:
      "hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400",
  },
  {
    value: "ANNULEE",
    label: "Annulée",
    icon: XCircle,
    activeClass: "bg-slate-500 text-white border-slate-500 shadow-slate-500/25",
    ringClass:
      "hover:border-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
  },
]

interface StatusChangerProps {
  /** Statut initial issu de la base de données */
  initialStatut: InvoiceStatut
  /** Numéro du document, pour le feedback utilisateur */
  invoiceNumber: string
}

/**
 * Client Component — permet de changer le statut d'une facture
 * directement depuis la page de détail. State local (pas de backend).
 */
export default function StatusChanger({
  initialStatut,
  invoiceNumber,
}: StatusChangerProps) {
  const [statut, setStatut] = useState<InvoiceStatut>(initialStatut)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatut: InvoiceStatut) {
    if (newStatut === statut) return
    setStatut(newStatut)
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    // Simule un appel API
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    // Masque le feedback après 3s
    setTimeout(() => setSaved(false), 3000)
    console.log(
      `[SoluFacture] Statut de ${invoiceNumber} mis à jour → ${statut}`
    )
  }

  const currentConfig = STATUTS.find((s) => s.value === statut)!
  const CurrentIcon = currentConfig.icon
  const hasChanged = statut !== initialStatut

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      {/* Titre */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Statut du document
        </h3>
        {/* Statut actuel */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            statut === "PAYEE"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
              : statut === "EN_ATTENTE"
                ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <CurrentIcon className="h-3 w-3" />
          {currentConfig.label}
        </span>
      </div>

      {/* Bouton-groupe de sélection */}
      <div className="grid grid-cols-3 gap-2">
        {STATUTS.map(({ value, label, icon: Icon, activeClass, ringClass }) => {
          const isActive = statut === value
          return (
            <button
              key={value}
              id={`btn-statut-${value.toLowerCase()}`}
              type="button"
              onClick={() => handleChange(value)}
              className={`relative flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? `${activeClass} shadow-lg`
                  : `border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400 ${ringClass}`
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Bouton sauvegarder */}
      <div className="flex flex-col gap-3">
        <button
          id="btn-save-statut"
          type="button"
          onClick={handleSave}
          disabled={!hasChanged || saving}
          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
            hasChanged
              ? "bg-sky-600 text-white hover:bg-sky-700"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800"
          }`}
        >
          {saving ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Enregistrement…
            </>
          ) : (
            "Enregistrer le statut"
          )}
        </button>

        {/* Feedback de succès */}
        {saved && (
          <div className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-800 dark:bg-emerald-900/20">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Sauvegardé
            </span>
          </div>
        )}
      </div>

      {/* Avertissement si non sauvegardé */}
      {hasChanged && !saving && !saved && (
        <p className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          Modification non sauvegardée
        </p>
      )}
    </div>
  )
}
