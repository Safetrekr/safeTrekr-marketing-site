"use client";

/**
 * Contact form — submits to submitForm Server Action with formType=contact.
 * Delivers to SALES_EMAIL so the team can respond.
 */

import React, { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitForm } from "@/actions/submit-form";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("formType", "contact");
    fd.set("turnstileToken", turnstileToken);

    startTransition(async () => {
      const result = await submitForm(fd);
      if (result.success) {
        setStatus({
          kind: "success",
          message: result.message ?? "Message sent.",
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
      aria-label="Contact us"
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-firstName">
            First name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-firstName"
            name="firstName"
            type="text"
            required
            placeholder="First name"
            autoComplete="given-name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-lastName">
            Last name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-lastName"
            name="lastName"
            type="text"
            required
            placeholder="Last name"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">
          Email address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="you@organization.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-organization">Organization</Label>
        <Input
          id="contact-organization"
          name="organization"
          type="text"
          placeholder="Your organization (optional)"
          autoComplete="organization"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">
          Subject <span className="text-red-500">*</span>
        </Label>
        <Input
          id="contact-subject"
          name="subject"
          type="text"
          required
          placeholder="What can we help you with?"
          maxLength={200}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">
          Message <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          placeholder="Tell us more about your inquiry..."
          rows={5}
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
        size="md"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
