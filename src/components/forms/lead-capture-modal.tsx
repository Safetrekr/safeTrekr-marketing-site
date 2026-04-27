"use client";

/**
 * Sample binder request modal.
 *
 * STATUS: INACTIVE.
 *   No page currently renders this component — sample binders were
 *   disabled site-wide because the underlying assets aren't ready yet.
 *   The component, its schema (sampleBinderSchema), its submit-form
 *   branch (sample_binder_download), and its tests are all retained
 *   so re-activation is a matter of adding CTAs back to the pages
 *   that need them — no wiring-up work required.
 *
 * When real binder assets exist: swap the success message for a signed
 * S3 (or equivalent) download URL and remove this status note. See the
 * TODO at the bottom of this file.
 */

import React, { useRef, useState, useTransition } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitForm } from "@/actions/submit-form";
import { binderTypeValues } from "@/lib/validation/schemas";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const BINDER_LABELS: Record<(typeof binderTypeValues)[number], string> = {
  k12: "K-12",
  mission: "Mission / Church",
  corporate: "Corporate",
  "study-abroad": "Study Abroad",
};

interface LeadCaptureModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  /**
   * Pre-selects a binder type if the button context implies one
   * (e.g., a "Sample K-12 binder" CTA on the K-12 solutions page).
   */
  binderType?: (typeof binderTypeValues)[number];
}

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function LeadCaptureModal({
  trigger,
  open,
  onOpenChange,
  title = "Request a Sample Binder",
  description = "Tell us where to send it and we'll email a sample to you shortly.",
  binderType,
}: LeadCaptureModalProps) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("formType", "sample_binder_download");
    fd.set("turnstileToken", turnstileToken);

    startTransition(async () => {
      const result = await submitForm(fd);
      if (result.success) {
        setStatus({
          kind: "success",
          message:
            result.message ??
            "Thanks — we'll email you a sample binder shortly.",
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

  const dialogProps = trigger ? {} : { open, onOpenChange };

  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {status.kind === "success" ? (
          <div
            className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
            role="status"
          >
            {status.message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lead-email"
                name="email"
                type="email"
                required
                placeholder="you@organization.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="lead-firstName">
                  First name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lead-firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="First name"
                  autoComplete="given-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lead-lastName">
                  Last name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lead-lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last name"
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-organization">Organization</Label>
              <Input
                id="lead-organization"
                name="organization"
                type="text"
                placeholder="Your organization (optional)"
                autoComplete="organization"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lead-binderType">
                Binder type <span className="text-red-500">*</span>
              </Label>
              <select
                id="lead-binderType"
                name="binderType"
                required
                defaultValue={binderType ?? ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Select binder type
                </option>
                {binderTypeValues.map((v) => (
                  <option key={v} value={v}>
                    {BINDER_LABELS[v]}
                  </option>
                ))}
              </select>
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
              className="w-full"
              disabled={isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              {isPending ? "Sending..." : "Request Sample"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// TODO: Once sample binders are hosted (e.g., signed S3 URLs), update the
// submitForm success path to return the download URL and render it here
// instead of the "we'll email you" message.
