import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSuperadmin } from "@/lib/supabase/requireSuperadmin";

// PATCH — update profile (name, role, team, status, optionally reset password)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, loginId, password, role, team, status } = body;

  const admin = createAdminClient();

  // Fetch existing metadata to preserve fields not managed by this form (progress, passRate, submissions)
  const { data: existing } = await admin
    .from("profiles")
    .select("metadata")
    .eq("id", id)
    .single();

  const existingMeta = (existing?.metadata as Record<string, unknown>) ?? {};

  // Update profile — merge metadata instead of overwriting
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .update({
      display_name: name,
      account_type: role,
      is_active: status !== "inactive" && status !== "suspended",
      metadata: {
        ...existingMeta,
        loginId: loginId || existingMeta.loginId || "",
        team: team ?? existingMeta.team ?? "",
        status: status || "active",
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  // Optionally reset password
  if (password) {
    const { error: pwError } = await admin.auth.admin.updateUserById(id, { password });
    if (pwError) {
      return NextResponse.json({ success: false, error: pwError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, data: profile });
}

// DELETE — remove profile + auth user
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await requireSuperadmin();
  if (!caller) {
    return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
  }

  const { id } = await params;
  const admin = createAdminClient();

  // Delete profile first (cascade or manual)
  await admin.from("profiles").delete().eq("id", id);

  // Delete auth user
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
