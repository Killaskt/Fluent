import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";

const PROTECTED_PREFIX = "/dashboard";
const AUTH_PATHS = ["/sign-in", "/sign-up", "/waitlist"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — required by @supabase/ssr. Do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith(PROTECTED_PREFIX);
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));

  // Unauthenticated user hitting a protected route → sign in
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting a protected route → check admin / waitlist status
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin, waitlist")
      .eq("id", user.id)
      .single() as { data: { is_admin: boolean; waitlist: boolean } | null };

    if (!profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/waitlist";
      return NextResponse.redirect(url);
    }
  }

  // Authenticated + admin user hitting an auth page → dashboard
  if (isAuthPath && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single() as { data: { is_admin: boolean } | null };

    if (profile?.is_admin) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
