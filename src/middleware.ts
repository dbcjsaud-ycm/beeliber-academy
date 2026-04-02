import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  // 개발 모드: Supabase 연결 실패해도 통과
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user && (request.nextUrl.pathname.startsWith("/academy") || request.nextUrl.pathname.startsWith("/admin"))) {
      // 로컬 세션 쿠키로 폴백 체크
      const localSession = request.cookies.get("academy_session");
      if (localSession) return supabaseResponse;

      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  } catch {
    // Supabase 연결 실패 시 로컬 세션만 체크
    const localSession = request.cookies.get("academy_session");
    if (!localSession && (request.nextUrl.pathname.startsWith("/academy") || request.nextUrl.pathname.startsWith("/admin"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/academy/:path*", "/admin/:path*"],
};
