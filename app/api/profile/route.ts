import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { full_name } = body;

  if (!full_name || typeof full_name !== "string" || !full_name.trim()) {
    return NextResponse.json({ error: "full_name is required." }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update({ full_name: full_name.trim() })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
