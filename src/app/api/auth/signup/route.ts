import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { email, password, name, role, team } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ success: false, error: "필수 항목을 입력하세요" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Auth 유저 생성
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
  }

  // academy_users 테이블에 프로필 생성
  const { error: profileError } = await supabase.from("academy_users").insert({
    id: authData.user.id,
    email,
    name,
    role: role || "student",
    team: team || "",
    status: "active",
  });

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { userId: authData.user.id } });
}
