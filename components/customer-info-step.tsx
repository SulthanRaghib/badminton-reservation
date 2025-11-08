"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerInfoStepProps {
  onInfoSubmitted: (info: CustomerInfo) => void;
  disabled: boolean;
  isLoading: boolean;
}

export interface CustomerInfo {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: string;
}

export function CustomerInfoStep({
  onInfoSubmitted,
  disabled,
  isLoading,
}: CustomerInfoStepProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10,}$/.test(phone.replace(/\D/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    const email = emailRef.current?.value.trim();
    const phone = phoneRef.current?.value.trim();
    const notes = notesRef.current?.value.trim();

    const newErrors: { name?: string; email?: string; phone?: string } = {};
    if (!name) {
      newErrors.name = "Masukkan nama lengkap";
    }
    if (!email || !validateEmail(email)) {
      newErrors.email = "Masukkan alamat email yang valid";
    }
    if (!phone || !validatePhone(phone)) {
      newErrors.phone = "Masukkan nomor telepon yang valid (minimal 10 digit)";
    }

    setErrors(newErrors);

    // focus first invalid field if any
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.name) nameRef.current?.focus();
      else if (newErrors.email) emailRef.current?.focus();
      else if (newErrors.phone) phoneRef.current?.focus();
      return;
    }

    onInfoSubmitted({
      customer_name: name!,
      customer_email: email!,
      customer_phone: phone!,
      notes,
    });
  };

  if (disabled) {
    return (
      <Card className="p-6 opacity-50">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            4
          </span>
          Customer Information
        </h3>
        <p className="mt-4 text-sm text-muted-foreground">
          Please select a date, court, and timeslot first
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            4
          </span>
          Customer Information
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            ref={nameRef}
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            ref={emailRef}
            placeholder="john@example.com"
            required
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-foreground">
            Phone Number
          </Label>
          <Input
            id="phone"
            ref={phoneRef}
            placeholder="08123456789"
            required
            disabled={isLoading}
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p
              id="phone-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="notes" className="text-foreground">
            Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            ref={notesRef}
            placeholder="Any special requests or notes..."
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} size="lg">
          {isLoading ? "Processing..." : "Continue to Confirmation"}
        </Button>
      </form>
    </Card>
  );
}
