"use client";

/**
 * Demo Request Form - Preview Mode
 * Forms are disabled in static export preview.
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DemoRequestForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a preview site. Forms are not functional. For the live site, visit safetrekr.com");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Schedule a walkthrough">
      <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Preview mode - Form submission disabled
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="demo-firstName">First name <span className="text-red-500">*</span></Label>
          <Input id="demo-firstName" type="text" placeholder="First name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="demo-lastName">Last name <span className="text-red-500">*</span></Label>
          <Input id="demo-lastName" type="text" placeholder="Last name" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-email">Work email <span className="text-red-500">*</span></Label>
        <Input id="demo-email" type="email" placeholder="you@organization.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-organization">Organization <span className="text-red-500">*</span></Label>
        <Input id="demo-organization" type="text" placeholder="Your organization name" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="demo-role">Your role</Label>
        <Input id="demo-role" type="text" placeholder="e.g., Trip Coordinator, Administrator" />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Schedule Walkthrough
      </Button>
    </form>
  );
}
