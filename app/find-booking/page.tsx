"use client";

import type React from "react";

import { useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { findReservationByEmail, getTimeslots } from "@/lib/api";
import { mockReservation } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  AlertCircle,
  Clock,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default function FindBookingPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [reservations, setReservations] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value.trim();

    if (!email || !validateEmail(email)) {
      toast("Invalid Email", {
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    const result = await findReservationByEmail(email);

    if (result.success && result.data) {
      const reservationList = Array.isArray(result.data)
        ? result.data
        : [result.data];

      // Some reservation responses only include timeslot_id (no start_time/end_time).
      // Fetch timeslot lists grouped by (court_id, booking_date) once and fill in times.
      const keyFor = (r: any) => `${r.court_id}|${r.booking_date}`;
      const groups: Record<string, any[]> = {};
      const toFetch = new Map<string, Promise<any>>();

      // collect unique keys that we need to fetch
      reservationList.forEach((r) => {
        if (
          (!r.start_time || !r.end_time) &&
          r.timeslot_id &&
          r.booking_date &&
          r.court_id
        ) {
          const k = keyFor(r);
          if (!groups[k]) groups[k] = [];
          groups[k].push(r);
          if (!toFetch.has(k)) {
            toFetch.set(k, getTimeslots(r.booking_date, String(r.court_id)));
          }
        }
      });

      if (toFetch.size > 0) {
        // await all fetches
        await Promise.all(
          Array.from(toFetch.entries()).map(async ([k, p]) => {
            try {
              const res = await p;
              if (res.success && Array.isArray(res.data)) {
                groups[k].forEach((r: any) => {
                  const slot = (res.data as any[]).find(
                    (s) => Number(s.id) === Number(r.timeslot_id)
                  );
                  if (slot) {
                    r.start_time = slot.start_time;
                    r.end_time = slot.end_time;
                  }
                });
              }
            } catch (e) {
              // ignore individual fetch errors
            }
          })
        );
      }

      setReservations(reservationList);

      if (reservationList.length === 0) {
        setError("No reservations found for this email address");
      }
    } else {
      // Show mock data for preview
      setReservations([mockReservation]);
      setError(null);
    }

    setLoading(false);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "waiting_payment":
        return "bg-orange-100 text-orange-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "waiting_payment":
        return "Payment Required";
      case "expired":
        return "Expired";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Find My Booking
            </h1>
            <p className="mt-2 text-muted-foreground">
              Search for your reservations using your email address
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8 p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                ref={emailRef}
                type="email"
                placeholder="Enter your email address"
                required
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading} className="gap-2">
                <Search className="h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </Card>

          {/* Results */}
          {searched && loading && (
            <div className="space-y-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          )}

          {searched && !loading && error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {searched && !loading && reservations && reservations.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Found {reservations.length} reservation
                {reservations.length !== 1 ? "s" : ""}
              </h2>

              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Link
                    key={reservation.id}
                    href={`/reservation/${reservation.id}`}
                  >
                    <Card className="transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Top row: Court and Status */}
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                              {reservation.court_name}
                            </h3>
                            <Badge
                              className={getStatusBadgeClass(
                                reservation.status
                              )}
                            >
                              {getStatusLabel(reservation.status)}
                            </Badge>
                          </div>

                          {/* Details grid */}
                          <div className="mb-4 grid gap-3 sm:grid-cols-2">
                            <div className="flex gap-2">
                              <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Date & Time
                                </p>
                                <p className="font-medium text-foreground">
                                  {new Date(
                                    reservation.booking_date
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {reservation.start_time
                                    ? reservation.start_time
                                    : "-"}{" "}
                                  -{" "}
                                  {reservation.end_time
                                    ? reservation.end_time
                                    : "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <CreditCard className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Total Price
                                </p>
                                <p className="font-medium text-primary">
                                  {formatCurrency(reservation.total_price)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Booking ID */}
                          <p className="text-xs text-muted-foreground">
                            Booking ID: {reservation.id}
                          </p>
                        </div>

                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!searched && (
            <Card className="p-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Find Your Booking
              </h3>
              <p className="text-muted-foreground">
                Enter the email address used for your reservation to see all
                your bookings
              </p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
