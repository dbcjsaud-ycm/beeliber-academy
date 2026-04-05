import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

// Optional: comma-separated allowed domains, e.g. "beeliber.com,partner.com"
// Leave empty to allow all domains.
const ALLOWED_DOMAINS = (process.env.SIGNUP_ALLOWED_DOMAINS ?? "").split(",").map(d => d.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  const { email, password, name, loginId } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ success: false, error: "이름, 아이디, 비밀번호를 모두 입력하세요" }, { status: 400 });
  }

  // Server-side password length validation
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ success: false, error: "비밀번호는 6자 이상이어야 합니다" }, { status: 400 });
  }

  // Email domain allowlist (skip if env var not set)
  if (ALLOWED_DOMAINS.length > 0) {
    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    if (!ALLOWED_DOMAINS.includes(domain)) {
      return NextResponse.json({ success: false, error: "허용되지 않는 이메일 도메인입니다" }, { status: 403 });
    }
  }

  // Use anon client for signUp so Supabase's built-in rate limiting applies
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  // 1) Create auth user via signUp (rate-limited by Supabase)
  const { data: authData, error: authError } = await anonClient.auth.signUp({
    email,
    password,
    options: { data: { display_name: name } },
  });

  if (authError || !authData.user) {
    return NextResponse.json({ success: false, error: authError?.message ?? "회원가입 실패" }, { status: 400 });
  }

  // 2) Upsert profile via admin client (trigger may have already created the row)
  const admin = createAdminClient();
  const { error: profileError } = await admin.from("profiles").upsert({
    id: authData.user.id,
    email,
    display_name: name,
    account_type: "student",
    is_active: true,
    metadata: { loginId: loginId || email },
  });

  if (profileError) {
    // Rollback: delete auth user
    await admin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { userId: authData.user.id } });
}
