import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const nextPath = requestUrl.searchParams.get("next");
  const safeNextPath =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/app-shell?signedout=1";
  const redirectUrl = new URL(safeNextPath, request.url);
  let response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.signOut();

  request.cookies.getAll().forEach(({ name }) => {
    if (name.startsWith("sb-")) {
      response.cookies.set(name, "", {
        expires: new Date(0),
        maxAge: 0,
        path: "/",
      });
    }
  });

  return response;
}
