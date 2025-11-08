"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllCourts } from "@/lib/api";
import { mockCourts } from "@/lib/mock-data";

interface CourtStepProps {
  onCourtSelected: (courtId: number, courtName: string, price: number) => void;
  selectedCourtId: number | null;
  disabled: boolean;
}

export function CourtStep({
  onCourtSelected,
  selectedCourtId,
  disabled,
}: CourtStepProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  const [courts, setCourts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      const result = await getAllCourts();
      if (result.success && result.data) {
        setCourts(result.data);
      } else {
        setCourts(mockCourts);
      }
      setLoading(false);
    };
    fetchCourts();
  }, []);

  if (disabled) {
    return (
      <Card className="p-6 opacity-50">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            2
          </span>
          Select Court
        </h3>
        <p className="mt-4 text-sm text-muted-foreground">
          Please select a date first
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading courts...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            2
          </span>
          Select Court
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <Button
            key={court.id}
            onClick={() =>
              onCourtSelected(court.id, court.name, court.price_per_hour)
            }
            type="button"
            aria-label={`Select ${court.name}`}
            aria-pressed={selectedCourtId === court.id}
            variant={selectedCourtId === court.id ? "default" : "outline"}
            className="w-full h-auto flex-col items-start justify-start gap-2 p-4 text-left overflow-hidden"
          >
            <span className="font-semibold text-base break-words">
              {court.name}
            </span>
            <div className="text-xs opacity-80 whitespace-normal break-words max-h-14 overflow-hidden">
              {court.description}
            </div>
            <span className="text-sm font-medium mt-2">
              {formatCurrency(court.price_per_hour)}
              <span className="text-xs opacity-80">/hour</span>
            </span>
          </Button>
        ))}
      </div>
    </Card>
  );
}
