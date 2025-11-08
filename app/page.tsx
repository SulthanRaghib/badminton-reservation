"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DateStep } from "@/components/date-step";
import { CourtStep } from "@/components/court-step";
import { TimeslotStep } from "@/components/timeslot-step";
import {
  CustomerInfoStep,
  type CustomerInfo,
} from "@/components/customer-info-step";
import { ConfirmationStep } from "@/components/confirmation-step";
import { createReservation } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCourtId, setSelectedCourtId] = useState<number | null>(null);
  const [selectedCourtName, setSelectedCourtName] = useState<string | null>(
    null
  );
  const [courtPrice, setCourtPrice] = useState<number | null>(null);
  const [selectedTimeslotId, setSelectedTimeslotId] = useState<number | null>(
    null
  );
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(
    null
  );
  const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "date" | "court" | "time" | "info" | "confirmation"
  >("date");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelected = (date: string) => {
    setSelectedDate(date);
    setCurrentStep("court");
    setError(null);
  };

  const handleCourtSelected = (
    courtId: number,
    courtName: string,
    price: number
  ) => {
    setSelectedCourtId(courtId);
    setSelectedCourtName(courtName);
    setCourtPrice(price);
    setCurrentStep("time");
    setError(null);
  };

  const handleTimeslotSelected = (
    timeslotId: number,
    startTime: string,
    endTime: string
  ) => {
    setSelectedTimeslotId(timeslotId);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setCurrentStep("info");
    setError(null);
  };

  const handleCustomerInfoSubmitted = (info: CustomerInfo) => {
    setCustomerInfo(info);
    setCurrentStep("confirmation");
    setError(null);
  };

  const handleConfirm = async () => {
    if (
      !selectedDate ||
      !selectedCourtId ||
      !selectedTimeslotId ||
      !customerInfo
    ) {
      setError("Missing reservation details");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await createReservation({
      court_id: selectedCourtId,
      timeslot_id: selectedTimeslotId,
      booking_date: selectedDate,
      customer_name: customerInfo.customer_name,
      customer_email: customerInfo.customer_email,
      customer_phone: customerInfo.customer_phone,
      notes: customerInfo.notes,
    });

    if (result.success && result.data) {
      toast("Reservation Created!", {
        description: "Redirecting to booking details...",
      });
      // Redirect to reservation detail page
      router.push(`/reservation/${(result.data as any).id}`);
    } else {
      setError(result.error || "Failed to create reservation");
      toast("Error", {
        description: result.error || "Failed to create reservation",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleEdit = () => {
    setCurrentStep("date");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Book Your Badminton Court
            </h1>
            <p className="mt-2 text-muted-foreground">
              Follow the steps below to reserve your favorite court
            </p>
          </div>

          <div className="space-y-6">
            {(currentStep === "date" ||
              currentStep === "court" ||
              currentStep === "time" ||
              currentStep === "info" ||
              currentStep === "confirmation") && (
              <DateStep
                onDateSelected={handleDateSelected}
                selectedDate={selectedDate}
              />
            )}

            {(currentStep === "court" ||
              currentStep === "time" ||
              currentStep === "info" ||
              currentStep === "confirmation") && (
              <CourtStep
                onCourtSelected={handleCourtSelected}
                selectedCourtId={selectedCourtId}
                disabled={!selectedDate}
              />
            )}

            {(currentStep === "time" ||
              currentStep === "info" ||
              currentStep === "confirmation") && (
              <TimeslotStep
                onTimeslotSelected={handleTimeslotSelected}
                selectedTimeslotId={selectedTimeslotId}
                disabled={!selectedDate || !selectedCourtId}
                bookingDate={selectedDate}
                courtId={selectedCourtId}
              />
            )}

            {(currentStep === "info" || currentStep === "confirmation") && (
              <CustomerInfoStep
                onInfoSubmitted={handleCustomerInfoSubmitted}
                disabled={
                  !selectedDate || !selectedCourtId || !selectedTimeslotId
                }
                isLoading={isLoading}
              />
            )}

            {currentStep === "confirmation" && (
              <ConfirmationStep
                selectedDate={selectedDate}
                selectedCourtName={selectedCourtName}
                selectedStartTime={selectedStartTime}
                selectedEndTime={selectedEndTime}
                courtPrice={courtPrice}
                customerName={customerInfo?.customer_name || null}
                customerEmail={customerInfo?.customer_email || null}
                customerPhone={customerInfo?.customer_phone || null}
                notes={customerInfo?.notes}
                onConfirm={handleConfirm}
                onEdit={handleEdit}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
