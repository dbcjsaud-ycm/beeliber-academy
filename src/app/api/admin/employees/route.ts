import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperadmin } from "@/lib/supabase/requireSuperadmin";

// GET — list all academy users (non-superadmin)
export async function GET() {
  const user = await requireSuperadmin();
  if (!user) {
    return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, email, display_name, account_type, is_active, metadata, created_at")
    .neq("account_type", "superadmin")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST — create new academy user
export async function POST(req: NextRequest) {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
  }

  const body = await req.json();
  const { name, loginId, password, role, team, status } = body;

  if (!name || !loginId || !password) {
    return NextResponse.json({ success: false, error: "이름, 아이디, 비밀번호는 필수입니다" }, { status: 400 });
  }

  const email = loginId.includes("@") ? loginId : `${loginId}@beeliber.internal`;
  const admin = createAdminClient();

  // Create Supabase auth user
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return NextResponse.json({ success: false, error: authError.message }, { status: 400 });
  }

  // Insert profile
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .insert({
      id: authData.user.id,
      email,
      display_name: name,
      account_type: role || "employee",
      is_active: status !== "inactive" && status !== "suspended",
      metadata: {
        loginId,
        team: team || "",
        status: status || "active",
        progress: 0,
        passRate: 0,
        submissions: 0,
      },
    })
    .select()
    .single();

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: profile });
}
