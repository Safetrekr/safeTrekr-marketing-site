"use client";

/**
 * Newsletter signup form.
 * Subscribes the user to the marketing newsletter and fires a team
 * notification so sales sees the signup immediately.
 */

import React, { useRef, useState, useTransition } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/actions/subscribe-newsletter";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@/components/forms/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("turnstileToken", turnstileToken);

    startTransition(async () => {
      const result = await subscribeNewsletter(fd);
      if (result.success) {
        setStatus({
          kind: "success",
          message: result.message ?? "Subscribed.",
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
      <p className="text-sm text-emerald-700" role="status">
        {status.message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="pl-10"
            aria-label="Email address for newsletter"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isPending}
        >
          {isPending ? "..." : "Subscribe"}
        </Button>
      </div>

      {/* Honeypot — hidden from humans, auto-filled by bots. */}
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
    </form>
  );
}
