import { redirect } from "next/navigation";

// Root redirects to sign-in. The landing page will live here post-validation.
export default function RootPage() {
  redirect("/sign-in");
}
