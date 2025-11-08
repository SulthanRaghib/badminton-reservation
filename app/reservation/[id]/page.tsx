"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getReservation,
  processPayment,
  getAllCourts,
  getTimeslots,
} from "@/lib/api";
import { mockReservation } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  Clock,
  MapPin,
  User,
  AlertCircle,
  Printer,
} from "lucide-react";

export default function ReservationDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchReservation = async () => {
      setLoading(true);
      const result = await getReservation(reservationId);
      if (result.success && result.data) {
        // If backend doesn't return court_name, fetch courts and fill it in
        let res = result.data as any;
        try {
          if (!res.court_name && typeof res.court_id !== "undefined") {
            const courtsResult = await getAllCourts();
            if (courtsResult.success && Array.isArray(courtsResult.data)) {
              const found = (courtsResult.data as any[]).find(
                (c) => Number(c.id) === Number(res.court_id)
              );
              if (found)
                res = {
                  ...res,
                  court_name: found.name,
                  court_description: found.description,
                };
            }
          }
          // If times aren't provided, try fetching timeslot by id
          if (
            (!res.start_time || !res.end_time) &&
            res.timeslot_id &&
            res.booking_date &&
            res.court_id
          ) {
            try {
              const tsResult = await getTimeslots(
                res.booking_date,
                String(res.court_id)
              );
              if (tsResult.success && Array.isArray(tsResult.data)) {
                const slot = (tsResult.data as any[]).find(
                  (s) => Number(s.id) === Number(res.timeslot_id)
                );
                if (slot) {
                  res = {
                    ...res,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                  };
                }
              }
            } catch (e) {
              // ignore timeslot fetch errors
            }
          }
        } catch (e) {
          // ignore and continue with whatever we have
        }
        setReservation(res);
      } else {
        // Use mock data for preview
        setReservation({ ...mockReservation, id: reservationId });
      }
      setLoading(false);
    };
    fetchReservation();
  }, [reservationId]);

  const handlePayment = async () => {
    if (!reservation) return;

    setPaymentLoading(true);
    const result = await processPayment(reservation.id);

    // The backend returns { success, message, data: { payment_url, ... } }
    const payload = result.data as any;
    const paymentUrl = payload?.payment_url || payload?.redirect_url || null;

    if (result.success && paymentUrl) {
      // Open payment URL in new tab
      window.open(paymentUrl, "_blank");
      toast("Payment Initiated", {
        description: "Opening payment gateway in new tab",
      });
    } else {
      toast("Error", {
        description: result.error || "Failed to initiate payment",
        variant: "destructive",
      });
    }
    setPaymentLoading(false);
  };

  const getStatusColor = (status: string) => {
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
        return "Paid";
      case "pending":
        return "Pending";
      case "waiting_payment":
        return "Waiting for Payment";
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

  const canPay =
    reservation &&
    (reservation.status === "pending" ||
      reservation.status === "waiting_payment");

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto max-w-2xl px-4 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Reservation not found"}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Reservation Details
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Booking #{reservation.id}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Alert */}
          <div className="mb-6">
            {reservation.status === "paid" && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your reservation is confirmed and paid. See you on the court!
                </AlertDescription>
              </Alert>
            )}
            {canPay && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Payment required to confirm your reservation. Please complete
                  payment below.
                </AlertDescription>
              </Alert>
            )}
            {reservation.status === "expired" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This reservation has expired.
                </AlertDescription>
              </Alert>
            )}
            {reservation.status === "cancelled" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This reservation has been cancelled.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Main Details */}
          <div className="space-y-6">
            {/* Reservation Status */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Status
                  </p>
                  <Badge
                    className={`mt-2 ${getStatusColor(reservation.status)}`}
                  >
                    {getStatusLabel(reservation.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Price
                  </p>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    {formatCurrency(reservation.total_price)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Reservation Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Court
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {reservation.court_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.court_description ||
                        reservation.description ||
                        "-"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date & Time
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {new Date(reservation.booking_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.start_time} - {reservation.end_time}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Customer Info */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-foreground">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">
                      {reservation.customer_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">
                    {reservation.customer_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">
                    {reservation.customer_phone}
                  </p>
                </div>
                {reservation.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium text-foreground">
                      {reservation.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Payment Section */}
            {canPay && (
              <Card className="border-primary/30 bg-primary/5 p-6">
                <h3 className="mb-4 font-semibold text-foreground">
                  Payment Required
                </h3>
                <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Due</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(reservation.total_price)}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  size="lg"
                  className="w-full"
                >
                  {paymentLoading ? "Processing..." : "Pay Now"}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  You will be redirected to Midtrans secure payment gateway
                </p>
              </Card>
            )}

            {/* Booking Confirmed */}
            {reservation.status === "paid" && (
              <Card className="border-green-200 bg-green-50 p-6">
                <div className="text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
                  <h3 className="font-semibold text-green-900">
                    Booking Confirmed!
                  </h3>
                  <p className="mt-2 text-sm text-green-700">
                    A confirmation email has been sent to{" "}
                    {reservation.customer_email}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
