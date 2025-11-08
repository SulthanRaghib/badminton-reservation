"use client";

import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAvailableDates } from "@/lib/api";
import { mockDates } from "@/lib/mock-data";

interface DateStepProps {
  onDateSelected: (date: string) => void;
  selectedDate: string | null;
}

export function DateStep({ onDateSelected, selectedDate }: DateStepProps) {
  const [dates, setDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      setLoading(true);
      const result = await getAvailableDates();
      if (result.success && result.data) {
        setDates(result.data);
      } else {
        // Use mock data for preview
        setDates(mockDates);
        setError(null);
      }
      setLoading(false);
    };
    fetchDates();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = listRef.current;
    if (!el) return;
    const amount = Math.max(220, el.clientWidth * 0.6);
    const target =
      direction === "left"
        ? Math.max(0, el.scrollLeft - amount)
        : Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + amount);
    el.scrollTo({ left: target, behavior: "smooth" });
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    const onWheel = (e: WheelEvent) => {
      // Prevent native wheel scrolling inside the date list; arrows control scrolling
      if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
        e.preventDefault();
      }
    };

    const onTouch = (e: TouchEvent) => {
      // prevent touch drag scrolling (we only want arrow control)
      e.preventDefault();
    };

    onScroll();
    el.addEventListener("scroll", onScroll);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouch, { passive: false });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouch);
      window.removeEventListener("resize", onScroll);
    };
  }, [dates]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Loading available dates...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            1
          </span>
          Select Date
        </h3>
      </div>

      <div className="relative">
        <div className="relative">
          <div className="flex gap-3 overflow-hidden py-3" ref={listRef}>
            {dates.map((dateItem, idx) => {
              const { day, date, month } = formatDate(dateItem.date);
              const isSelected = selectedDate === dateItem.date;
              const isWeekend = dateItem.is_weekend;

              return (
                <Button
                  key={idx}
                  onClick={() => onDateSelected(dateItem.date)}
                  variant={isSelected ? "default" : "outline"}
                  className={
                    `min-w-[150px] flex-none flex flex-col items-center justify-center gap-1 py-15 px-4 text-center leading-tight transition-colors duration-150 ` +
                    // Apply weekend styling only when NOT selected so selection wins
                    (isWeekend && !isSelected
                      ? "border-orange-400 text-orange-700 bg-orange-50 hover:bg-orange-200 hover:text-orange-900 "
                      : "") +
                    // Selected styles must come last to take precedence
                    (isSelected
                      ? "bg-primary text-primary-foreground border-none"
                      : "bg-white")
                  }
                  aria-pressed={isSelected}
                  role="listitem"
                >
                  <span className="text-sm font-medium uppercase">{day}</span>
                  <span className="text-3xl font-bold">{date}</span>
                  <span className="text-sm">{month}</span>
                  {isWeekend && (
                    <span className="text-xs text-orange-600">Weekend</span>
                  )}
                </Button>
              );
            })}
          </div>

          {/* arrows always visible; user requested arrows control scrolling */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 shadow"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 shadow"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4 rounded-lg bg-secondary/20 p-3">
          <p className="text-sm text-foreground">
            Selected:{" "}
            <strong>{new Date(selectedDate).toLocaleDateString()}</strong>
          </p>
        </div>
      )}
    </Card>
  );
}
