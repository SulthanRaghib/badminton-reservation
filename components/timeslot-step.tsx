"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTimeslots } from "@/lib/api";
import { mockTimeslots } from "@/lib/mock-data";

interface TimeslotStepProps {
  onTimeslotSelected: (
    timeslotId: number,
    startTime: string,
    endTime: string
  ) => void;
  selectedTimeslotId: number | null;
  disabled: boolean;
  bookingDate: string | null;
  courtId: number | null;
}

export function TimeslotStep({
  onTimeslotSelected,
  selectedTimeslotId,
  disabled,
  bookingDate,
  courtId,
}: TimeslotStepProps) {
  const [timeslots, setTimeslots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingDate || !courtId) return;

    const fetchTimeslots = async () => {
      setLoading(true);
      const result = await getTimeslots(bookingDate, courtId.toString());
      if (result.success && result.data) {
        setTimeslots(result.data);
      } else {
        setTimeslots(mockTimeslots);
      }
      setLoading(false);
    };

    fetchTimeslots();
  }, [bookingDate, courtId]);

  // Skeleton untuk loading
  const renderSkeleton = () => (
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg border bg-muted"
        />
      ))}
    </div>
  );

  if (disabled) {
    return (
      <Card className="p-6 opacity-60">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            3
          </div>
          <h3 className="text-lg font-semibold text-muted-foreground">
            Select Timeslot
          </h3>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Please select a date and court first.
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
              3
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Select Timeslot
            </h3>
          </div>
        </div>
        {renderSkeleton()}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          3
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Select Timeslot
        </h3>
      </div>

      {timeslots.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No timeslots available for the selected date and court.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {timeslots.map((slot) => {
            const isAvailable =
              typeof slot.available === "boolean"
                ? slot.available
                : !!slot.is_active;

            if (!isAvailable) {
              return (
                <div
                  key={slot.id}
                  className="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 text-center text-red-800"
                  role="status"
                  aria-disabled="true"
                >
                  <span className="font-medium text-sm">{slot.start_time}</span>
                  <span className="text-xs opacity-80">to {slot.end_time}</span>
                  <span className="mt-1 text-xs font-semibold text-red-600">
                    BOOKED
                  </span>
                </div>
              );
            }

            const isSelected = selectedTimeslotId === slot.id;

            return (
              <Button
                key={slot.id}
                onClick={() =>
                  onTimeslotSelected(slot.id, slot.start_time, slot.end_time)
                }
                variant={isSelected ? "default" : "outline"}
                className={`h-20 flex-col justify-center gap-1 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="font-medium text-sm">{slot.start_time}</span>
                <span className="text-xs opacity-80">to {slot.end_time}</span>
              </Button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
