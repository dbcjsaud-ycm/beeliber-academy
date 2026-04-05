import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { email, password, name, loginId } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ success: false, error: "이름, 아이디, 비밀번호를 모두 입력하세요" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // 1) Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
  }

  // 2) Insert profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    email,
    display_name: name,
    account_type: "student",
    is_active: true,
    metadata: { loginId: loginId || email },
  });

  if (profileError) {
    // Rollback: delete auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { userId: authData.user.id } });
}
