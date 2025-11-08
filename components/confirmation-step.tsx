"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfirmationStepProps {
  selectedDate: string | null;
  selectedCourtName: string | null;
  selectedStartTime: string | null;
  selectedEndTime: string | null;
  courtPrice: number | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  notes?: string;
  onConfirm: () => void;
  onEdit: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function ConfirmationStep({
  selectedDate,
  selectedCourtName,
  selectedStartTime,
  selectedEndTime,
  courtPrice,
  customerName,
  customerEmail,
  customerPhone,
  notes,
  onConfirm,
  onEdit,
  isLoading,
  error,
}: ConfirmationStepProps) {
  const formatCurrency = (amount: number | null) => {
    // treat null/undefined as missing; allow 0 to format as currency
    if (amount == null) return "N/A";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const renderValue = (value: any, fallback = "N/A") => {
    if (value === null || typeof value === "undefined" || value === "")
      return fallback;
    return value;
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            5
          </span>
          Confirmation & Payment
        </h3>
      </div>

      <div className="space-y-6">
        {/* Summary */}
        <div className="space-y-4 rounded-lg bg-secondary/10 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Date
              </p>
              <p className="text-lg font-semibold text-foreground">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Time
              </p>
              <p className="text-lg font-semibold text-foreground">
                {selectedStartTime && selectedEndTime
                  ? `${selectedStartTime} - ${selectedEndTime}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Court
              </p>
              <p className="text-lg font-semibold text-foreground">
                {renderValue(selectedCourtName)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Price
              </p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(courtPrice)}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          <h4 className="font-semibold text-foreground">Customer Details</h4>
          <div className="grid gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">
                {renderValue(customerName, "-")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">
                {renderValue(customerEmail, "-")}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">
                {renderValue(customerPhone, "-")}
              </p>
            </div>
            {notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="font-medium text-foreground">
                  {renderValue(notes, "-")}
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onEdit}
            variant="outline"
            className="flex-1 bg-transparent"
            disabled={isLoading}
          >
            Edit Details
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Processing..." : "Make Reservation"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
