/**
 * Resources Index Page (/resources)
 * Redirects to the FAQ hub as the primary resources destination.
 */

import { redirect } from "next/navigation";

export default function ResourcesPage() {
  redirect("/resources/faq");
}
