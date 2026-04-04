export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-gray-500 text-sm">
            Phase 1 complete — auth is working. Lesson engine coming next.
          </p>
        </div>
      </div>
    </main>
  );
}
