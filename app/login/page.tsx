"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, FileText, Loader2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

// NOTE: Metadata can't be exported from a 'use client' file.
// Place a separate metadata.ts at app/login/metadata.ts if needed.

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0369a1 100%)" }}>

        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #38bdf8, transparent)" }} />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #818cf8, transparent)" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">SoluFacture</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Gérez vos factures<br />
            <span style={{ color: "#38bdf8" }}>avec élégance.</span>
          </h1>
          <p className="text-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            Créez des factures et proformas professionnels en quelques clics.
            Fini les fichiers Excel, place au SaaS moderne.
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[
              { label: "Factures créées", value: "12 k+" },
              { label: "Clients satisfaits", value: "850+" },
              { label: "Taux de paiement", value: "98%" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <p className="relative z-10 text-sm italic" style={{ color: "rgba(255,255,255,0.4)" }}>
          &ldquo;La simplicité est la sophistication ultime.&rdquo; — Leonardo da Vinci
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">SoluFacture</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bon retour ! 👋</h2>
            <p className="text-slate-500 dark:text-slate-400">
              Connectez-vous pour accéder à votre espace de facturation.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Adresse email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@entreprise.sn"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border text-slate-900 dark:text-white placeholder:text-slate-400
                  bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700
                  focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                  transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Mot de passe
                </label>
                <button type="button" className="text-sm text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors cursor-pointer">
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl border text-slate-900 dark:text-white placeholder:text-slate-400
                    bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700
                    focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent
                    transition-all duration-200"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="btn-login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-white
                transition-all duration-200 hover:opacity-90 active:scale-[0.98] cursor-pointer
                disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #0369a1, #0284c7)" }}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Connexion en cours…</>
              ) : (
                <><span>Se connecter</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-sm text-slate-400">ou</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?{" "}
            <button
              type="button"
              id="btn-create-account"
              className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors cursor-pointer"
            >
              Créer un compte
            </button>
          </p>

          {/* Demo hint */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-600">
            Mode démo — entrez n&apos;importe quelles informations pour accéder au tableau de bord.
          </p>
        </div>
      </div>
    </div>
  );
}
