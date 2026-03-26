"use client";

/**
 * Contact Form - Preview Mode
 * Forms are disabled in static export preview.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a preview site. Forms are not functional. For the live site, visit safetrekr.com");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Contact us">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Preview mode - Form submission disabled
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contact-firstName">First name <span className="text-red-500">*</span></Label>
          <Input id="contact-firstName" type="text" placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-lastName">Last name <span className="text-red-500">*</span></Label>
          <Input id="contact-lastName" type="text" placeholder="Last name" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email address <span className="text-red-500">*</span></Label>
        <Input id="contact-email" type="email" placeholder="you@organization.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-subject">Subject <span className="text-red-500">*</span></Label>
        <Input id="contact-subject" type="text" placeholder="What can we help you with?" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message <span className="text-red-500">*</span></Label>
        <Textarea id="contact-message" placeholder="Tell us more about your inquiry..." rows={5} />
      </div>

      <Button type="submit" variant="primary" size="md" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
