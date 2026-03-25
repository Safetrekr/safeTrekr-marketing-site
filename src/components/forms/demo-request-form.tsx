"use client";

/**
 * ST-827: Demo Request Form
 *
 * 2-step progressive disclosure form for requesting a SafeTrekr demo.
 *
 * Step 1 (low friction): email + organization -- just enough to capture
 * intent even if the user abandons before completing Step 2.
 *
 * Step 2 (qualification): firstName, lastName, orgType, tripsPerYear,
 * demoFormat, message -- richer qualification data for the sales team.
 *
 * Security layers:
 * - Hidden honeypot field (`company_website`) -- bots auto-fill, humans never see it
 * - Cloudflare Turnstile (invisible mode) -- CAPTCHA verification
 * - Server-side Zod validation via the unified submitForm action
 *
 * @see src/actions/submit-form.ts -- 8-layer security pipeline
 * @see src/lib/validation/schemas.ts -- demoRequestSchema
 */

import React, { useRef, useState, useCallback, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import { submitForm, type SubmitFormResult } from "@/actions/submit-form";
import {
  demoRequestSchema,
  type DemoRequestFormData,
  orgTypeValues,
  demoFormatValues,
} from "@/lib/validation/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

/** Human-readable labels for orgType enum values. */
const ORG_TYPE_LABELS: Record<(typeof orgTypeValues)[number], string> = {
  k12: "K-12 School / District",
  higher_education: "Higher Education",
  churches_missions: "Church / Mission Organization",
  corporate: "Corporate",
  sports: "Sports Organization",
  other: "Other",
};

/** Human-readable labels for demoFormat enum values. */
const DEMO_FORMAT_LABELS: Record<(typeof demoFormatValues)[number], string> = {
  "live-video": "Live Video Call",
  "in-person": "In-Person Demo",
  "self-guided": "Self-Guided Tour",
  group: "Group Demo",
};

/** Options for the trips-per-year select. */
const TRIPS_PER_YEAR_OPTIONS = [
  { value: "1-5", label: "1 - 5 trips" },
  { value: "6-15", label: "6 - 15 trips" },
  { value: "16-30", label: "16 - 30 trips" },
  { value: "31-50", label: "31 - 50 trips" },
  { value: "50+", label: "50+ trips" },
] as const;

/** Total number of steps in the progressive form. */
const TOTAL_STEPS = 2;

// ---------------------------------------------------------------------------
// NativeSelect
// ---------------------------------------------------------------------------

/**
 * Styled native `<select>` element that matches the project's Input styling.
 *
 * Uses a native `<select>` for maximum accessibility: full screen reader
 * support, native keyboard navigation, and mobile-optimized pickers on
 * iOS/Android -- without requiring @radix-ui/react-select.
 */
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
// FormField wrapper
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
// Step Indicator
// ---------------------------------------------------------------------------

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--color-foreground)]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-[var(--color-muted-foreground)]">
          {currentStep === 1 ? "Basic info" : "Details"}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary-600)] transition-all duration-300"
          style={{ width: `${String(progressPercent)}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DemoRequestForm
// ---------------------------------------------------------------------------

export function DemoRequestForm() {
  // -----------------------------------------------------------------------
  // Step management
  // -----------------------------------------------------------------------

  const [currentStep, setCurrentStep] = useState(1);

  // -----------------------------------------------------------------------
  // Form state
  // -----------------------------------------------------------------------

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<DemoRequestFormData>({
    resolver: zodResolver(demoRequestSchema),
    defaultValues: {
      email: "",
      organization: "",
      firstName: "",
      lastName: "",
      orgType: undefined,
      tripsPerYear: "",
      demoFormat: undefined,
      message: "",
      company_website: "",
      turnstileToken: "",
    },
  });

  /**
   * Custom register for optional enum selects. Native selects store ""
   * when no option is chosen, but Zod `.enum().optional()` expects
   * `undefined` -- not an empty string. This wrapper converts "" to
   * `undefined` on change so client-side validation passes.
   */
  const registerDemoFormat = () => {
    const { onChange, ...rest } = register("demoFormat");
    return {
      ...rest,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "") {
          setValue("demoFormat", undefined, { shouldValidate: false });
        } else {
          void onChange(e);
        }
      },
    };
  };

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
  // Step navigation
  // -----------------------------------------------------------------------

  /**
   * Validates Step 1 fields before advancing. If validation passes,
   * moves to Step 2. If not, RHF displays field-level errors.
   */
  const handleContinue = async () => {
    const isValid = await trigger(["email", "organization"]);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // -----------------------------------------------------------------------
  // Form submission
  // -----------------------------------------------------------------------

  const onSubmit = async (data: DemoRequestFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append("formType", "demo_request");

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
      className="space-y-6"
      aria-label="Request a demo"
    >
      {/* ── Step Indicator ── */}
      <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      {/* ── Server Error ── */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-[var(--color-destructive)]/20 bg-[var(--color-destructive)]/5 p-3 text-sm text-[var(--color-destructive)]"
        >
          {serverError}
        </div>
      )}

      {/* ── Step 1: Email + Organization ── */}
      <div
        className={cn("space-y-4", currentStep !== 1 && "hidden")}
        aria-hidden={currentStep !== 1}
      >
        <FormField
          label="Email address"
          htmlFor="demo-email"
          error={errors.email?.message}
          required
        >
          <Input
            id="demo-email"
            type="email"
            autoComplete="email"
            placeholder="you@organization.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "demo-email-error" : undefined}
            {...register("email")}
          />
        </FormField>

        <FormField
          label="Organization"
          htmlFor="demo-organization"
          error={errors.organization?.message}
          required
        >
          <Input
            id="demo-organization"
            type="text"
            autoComplete="organization"
            placeholder="Your school, church, or organization"
            aria-invalid={!!errors.organization}
            aria-describedby={
              errors.organization ? "demo-organization-error" : undefined
            }
            {...register("organization")}
          />
        </FormField>

        <Button
          type="button"
          variant="primary"
          size="md"
          className="w-full"
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      {/* ── Step 2: Qualification Details ── */}
      <div
        className={cn("space-y-4", currentStep !== 2 && "hidden")}
        aria-hidden={currentStep !== 2}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="First name"
            htmlFor="demo-firstName"
            error={errors.firstName?.message}
            required
          >
            <Input
              id="demo-firstName"
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName ? "demo-firstName-error" : undefined
              }
              {...register("firstName")}
            />
          </FormField>

          <FormField
            label="Last name"
            htmlFor="demo-lastName"
            error={errors.lastName?.message}
            required
          >
            <Input
              id="demo-lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              aria-invalid={!!errors.lastName}
              aria-describedby={
                errors.lastName ? "demo-lastName-error" : undefined
              }
              {...register("lastName")}
            />
          </FormField>
        </div>

        <FormField
          label="Organization type"
          htmlFor="demo-orgType"
          error={errors.orgType?.message}
          required
        >
          <NativeSelect
            id="demo-orgType"
            aria-invalid={!!errors.orgType}
            aria-describedby={
              errors.orgType ? "demo-orgType-error" : undefined
            }
            defaultValue=""
            {...register("orgType")}
          >
            <option value="" disabled>
              Select organization type
            </option>
            {orgTypeValues.map((value) => (
              <option key={value} value={value}>
                {ORG_TYPE_LABELS[value]}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Trips per year"
            htmlFor="demo-tripsPerYear"
            error={errors.tripsPerYear?.message}
          >
            <NativeSelect
              id="demo-tripsPerYear"
              aria-invalid={!!errors.tripsPerYear}
              aria-describedby={
                errors.tripsPerYear ? "demo-tripsPerYear-error" : undefined
              }
              defaultValue=""
              {...register("tripsPerYear")}
            >
              <option value="">Select range (optional)</option>
              {TRIPS_PER_YEAR_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField
            label="Demo format"
            htmlFor="demo-demoFormat"
            error={errors.demoFormat?.message}
          >
            <NativeSelect
              id="demo-demoFormat"
              aria-invalid={!!errors.demoFormat}
              aria-describedby={
                errors.demoFormat ? "demo-demoFormat-error" : undefined
              }
              defaultValue=""
              {...registerDemoFormat()}
            >
              <option value="">Select format (optional)</option>
              {demoFormatValues.map((value) => (
                <option key={value} value={value}>
                  {DEMO_FORMAT_LABELS[value]}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </div>

        <FormField
          label="Message"
          htmlFor="demo-message"
          error={errors.message?.message}
        >
          <Textarea
            id="demo-message"
            placeholder="Tell us about your travel safety needs (optional)"
            rows={4}
            aria-invalid={!!errors.message}
            aria-describedby={
              errors.message ? "demo-message-error" : undefined
            }
            {...register("message")}
          />
        </FormField>

        {/* ── Honeypot ── */}
        <div
          className="absolute -left-[9999px] -top-[9999px]"
          aria-hidden="true"
        >
          <label htmlFor="demo-company-website">Company website</label>
          <input
            id="demo-company-website"
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
            console.error("[DemoRequestForm] Turnstile error:", code)
          }
        />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="sm:min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Submitting...
              </>
            ) : (
              "Request Demo"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
