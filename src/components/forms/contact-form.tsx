"use client";

/**
 * ST-828: Contact Form
 *
 * Single-step contact form for general inquiries. Fields: firstName,
 * lastName, email, subject, message (+ optional organization).
 *
 * Security layers:
 * - Hidden honeypot field (`company_website`) -- bots auto-fill, humans never see it
 * - Cloudflare Turnstile (invisible mode) -- CAPTCHA verification
 * - Server-side Zod validation via the unified submitForm action
 *
 * @see src/actions/submit-form.ts -- 8-layer security pipeline
 * @see src/lib/validation/schemas.ts -- contactSchema
 */

import React, { useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";

import { submitForm, type SubmitFormResult } from "@/actions/submit-form";
import {
  contactSchema,
  type ContactFormData,
} from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

// ---------------------------------------------------------------------------
// FormField wrapper (local to this module)
// ---------------------------------------------------------------------------

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  htmlFor,
  error,
  required,
  children,
}: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span
            className="ml-0.5 text-[var(--color-destructive)]"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </Label>

      {children}

      {error && (
        <p
          id={errorId}
          className="text-sm text-[var(--color-destructive)]"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ContactForm
// ---------------------------------------------------------------------------

export function ContactForm() {
  // -----------------------------------------------------------------------
  // Form state
  // -----------------------------------------------------------------------

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      organization: "",
      subject: "",
      message: "",
      company_website: "",
      turnstileToken: "",
    },
  });

  // -----------------------------------------------------------------------
  // Submission state
  // -----------------------------------------------------------------------

  const [submitResult, setSubmitResult] = useState<SubmitFormResult | null>(
    null,
  );
  const [serverError, setServerError] = useState<string | null>(null);

  // -----------------------------------------------------------------------
  // Turnstile
  // -----------------------------------------------------------------------

  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  const handleTurnstileVerify = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: true });
    },
    [setValue],
  );

  const handleTurnstileExpire = useCallback(() => {
    setValue("turnstileToken", "", { shouldValidate: false });
    turnstileRef.current?.reset();
  }, [setValue]);

  // -----------------------------------------------------------------------
  // Form submission
  // -----------------------------------------------------------------------

  const onSubmit = async (data: ContactFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("formType", "contact");

    // Append all fields to FormData for the server action.
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    }

    try {
      const result = await submitForm(formData);
      setSubmitResult(result);

      if (!result.success && result.error) {
        setServerError(result.error);
        // Reset Turnstile on failure so the user can retry.
        turnstileRef.current?.reset();
        setValue("turnstileToken", "", { shouldValidate: false });
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again later.");
      turnstileRef.current?.reset();
      setValue("turnstileToken", "", { shouldValidate: false });
    }
  };

  // -----------------------------------------------------------------------
  // Success state
  // -----------------------------------------------------------------------

  if (submitResult?.success) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          className="h-12 w-12 text-[var(--color-primary-600)]"
          aria-hidden="true"
        />
        <p className="text-body-lg font-medium text-[var(--color-foreground)]">
          {submitResult.message}
        </p>
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4"
      aria-label="Contact us"
    >
      {/* ── Server Error ── */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--color-destructive)]/20 bg-[var(--color-destructive)]/5 p-3 text-sm text-[var(--color-destructive)]"
        >
          {serverError}
        </div>
      )}

      {/* ── Name row ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="First name"
          htmlFor="contact-firstName"
          error={errors.firstName?.message}
          required
        >
          <Input
            id="contact-firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-invalid={!!errors.firstName}
            aria-describedby={
              errors.firstName ? "contact-firstName-error" : undefined
            }
            {...register("firstName")}
          />
        </FormField>

        <FormField
          label="Last name"
          htmlFor="contact-lastName"
          error={errors.lastName?.message}
          required
        >
          <Input
            id="contact-lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-invalid={!!errors.lastName}
            aria-describedby={
              errors.lastName ? "contact-lastName-error" : undefined
            }
            {...register("lastName")}
          />
        </FormField>
      </div>

      {/* ── Email ── */}
      <FormField
        label="Email address"
        htmlFor="contact-email"
        error={errors.email?.message}
        required
      >
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          placeholder="you@organization.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email")}
        />
      </FormField>

      {/* ── Subject ── */}
      <FormField
        label="Subject"
        htmlFor="contact-subject"
        error={errors.subject?.message}
        required
      >
        <Input
          id="contact-subject"
          type="text"
          placeholder="What can we help you with?"
          aria-invalid={!!errors.subject}
          aria-describedby={
            errors.subject ? "contact-subject-error" : undefined
          }
          {...register("subject")}
        />
      </FormField>

      {/* ── Message ── */}
      <FormField
        label="Message"
        htmlFor="contact-message"
        error={errors.message?.message}
        required
      >
        <Textarea
          id="contact-message"
          placeholder="Tell us more about your inquiry..."
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          {...register("message")}
        />
      </FormField>

      {/* ── Honeypot ── */}
      <div
        className="absolute -left-[9999px] -top-[9999px]"
        aria-hidden="true"
      >
        <label htmlFor="contact-company-website">Company website</label>
        <input
          id="contact-company-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      {/* ── Turnstile ── */}
      <TurnstileWidget
        ref={turnstileRef}
        siteKey={TURNSTILE_SITE_KEY}
        onVerify={handleTurnstileVerify}
        onExpire={handleTurnstileExpire}
        onError={(code) =>
          console.error("[ContactForm] Turnstile error:", code)
        }
      />

      {/* ── Submit ── */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
