"use client";

import { useState } from "react";
import { User, Lock, Building2, Save, Check } from "lucide-react";
import { EMETTEUR } from "@/lib/invoices-data";
import { cn } from "@/lib/utils";

// ── Mock Initial User Data ──
const INITIAL_USER = {
  nom: "Mamadou Diallo",
  email: "m.diallo@solufacture.sn",
};

// ── Common Input Class ──
const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 " +
  "bg-white dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent " +
  "text-sm transition-all duration-200";

// ── Sub-component: Form Field ──
function Field({ label, id, children, className }: { label: string; id: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Section Header ──
function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-100 dark:bg-sky-900/30">
        <Icon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  // ── States ──
  const [personalInfo, setPersonalInfo] = useState(INITIAL_USER);
  const [passwordInfo, setPasswordInfo] = useState({ current: "", new: "", confirm: "" });
  const [companyInfo, setCompanyInfo] = useState(EMETTEUR);

  // Status states
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  // ── Handlers ──
  const handleSave = async (section: string) => {
    setSavingSection(section);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSavingSection(null);
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 3000);
  };

  const handlePersonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave("personal");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInfo.new !== passwordInfo.confirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    handleSave("password");
    // Reset passwords after save
    setPasswordInfo({ current: "", new: "", confirm: "" });
  };

  const handleCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave("company");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">
          Gérez vos informations personnelles, votre sécurité et les détails de votre entreprise.
        </p>
      </div>

      <div className="space-y-6">
        {/* ══ 1. INFORMATIONS PERSONNELLES ══ */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <SectionHeader icon={User} title="Informations personnelles" subtitle="Vos informations de connexion et de profil." />
          <form onSubmit={handlePersonalSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nom complet" id="nom">
                <input
                  id="nom"
                  type="text"
                  value={personalInfo.nom}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, nom: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Adresse email" id="email">
                <input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {savedSection === "personal" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" /> Sauvegardé
                </span>
              )}
              <button
                type="submit"
                disabled={savingSection === "personal"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all cursor-pointer disabled:opacity-60"
              >
                {savingSection === "personal" ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </form>
        </section>

        {/* ══ 2. MOT DE PASSE ══ */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <SectionHeader icon={Lock} title="Sécurité et mot de passe" subtitle="Modifiez votre mot de passe pour sécuriser votre compte." />
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5 max-w-md">
              <Field label="Mot de passe actuel" id="current-password">
                <input
                  id="current-password"
                  type="password"
                  value={passwordInfo.current}
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, current: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Nouveau mot de passe" id="new-password">
                <input
                  id="new-password"
                  type="password"
                  value={passwordInfo.new}
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, new: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Confirmer le mot de passe" id="confirm-password">
                <input
                  id="confirm-password"
                  type="password"
                  value={passwordInfo.confirm}
                  onChange={(e) => setPasswordInfo({ ...passwordInfo, confirm: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {savedSection === "password" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" /> Mot de passe modifié
                </span>
              )}
              <button
                type="submit"
                disabled={savingSection === "password" || !passwordInfo.current || !passwordInfo.new}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-40"
              >
                {savingSection === "password" ? <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-700 rounded-full animate-spin" /> : "Mettre à jour"}
              </button>
            </div>
          </form>
        </section>

        {/* ══ 3. ENTREPRISE (ÉMETTEUR) ══ */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
          <SectionHeader icon={Building2} title="Informations de l'entreprise" subtitle="Ces informations apparaîtront sur vos factures." />
          <form onSubmit={handleCompanySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Raison sociale / Nom" id="company-nom" className="sm:col-span-2">
                <input
                  id="company-nom"
                  type="text"
                  value={companyInfo.nom}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, nom: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Adresse" id="company-adresse" className="sm:col-span-2">
                <input
                  id="company-adresse"
                  type="text"
                  value={companyInfo.adresse}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, adresse: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="NINEA" id="company-ninea">
                <input
                  id="company-ninea"
                  type="text"
                  value={companyInfo.ninea}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, ninea: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Registre du Commerce (RC)" id="company-rc">
                <input
                  id="company-rc"
                  type="text"
                  value={companyInfo.rc}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, rc: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Téléphone" id="company-tel">
                <input
                  id="company-tel"
                  type="tel"
                  value={companyInfo.telephone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, telephone: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Adresse email (contact pro)" id="company-email">
                <input
                  id="company-email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  className={inputClass}
                  required
                />
              </Field>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              {savedSection === "company" && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4" /> Sauvegardé
                </span>
              )}
              <button
                type="submit"
                disabled={savingSection === "company"}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 transition-all cursor-pointer disabled:opacity-60"
              >
                {savingSection === "company" ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
