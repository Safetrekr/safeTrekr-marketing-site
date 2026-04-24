"use client";

/**
 * Demo request form — submits to submitForm Server Action with
 * formType=demo_request. Delivers to SALES_EMAIL.
 */

import React, { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitForm } from "@/actions/submit-form";
import { orgTypeValues } from "@/lib/validation/schemas";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const ORG_TYPE_LABELS: Record<(typeof orgTypeValues)[number], string> = {
  k12: "K-12 School",
  higher_education: "Higher Education",
  churches_missions: "Church / Mission",
  corporate: "Corporate",
  sports: "Sports Team",
  other: "Other",
};

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function DemoRequestForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("formType", "demo_request");
    fd.set("turnstileToken", turnstileToken);

    startTransition(async () => {
      const result = await submitForm(fd);
      if (result.success) {
        setStatus({
          kind: "success",
          message: result.message ?? "Request received.",
        });
        form.reset();
      } else {
        setStatus({
          kind: "error",
          message: result.error ?? "Something went wrong.",
        });
      }
      turnstileRef.current?.reset();
      setTurnstileToken("");
    });
  }

  if (status.kind === "success") {
    return (
      <div
        className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
        role="status"
      >
        {status.message}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Schedule a walkthrough"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="demo-firstName">
            First name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="demo-firstName"
            name="firstName"
            type="text"
            required
            placeholder="First name"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo-lastName">
            Last name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="demo-lastName"
            name="lastName"
            type="text"
            required
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-email">
          Work email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="demo-email"
          name="email"
          type="email"
          required
          placeholder="you@organization.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-organization">
          Organization <span className="text-red-500">*</span>
        </Label>
        <Input
          id="demo-organization"
          name="organization"
          type="text"
          required
          placeholder="Your organization name"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-orgType">
          Organization type <span className="text-red-500">*</span>
        </Label>
        <select
          id="demo-orgType"
          name="orgType"
          required
          defaultValue=""
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Select an organization type
          </option>
          {orgTypeValues.map((v) => (
            <option key={v} value={v}>
              {ORG_TYPE_LABELS[v]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-message">Anything we should know? (optional)</Label>
        <Textarea
          id="demo-message"
          name="message"
          maxLength={2000}
          placeholder="Tell us about your trips, timeline, or questions."
          rows={3}
        />
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <TurnstileWidget
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onVerify={setTurnstileToken}
        onExpire={() => setTurnstileToken("")}
      />

      {status.kind === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {status.message}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Schedule Walkthrough"}
      </Button>
    </form>
  );
}
