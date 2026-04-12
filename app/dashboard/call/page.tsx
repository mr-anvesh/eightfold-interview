import { redirect } from "next/navigation";
import { CallSession } from "@/components/dashboard/call-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SearchParams = {
  role?: string;
  company?: string;
  skills?: string;
  focus?: string;
  description?: string;
};

export default async function CallPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  if (!params.role || !params.skills) {
    redirect("/dashboard?tab=start");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <CallSession
      context={{
        role: params.role,
        company: params.company || "Generic",
        skills: params.skills,
        focus: params.focus || params.skills,
        description: params.description || "Interview context provided by candidate.",
      }}
      candidateName={profile?.full_name || user.user_metadata?.full_name || "Candidate"}
    />
  );
}
