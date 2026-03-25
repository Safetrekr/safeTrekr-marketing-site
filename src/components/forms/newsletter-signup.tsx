"use client";

/**
 * ST-901: Newsletter Signup with Double Opt-In
 *
 * Compact inline form with an email input and Subscribe button. Designed
 * to be placed in the footer, blog sidebar, or standalone sections.
 *
 * Flow:
 * 1. User enters email and clicks Subscribe
 * 2. Server action inserts into `newsletter_subscribers` with a
 *    `confirmation_token` (double opt-in)
 * 3. Success message instructs user to check their email
 *
 * Accessibility:
 * - Proper label association via `aria-label` on the input
 * - Error/success messages use `role="alert"` and `aria-live="polite"`
 * - Submit button is disabled during pending state
 * - Focus returns to input after error for easy retry
 *
 * @see src/actions/subscribe-newsletter.ts
 */

import { useRef, useState, useTransition } from "react";
import { Loader2, CheckCircle2, Mail } from "lucide-react";

import {
  subscribeNewsletter,
  type SubscribeResult,
} from "@/actions/subscribe-newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Compact newsletter signup form.
 *
 * Renders an inline email input + subscribe button. On success, replaces
 * the form with a confirmation message. On error, displays the error
 * inline beneath the form.
 */
export function NewsletterSignup() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SubscribeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string | null;

    // Client-side quick check before hitting the server.
    if (!email || email.trim().length === 0) {
      setError("Please enter your email address.");
      inputRef.current?.focus();
      return;
    }

    startTransition(async () => {
      try {
        const response = await subscribeNewsletter(formData);

        if (response.success) {
          setResult(response);
        } else {
          setError(response.error ?? "Something went wrong. Please try again.");
          inputRef.current?.focus();
        }
      } catch {
        setError("An unexpected error occurred. Please try again later.");
        inputRef.current?.focus();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Success state
  // -------------------------------------------------------------------------

  if (result?.success) {
    return (
      <div
        className="flex items-center gap-3 rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-4"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          className="h-5 w-5 shrink-0 text-[var(--color-primary-600)]"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-[var(--color-foreground)]">
          {result.message}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Form state
  // -------------------------------------------------------------------------

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex gap-2"
        aria-label="Newsletter signup"
      >
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-foreground)]"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            aria-label="Email address for newsletter"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : undefined}
            className="pl-9"
            disabled={isPending}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              <span className="sr-only">Subscribing...</span>
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>

      {error && (
        <p
          id="newsletter-error"
          className="mt-2 text-sm text-[var(--color-destructive)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
