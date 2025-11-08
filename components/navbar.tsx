"use client"

import Link from "next/link"
import { BadgeMinusIcon as Badminton } from "lucide-react"

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Badminton className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">BadmintonBooking</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Book a Court
            </Link>
            <Link href="/find-booking" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Find My Booking
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
