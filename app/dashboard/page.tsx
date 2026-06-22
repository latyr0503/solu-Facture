import type { Metadata } from "next";
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  FilePlus,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tableau de bord — SoluFacture",
  description: "Vue d'ensemble de votre activité de facturation.",
};

interface StatCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  color: string;
}

const STATS: StatCard[] = [
  {
    label: "Chiffre d'affaires",
    value: "4 820 000 FCFA",
    change: "+12% ce mois",
    positive: true,
    icon: DollarSign,
    color: "sky",
  },
  {
    label: "Factures émises",
    value: "28",
    change: "+4 cette semaine",
    positive: true,
    icon: FileText,
    color: "indigo",
  },
  {
    label: "En attente",
    value: "7",
    change: "3 en retard",
    positive: false,
    icon: Clock,
    color: "amber",
  },
  {
    label: "Payées",
    value: "21",
    change: "75% du total",
    positive: true,
    icon: CheckCircle,
    color: "emerald",
  },
];

const RECENT_INVOICES = [
  { numero: "FAC-2026-028", client: "Gaindé Technologies", montant: "850 000", statut: "PAYEE", date: "20/06/2026" },
  { numero: "PRO-2026-027", client: "Teranga Services SARL", montant: "320 500", statut: "EN_ATTENTE", date: "18/06/2026" },
  { numero: "FAC-2026-026", client: "Digital Dakar Agency", montant: "1 200 000", statut: "PAYEE", date: "15/06/2026" },
  { numero: "PRO-2026-025", client: "SenAgri Consulting", montant: "240 000", statut: "EN_ATTENTE", date: "12/06/2026" },
  { numero: "FAC-2026-024", client: "Baobab Holding Group", montant: "560 750", statut: "ANNULEE", date: "08/06/2026" },
];

const STATUT_STYLES: Record<string, string> = {
  PAYEE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  EN_ATTENTE: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  ANNULEE: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
};

const STATUT_LABELS: Record<string, string> = {
  PAYEE: "Payée",
  EN_ATTENTE: "En attente",
  ANNULEE: "Annulée",
};

const COLOR_MAP: Record<string, string> = {
  sky: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
  indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
  emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0369a1 100%)" }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sky-300 text-sm font-medium mb-1">Bonjour 👋</p>
            <h2 className="text-2xl font-bold text-white">Mamadou Diallo</h2>
            <p className="text-slate-400 text-sm mt-1">
              Voici l&apos;état de votre activité pour{" "}
              {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
            </p>
          </div>
          <Link
            href="/dashboard/create"
            id="btn-dashboard-create"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <FilePlus className="w-4 h-4" />
            Nouveau document
          </Link>
        </div>
        {/* Decorative */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 bg-sky-400" />
        <div className="absolute -bottom-14 right-24 w-36 h-36 rounded-full opacity-10 bg-indigo-400" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${COLOR_MAP[stat.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.positive
                      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                      : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{stat.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent invoices */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Documents récents</h3>
          </div>
          <Link
            href="/dashboard/invoices"
            className="flex items-center gap-1 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-medium transition-colors cursor-pointer"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40">
                {["Numéro", "Client", "Montant TTC", "Statut", "Date"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {RECENT_INVOICES.map((inv) => (
                <tr
                  key={inv.numero}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono font-medium text-sky-600 dark:text-sky-400">
                    {inv.numero}
                  </td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                    {inv.client}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 tabular-nums">
                    {inv.montant} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUT_STYLES[inv.statut]}`}>
                      {STATUT_LABELS[inv.statut]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
