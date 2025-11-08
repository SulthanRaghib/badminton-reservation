"use client"

import { useEffect, useState } from "react"
import { checkApiHealth } from "@/lib/api"
import { CheckCircle2, AlertCircle } from "lucide-react"

export function Footer() {
  const [apiHealth, setApiHealth] = useState<boolean | null>(null)

  useEffect(() => {
    const checkHealth = async () => {
      const result = await checkApiHealth()
      setApiHealth(result.success)
    }
    checkHealth()
  }, [])

  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Badminton Court Reservations</p>
            <p className="text-xs text-muted-foreground">Book your favorite courts easily and quickly</p>
          </div>
          <div className="flex items-center gap-2">
            {apiHealth === null && <span className="text-xs text-muted-foreground">Checking API...</span>}
            {apiHealth === true && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs text-primary">API Connected</span>
              </div>
            )}
            {apiHealth === false && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive">API Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
