"use client";

/**
 * ST-829: Lead Capture Modal
 *
 * Compact modal form for gated content downloads (sample binders, guides).
 * Uses shadcn/ui Dialog for the modal shell and integrates with the unified
 * submitForm server action for the `sample_binder_download` form type.
 *
 * The modal is designed for minimal friction:
 * - Only essential fields (email, firstName, lastName, binderType)
 * - Optional binderType pre-selection via the `binderType` prop
 * - Success state shows a download link instead of navigating away
 *
 * Security layers:
 * - Hidden honeypot field (`company_website`) -- bots auto-fill, humans never see it
 * - Cloudflare Turnstile (invisible mode) -- CAPTCHA verification
 * - Server-side Zod validation via the unified submitForm action
 *
 * @see src/actions/submit-form.ts -- 8-layer security pipeline
 * @see src/lib/validation/schemas.ts -- sampleBinderSchema
 */

import React, { useRef, useState, useCallback, useEffect, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, Download } from "lucide-react";

import { submitForm, type SubmitFormResult } from "@/actions/submit-form";
import {
  sampleBinderSchema,
  type SampleBinderFormData,
  type BinderType,
  binderTypeValues,
} from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Human-readable labels for binder type enum values. */
const BINDER_TYPE_LABELS: Record<BinderType, string> = {
  k12: "K-12 School",
  mission: "Mission Trip",
  corporate: "Corporate Travel",
  "study-abroad": "Study Abroad",
};

/**
 * Download URLs per binder type. In production, these would come from a
 * CMS or environment variable. For now, they point to static assets.
 */
const BINDER_DOWNLOAD_URLS: Record<BinderType, string> = {
  k12: "/downloads/safetrekr-sample-binder-k12.pdf",
  mission: "/downloads/safetrekr-sample-binder-mission.pdf",
  corporate: "/downloads/safetrekr-sample-binder-corporate.pdf",
  "study-abroad": "/downloads/safetrekr-sample-binder-study-abroad.pdf",
};

// ---------------------------------------------------------------------------
// NativeSelect (local)
// ---------------------------------------------------------------------------

const NativeSelect = forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-9 w-full appearance-none rounded-md border border-border bg-transparent px-3 py-1 pr-8 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%234d5153%22%20d%3D%22M6%208.825a.7.7%200%2001-.5-.206L1.706%204.825a.7.7%200%20011-1l3.294%203.3%203.294-3.3a.7.7%200%20011%201L6.5%208.619a.7.7%200%2001-.5.206z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:right_12px_center] bg-no-repeat",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
NativeSelect.displayName = "NativeSelect";

// ---------------------------------------------------------------------------
// FormField wrapper (local)
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
// Props
// ---------------------------------------------------------------------------

export interface LeadCaptureModalProps {
  /** Controls modal visibility. */
  open: boolean;

  /** Callback when the modal's open state changes (e.g., close button, overlay click). */
  onOpenChange: (open: boolean) => void;

  /**
   * Pre-selects the binder type. When provided, the binder type select
   * is hidden and the value is submitted automatically.
   */
  binderType?: BinderType;

  /** Modal title. Defaults to "Download Sample Binder". */
  title?: string;

  /** Modal description text below the title. */
  description?: string;
}

// ---------------------------------------------------------------------------
// LeadCaptureModal
// ---------------------------------------------------------------------------

