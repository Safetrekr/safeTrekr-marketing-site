"use client";

/**
 * Newsletter Signup - Preview Mode
 * Forms are disabled in static export preview.
 */

import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSignup() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a preview site. Newsletter signup is not available. For the live site, visit safetrekr.com");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="email"
          placeholder="Enter your email"
          className="pl-10"
          aria-label="Email address for newsletter"
        />
      </div>
      <Button type="submit" variant="primary" size="md">
        Subscribe
      </Button>
    </form>
  );
}
