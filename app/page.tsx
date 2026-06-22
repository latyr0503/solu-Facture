"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    router.push("/login")
  }, [router])
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Redirection vers la page de connexion... </h1>
    </div>
  )
}