export function LeadCaptureModal({
  open,
  onOpenChange,
  binderType: preselectedBinderType,
  title = "Download Sample Binder",
  description = "Enter your details below to access the sample binder. We will send you a download link.",
}: LeadCaptureModalProps) {
  // -----------------------------------------------------------------------
  // Form state
  // -----------------------------------------------------------------------

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SampleBinderFormData>({
    resolver: zodResolver(sampleBinderSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      organization: "",
      binderType: preselectedBinderType,
      company_website: "",
      turnstileToken: "",
    },
  });

  // Sync pre-selected binder type when prop changes.
  useEffect(() => {
    if (preselectedBinderType) {
      setValue("binderType", preselectedBinderType);
    }
  }, [preselectedBinderType, setValue]);

  // -----------------------------------------------------------------------
  // Submission state
  // -----------------------------------------------------------------------

  const [submitResult, setSubmitResult] = useState<SubmitFormResult | null>(
    null,
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const [downloadBinderType, setDownloadBinderType] =
    useState<BinderType | null>(null);

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
  // Modal open/close lifecycle
  // -----------------------------------------------------------------------

  /**
   * When the modal opens, reset the form to a clean state. When it closes
   * after a successful submission, also clear the success state so the
   * form is fresh if the modal is re-opened.
   */
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Delay reset slightly so the close animation can complete.
      setTimeout(() => {
        reset({
          email: "",
          firstName: "",
          lastName: "",
          organization: "",
          binderType: preselectedBinderType,
          company_website: "",
          turnstileToken: "",
        });
        setSubmitResult(null);
        setServerError(null);
        setDownloadBinderType(null);
      }, 200);
    }

    onOpenChange(nextOpen);
  };

  // -----------------------------------------------------------------------
  // Form submission
  // -----------------------------------------------------------------------

  const onSubmit = async (data: SampleBinderFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("formType", "sample_binder_download");

    // Append all fields to FormData for the server action.
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    }

    try {
      const result = await submitForm(formData);
      setSubmitResult(result);

      if (result.success) {
        // Store the binder type for the download link.
        setDownloadBinderType(data.binderType);
      }

      if (!result.success && result.error) {
        setServerError(result.error);
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
  // Render
  // -----------------------------------------------------------------------

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* ── Success state ── */}
        {submitResult?.success ? (
          <div
            className="flex flex-col items-center gap-4 py-4 text-center"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2
              className="h-10 w-10 text-[var(--color-primary-600)]"
              aria-hidden="true"
            />
            <p className="text-body-md font-medium text-[var(--color-foreground)]">
              {submitResult.message}
            </p>

            {downloadBinderType && (
              <Button asChild variant="primary" size="md">
                <a
                  href={BINDER_DOWNLOAD_URLS[downloadBinderType]}
                  download
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download Now
                </a>
              </Button>
            )}
          </div>
        ) : (
          /* ── Form ── */
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
            aria-label="Download sample binder"
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

            {/* ── Email ── */}
            <FormField
              label="Email address"
              htmlFor="lead-email"
              error={errors.email?.message}
              required
            >
              <Input
                id="lead-email"
                type="email"
                autoComplete="email"
                placeholder="you@organization.com"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "lead-email-error" : undefined
                }
                {...register("email")}
              />
            </FormField>

            {/* ── Name row ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="First name"
                htmlFor="lead-firstName"
                error={errors.firstName?.message}
                required
              >
                <Input
                  id="lead-firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={
                    errors.firstName ? "lead-firstName-error" : undefined
                  }
                  {...register("firstName")}
                />
              </FormField>

              <FormField
                label="Last name"
                htmlFor="lead-lastName"
                error={errors.lastName?.message}
                required
              >
                <Input
                  id="lead-lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={
                    errors.lastName ? "lead-lastName-error" : undefined
                  }
                  {...register("lastName")}
                />
              </FormField>
            </div>

            {/* ── Binder Type (hidden when pre-selected) ── */}
            {!preselectedBinderType && (
              <FormField
                label="Binder type"
                htmlFor="lead-binderType"
                error={errors.binderType?.message}
                required
              >
                <NativeSelect
                  id="lead-binderType"
                  aria-invalid={!!errors.binderType}
                  aria-describedby={
                    errors.binderType ? "lead-binderType-error" : undefined
                  }
                  defaultValue=""
                  {...register("binderType")}
                >
                  <option value="" disabled>
                    Select binder type
                  </option>
                  {binderTypeValues.map((value) => (
                    <option key={value} value={value}>
                      {BINDER_TYPE_LABELS[value]}
                    </option>
                  ))}
                </NativeSelect>
              </FormField>
            )}

            {/* ── Honeypot ── */}
            <div
              className="absolute -left-[9999px] -top-[9999px]"
              aria-hidden="true"
            >
              <label htmlFor="lead-company-website">Company website</label>
              <input
                id="lead-company-website"
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
                console.error("[LeadCaptureModal] Turnstile error:", code)
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
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Get Sample Binder
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
