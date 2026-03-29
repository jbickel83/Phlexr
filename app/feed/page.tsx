import { redirect } from "next/navigation";
import AppShellPage from "@/app/app-shell/page";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export default async function FeedPage() {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/");
    }
  }

  return <AppShellPage />;
}
