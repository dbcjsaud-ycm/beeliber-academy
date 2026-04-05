import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/supabase/requireAdmin";

// POST — add (or deduct) credits for a user
export async function POST(req: NextRequest) {
  try {
    const caller = await requireAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, amount, note } = body as {
      userId: string;
      amount: number;
      note?: string;
    };

    if (!userId || typeof amount !== "number" || amount === 0) {
      return NextResponse.json(
        { success: false, error: "userId와 0이 아닌 amount가 필요합니다" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Upsert credit_accounts — create if not exists, otherwise increment
    const { data, error } = await admin.rpc("admin_adjust_credits", {
      p_user_id: userId,
      p_amount: amount,
      p_note: note ?? null,
      p_granted_by: caller.id,
    });

    if (error) {
      // Fallback: manual upsert if RPC doesn't exist yet
      const { data: existing } = await admin
        .from("credit_accounts")
        .select("balance, user_id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        const newBalance = Math.max(0, (existing.balance ?? 0) + amount);
        const { data: updated, error: updateError } = await admin
          .from("credit_accounts")
          .update({ balance: newBalance })
          .eq("user_id", userId)
          .select("balance")
          .single();

        if (updateError) {
          return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: { balance: updated.balance } });
      } else {
        const initialBalance = Math.max(0, amount);
        const { data: inserted, error: insertError } = await admin
          .from("credit_accounts")
          .insert({ user_id: userId, balance: initialBalance })
          .select("balance")
          .single();

        if (insertError) {
          return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: { balance: inserted.balance } });
      }
    }

    return NextResponse.json({ success: true, data: { balance: data } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET — fetch credit balances for a list of userIds (query param: ids=a,b,c)
export async function GET(req: NextRequest) {
  try {
    const caller = await requireAdmin();
    if (!caller) {
      return NextResponse.json({ success: false, error: "권한 없음" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

    if (ids.length === 0) {
      return NextResponse.json({ success: true, data: {} });
    }

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("credit_accounts")
      .select("user_id, balance")
      .in("user_id", ids);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Return as { userId: balance } map
    const map: Record<string, number> = {};
    for (const row of data ?? []) {
      map[row.user_id] = row.balance ?? 0;
    }
    return NextResponse.json({ success: true, data: map });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "서버 오류";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
