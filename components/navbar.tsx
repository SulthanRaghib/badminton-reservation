"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeMinusIcon as Badminton } from "lucide-react";

export function Navbar() {
  const pathname = usePathname() || "/";

  const linkClass = (path: string) =>
    `text-sm font-medium ${
      pathname === path
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav
      className="border-b border-border bg-card"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Badminton className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold text-foreground">
              BadmintonBooking
            </span>
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={linkClass("/")}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Book a Court
            </Link>
            <Link
              href="/find-booking"
              className={linkClass("/find-booking")}
              aria-current={pathname === "/find-booking" ? "page" : undefined}
            >
              Find My Booking
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
