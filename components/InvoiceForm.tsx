"use client";

import { useState, useMemo, useCallback, useId } from "react";
import { Trash2, Plus, FileText, Building2, User, Hash, Calendar, ChevronDown } from "lucide-react";
import type { Client, InvoiceItem, InvoiceType, InvoiceStatut, Emetteur } from "@/types";
import { cn } from "@/lib/utils";

// ── Constants ─────────────────────────────────────────────────────
const TAUX_TVA = 0.18;

const EMETTEUR_DEFAUT: Emetteur = {
  nom: "Xarala Digital Services SARL",
  adresse: "12, Rue Carnot, Dakar – Sénégal",
  ninea: "007654321 2H1",
  rc: "SN-DKR-2021-A-1234",
  telephone: "+221 33 821 00 00",
  email: "facturation@xarala.sn",
};

// ── Helper: generate unique item id ───────────────────────────────
let itemCounter = 0;
function newItemId() {
  itemCounter += 1;
  return `item-${Date.now()}-${itemCounter}`;
}

function newEmptyItem(): InvoiceItem {
  return { id: newItemId(), designation: "", quantite: 1, prixUnitaireHT: 0 };
}

// ── Helper: format money ───────────────────────────────────────────
function formatMoney(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ── Helper: today / future dates ─────────────────────────────────
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function futureDateISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ── Helper: generate document number ─────────────────────────────
function generateNumero(type: InvoiceType, index: number): string {
  const prefix = type === "PROFORMA" ? "PRO" : "FAC";
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(index).padStart(3, "0")}`;
}

// ── Sub-component: Section Header ─────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-900/30">
        <Icon className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Sub-component: Form Field ─────────────────────────────────────
function Field({
  label,
  id,
  children,
  className,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 " +
  "bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent " +
  "text-sm transition-all duration-200";

// ── Sub-component: Invoice Items Table ────────────────────────────
interface ItemsTableProps {
  items: InvoiceItem[];
  onItemChange: (id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) => void;
  onItemRemove: (id: string) => void;
  onItemAdd: () => void;
}

function ItemsTable({ items, onItemChange, onItemRemove, onItemAdd }: ItemsTableProps) {
  return (
    <div className="space-y-4">
      {/* Desktop table header */}
      <div className="hidden md:grid grid-cols-[1fr_100px_140px_120px_44px] gap-3 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
        {["Désignation", "Qté", "Prix unit. HT", "Total HT", ""].map((h) => (
          <span key={h} className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const totalHT = parseFloat(
            (item.quantite * item.prixUnitaireHT).toFixed(2)
          );
          return (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_120px_44px] gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:border-sky-300 dark:hover:border-sky-700 transition-colors duration-200"
            >
              {/* Designation */}
              <div className="space-y-1">
                <label className="md:hidden text-xs font-medium text-slate-500 dark:text-slate-400">Désignation</label>
                <input
                  id={`item-designation-${item.id}`}
                  type="text"
                  placeholder={`Prestation ${idx + 1}`}
                  value={item.designation}
                  onChange={(e) => onItemChange(item.id, "designation", e.target.value)}
                  className={inputClass}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="md:hidden text-xs font-medium text-slate-500 dark:text-slate-400">Quantité</label>
                <input
                  id={`item-quantite-${item.id}`}
                  type="number"
                  min={1}
                  step={1}
                  value={item.quantite}
                  onChange={(e) => onItemChange(item.id, "quantite", parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>

              {/* Unit price */}
              <div className="space-y-1">
                <label className="md:hidden text-xs font-medium text-slate-500 dark:text-slate-400">Prix unit. HT</label>
                <div className="relative">
                  <input
                    id={`item-prix-${item.id}`}
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.prixUnitaireHT}
                    onChange={(e) => onItemChange(item.id, "prixUnitaireHT", parseFloat(e.target.value) || 0)}
                    className={cn(inputClass, "pr-12")}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Total HT (read-only) */}
              <div className="space-y-1">
                <label className="md:hidden text-xs font-medium text-slate-500 dark:text-slate-400">Total HT</label>
                <div className="flex items-center px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
                  <span className="text-sm font-semibold text-slate-800 dark:text-white tabular-nums">
                    {formatMoney(totalHT)}
                  </span>
                </div>
              </div>

              {/* Delete */}
              <div className="flex items-center justify-end md:justify-center">
                <button
                  id={`btn-remove-item-${item.id}`}
                  type="button"
                  onClick={() => onItemRemove(item.id)}
                  disabled={items.length <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Supprimer la ligne"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add item */}
      <button
        id="btn-add-item"
        type="button"
        onClick={onItemAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-sky-600 dark:text-sky-400
          border-2 border-dashed border-sky-300 dark:border-sky-700 hover:border-sky-500 dark:hover:border-sky-500
          hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200 cursor-pointer w-full justify-center"
      >
        <Plus className="w-4 h-4" />
        Ajouter une ligne
      </button>
    </div>
  );
}

// ── Totals Summary ────────────────────────────────────────────────
interface TotalsProps {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  tauxTVA: number;
  applyTVA: boolean;
  onToggleTVA: (apply: boolean) => void;
}

function TotalsPanel({ totalHT, totalTVA, totalTTC, tauxTVA, applyTVA, onToggleTVA }: TotalsProps) {
  return (
    <div className="ml-auto w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 overflow-hidden">
      <div className="px-5 py-4 space-y-3">
        <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
          <span>Total HT</span>
          <span className="font-medium text-slate-900 dark:text-white tabular-nums">{formatMoney(totalHT)} FCFA</span>
        </div>
        
        {/* Toggle TVA */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={applyTVA}
                onChange={(e) => onToggleTVA(e.target.checked)}
              />
              <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-sky-500 transition-colors"></div>
            </div>
            <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              Appliquer TVA ({(tauxTVA * 100).toFixed(0)}%)
            </span>
          </label>
          <span className={cn(
            "font-medium tabular-nums transition-opacity", 
            applyTVA ? "text-slate-900 dark:text-white" : "text-slate-400 line-through opacity-50"
          )}>
            {formatMoney(totalHT * tauxTVA)} FCFA
          </span>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-slate-900 dark:text-white">Total TTC</span>
          <span className="text-xl font-bold text-sky-600 dark:text-sky-400 tabular-nums">
            {formatMoney(totalTTC)} FCFA
          </span>
        </div>
      </div>
      <div className="px-5 py-3 bg-sky-50 dark:bg-sky-900/20 border-t border-sky-100 dark:border-sky-800">
        <p className="text-xs text-sky-700 dark:text-sky-400 text-center">
          Arrêtée la présente facture à la somme de{" "}
          <strong>{formatMoney(totalTTC)} FCFA TTC</strong>
        </p>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function InvoiceForm() {
  const uid = useId();

  // ── Document metadata state ──
  const [invoiceType, setInvoiceType] = useState<InvoiceType>("PROFORMA");
  const [statut, setStatut] = useState<InvoiceStatut>("EN_ATTENTE");
  const [dateEmission, setDateEmission] = useState<string>(todayISO());
  const [dateEcheance, setDateEcheance] = useState<string>(futureDateISO(30));
  const [docIndex] = useState<number>(1);
  const [applyTVA, setApplyTVA] = useState<boolean>(true);

  // ── Client state ──
  const [client, setClient] = useState<Omit<Client, "id">>({
    raisonSociale: "",
    adresse: "",
    telephone: "",
    email: "",
  });

  // ── Items state ──
  const [items, setItems] = useState<InvoiceItem[]>([newEmptyItem()]);

  // ── Submission state ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // ── Computed totals (memo) ────────────────────────────────────
  const totals = useMemo(() => {
    const totalHT = parseFloat(
      items
        .reduce((acc, item) => acc + item.quantite * item.prixUnitaireHT, 0)
        .toFixed(2)
    );
    const totalTVA = applyTVA ? parseFloat((totalHT * TAUX_TVA).toFixed(2)) : 0;
    const totalTTC = parseFloat((totalHT + totalTVA).toFixed(2));
    return { totalHT, totalTVA, totalTTC };
  }, [items, applyTVA]);

  // ── Auto-generated document number ───────────────────────────
  const numeroDocument = useMemo(
    () => generateNumero(invoiceType, docIndex),
    [invoiceType, docIndex]
  );

  // ── Handlers ─────────────────────────────────────────────────
  const handleClientChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setClient((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleItemChange = useCallback(
    (id: string, field: keyof Omit<InvoiceItem, "id">, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const handleItemAdd = useCallback(() => {
    setItems((prev) => [...prev, newEmptyItem()]);
  }, []);

  const handleItemRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1000));
      // Log generated document (in a real app this would call an API)
      console.log("Document généré :", {
        type: invoiceType,
        statut,
        applyTVA,
        client: { id: `client-${Date.now()}`, ...client },
        items,
        ...totals,
      });
      setIsSubmitting(false);
      setSubmitted(true);
    },
    [invoiceType, client, items, totals]
  );

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
          <FileText className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Document créé avec succès !</h3>
          <p className="text-slate-500 mt-1">Le {invoiceType === "PROFORMA" ? "Proforma" : "Facture"} <strong>{numeroDocument}</strong> a été généré.</p>
        </div>
        <button
          id="btn-new-document"
          type="button"
          onClick={() => {
            setSubmitted(false);
            setItems([newEmptyItem()]);
            setClient({ raisonSociale: "", adresse: "", telephone: "", email: "" });
          }}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 transition-colors cursor-pointer"
        >
          Créer un nouveau document
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* ══ 1. ÉMETTEUR ══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <SectionHeader icon={Building2} title="Émetteur" subtitle="Informations de votre entreprise" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {([
            { label: "Raison sociale", value: EMETTEUR_DEFAUT.nom },
            { label: "Adresse", value: EMETTEUR_DEFAUT.adresse },
            { label: "NINEA", value: EMETTEUR_DEFAUT.ninea },
            { label: "Numéro RC", value: EMETTEUR_DEFAUT.rc },
            { label: "Téléphone", value: EMETTEUR_DEFAUT.telephone },
            { label: "Email", value: EMETTEUR_DEFAUT.email },
          ] as { label: string; value: string }[]).map((row) => (
            <div key={row.label} className="space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{row.label}</span>
              <p className="text-sm font-medium text-slate-800 dark:text-white">{row.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 2. CLIENT ══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <SectionHeader icon={User} title="Client" subtitle="Informations du destinataire" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Raison sociale / Nom" id={`${uid}-client-rs`} className="sm:col-span-2">
            <input
              id={`${uid}-client-rs`}
              name="raisonSociale"
              type="text"
              placeholder="Entreprise ABC SARL"
              value={client.raisonSociale}
              onChange={handleClientChange}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Adresse" id={`${uid}-client-adresse`} className="sm:col-span-2">
            <input
              id={`${uid}-client-adresse`}
              name="adresse"
              type="text"
              placeholder="Rue 10 Médina, Dakar"
              value={client.adresse}
              onChange={handleClientChange}
              className={inputClass}
            />
          </Field>
          <Field label="Téléphone" id={`${uid}-client-tel`}>
            <input
              id={`${uid}-client-tel`}
              name="telephone"
              type="tel"
              placeholder="+221 77 000 00 00"
              value={client.telephone}
              onChange={handleClientChange}
              className={inputClass}
            />
          </Field>
          <Field label="Email" id={`${uid}-client-email`}>
            <input
              id={`${uid}-client-email`}
              name="email"
              type="email"
              placeholder="contact@entreprise.sn"
              value={client.email}
              onChange={handleClientChange}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      {/* ══ 3. MÉTADONNÉES ══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <SectionHeader icon={Hash} title="Détails du document" subtitle="Type, numéro et dates" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type selector */}
          <Field label="Type de document" id={`${uid}-type`}>
            <div className="relative">
              <select
                id={`${uid}-type`}
                value={invoiceType}
                onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                className={cn(inputClass, "appearance-none pr-10 cursor-pointer")}
              >
                <option value="PROFORMA">Facture Proforma</option>
                <option value="FACTURE">Facture</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>

          {/* Auto number */}
          <Field label="Numéro de document" id={`${uid}-numero`}>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              <span className="text-sm font-mono font-semibold text-sky-600 dark:text-sky-400">
                {numeroDocument}
              </span>
            </div>
          </Field>

          {/* Emission date */}
          <Field label="Date d'émission" id={`${uid}-date-emission`}>
            <div className="relative">
              <input
                id={`${uid}-date-emission`}
                type="date"
                value={dateEmission}
                onChange={(e) => setDateEmission(e.target.value)}
                className={cn(inputClass, "cursor-pointer")}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>

          {/* Due date */}
          <Field label="Date d'échéance / validité" id={`${uid}-date-echeance`}>
            <div className="relative">
              <input
                id={`${uid}-date-echeance`}
                type="date"
                value={dateEcheance}
                onChange={(e) => setDateEcheance(e.target.value)}
                min={dateEmission}
                className={cn(inputClass, "cursor-pointer")}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </Field>
        </div>

        {/* Statut du document */}
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Statut initial</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { value: "EN_ATTENTE" as InvoiceStatut, label: "En attente", desc: "Défaut" },
              { value: "PAYEE" as InvoiceStatut, label: "Payée", desc: "Règle immédiate" },
              { value: "ANNULEE" as InvoiceStatut, label: "Annulée", desc: "Invalide" },
            ]).map(({ value, label, desc }) => {
              const isActive = statut === value;
              return (
                <button
                  key={value}
                  id={`btn-form-statut-${value.toLowerCase()}`}
                  type="button"
                  onClick={() => setStatut(value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer",
                    isActive && value === "PAYEE" && "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20",
                    isActive && value === "EN_ATTENTE" && "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20",
                    isActive && value === "ANNULEE" && "bg-slate-500 text-white border-slate-500 shadow-md",
                    !isActive && "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600"
                  )}
                >
                  <span className="font-semibold">{label}</span>
                  <span className={cn("text-[10px]", isActive ? "opacity-80" : "opacity-60")}>{desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 4. ARTICLES ══ */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        <SectionHeader icon={FileText} title="Articles & Prestations" subtitle="Détail des lignes facturées" />
        <ItemsTable
          items={items}
          onItemChange={handleItemChange}
          onItemRemove={handleItemRemove}
          onItemAdd={handleItemAdd}
        />

        {/* ══ 5. TOTALS ══ */}
        <div className="mt-8 flex flex-col items-end">
          <TotalsPanel
            totalHT={totals.totalHT}
            totalTVA={totals.totalTVA}
            totalTTC={totals.totalTTC}
            tauxTVA={TAUX_TVA}
            applyTVA={applyTVA}
            onToggleTVA={setApplyTVA}
          />
        </div>
      </section>

      {/* ══ SUBMIT ══ */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
        <button
          id="btn-save-draft"
          type="button"
          className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
        >
          Enregistrer comme brouillon
        </button>
        <button
          id="btn-submit-invoice"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-semibold text-white
            transition-all duration-200 hover:opacity-90 active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: "linear-gradient(135deg, #0369a1, #0284c7)" }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 justify-center">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Génération en cours…
            </span>
          ) : (
            `Générer le ${invoiceType === "PROFORMA" ? "Proforma" : "Facture"}`
          )}
        </button>
      </div>
    </form>
  );
}
