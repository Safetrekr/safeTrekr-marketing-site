"use client";

/**
 * Lead Capture Modal - Preview Mode
 * Forms are disabled in static export preview.
 */

import React from "react";
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

interface LeadCaptureModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  binderType?: string;
}

export function LeadCaptureModal({
  trigger,
  open,
  onOpenChange,
  title = "Download Sample Binder",
  description = "Enter your details to download a sample safety binder.",
}: LeadCaptureModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This is a preview site. Downloads are not available. For the live site, visit safetrekr.com");
  };

  const dialogProps = trigger
    ? {}
    : { open, onOpenChange };

  return (
    <Dialog {...dialogProps}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Preview mode - Downloads disabled
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lead-email">Email <span className="text-red-500">*</span></Label>
            <Input id="lead-email" type="email" placeholder="you@organization.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-firstName">First name <span className="text-red-500">*</span></Label>
              <Input id="lead-firstName" type="text" placeholder="First name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-lastName">Last name <span className="text-red-500">*</span></Label>
              <Input id="lead-lastName" type="text" placeholder="Last name" />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Sample
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
