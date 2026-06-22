"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  LogOut,
  ChevronRight,
  Bell,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { UserAvatar } from "@/components/UserAvatar"

// ── Mocked authenticated user ──────────────────────────────────────
const MOCK_USER = {
  nom: "Mamadou Diallo",
  email: "m.diallo@solufacture.sn",
  initiales: "MD",
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mes Factures", href: "/dashboard/invoices", icon: FileText },
  { label: "Nouveau Document", href: "/dashboard/create", icon: FilePlus },
]

// ── Sidebar Link ───────────────────────────────────────────────────
function SidebarLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem
  isActive: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
      )}
    >
      <Icon className="h-4.5 w-4.5 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {isActive && <ChevronRight className="h-4 w-4 opacity-60" />}
    </Link>
  )
}

// ── Sidebar Content ───────────────────────────────────────────────
function SidebarContent({
  pathname,
  onNavClick,
}: {
  pathname: string
  onNavClick?: () => void
}) {
  const router = useRouter()

  function handleLogout() {
    router.push("/login")
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600">
          <FileText className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">SoluFacture</p>
          <p className="text-xs text-slate-500">Gestion de factures</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        <p className="mb-3 px-4 text-xs font-semibold tracking-widest text-slate-600 uppercase">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* User + Logout */}
      <div className="space-y-3 border-t border-slate-800 px-4 pt-4 pb-6">
        {/* User avatar */}
        <UserAvatar user={MOCK_USER} />
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )
}

// ── Dashboard Layout ──────────────────────────────────────────────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900 lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          pathname={pathname}
          onNavClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4">
            {/* Mobile menu toggle */}
            <button
              id="btn-mobile-menu"
              className="cursor-pointer text-slate-500 transition-colors hover:text-slate-900 lg:hidden dark:hover:text-white"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Ouvrir le menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            {/* Page title (dynamic via pathname) */}
            <div>
              <h1 className="text-base font-semibold text-slate-900 dark:text-white">
                {NAV_ITEMS.find((item) => item.href === pathname)?.label ??
                  "Dashboard"}
              </h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button
              id="btn-notifications"
              className="relative cursor-pointer rounded-xl p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-500" />
            </button>

            {/* User avatar */}
            <UserAvatar user={MOCK_USER} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
