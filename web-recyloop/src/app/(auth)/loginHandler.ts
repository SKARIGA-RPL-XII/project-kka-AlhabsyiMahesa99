import { supabase } from "@/lib/supabase";

export const handleLogin = async (identifier: string, password: string) => {
  try {
    let email = identifier;
    const isEmail = identifier.includes('@');
    let profileId: string | null = null;

    if (!isEmail) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("full_name", identifier)
        .single();

      if (profileError || !profile) throw new Error("Username tidak ditemukan!");
      profileId = profile.id;
      email = profile.email;
    }

    // Cek status akun SEBELUM login auth agar user nonaktif tidak bisa membuat session.
    const { data: profileData, error: profileDataError } = await supabase
      .from("profiles")
      .select("id, role, is_active")
      .eq("email", email)
      .single();

    if (profileDataError || !profileData) {
      throw new Error("Akun tidak ditemukan!");
    }

    profileId = profileData.id;

    if (!profileData.is_active) {
      // Ambil alasan suspend terbaru agar user paham kenapa login ditolak.
      const { data: sanctionData } = await supabase
        .from("user_sanctions")
        .select("reason")
        .eq("user_id", profileId)
        .eq("action", "suspend")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const reason = sanctionData?.reason
        ? ` Alasan: ${sanctionData.reason}`
        : "";

      throw new Error(`Akun Anda dinonaktifkan oleh admin.${reason}`);
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const role = profileData.role;

    // --- LOGIKA UPDATE METADATA ---
    await supabase.auth.updateUser({
      data: { role }
    });

    // Middleware butuh ini karena dia gak bisa baca LocalStorage
    if (authData.session) {
      const { access_token, refresh_token } = authData.session;

      document.cookie = `sb-access-token=${access_token}; path=/; Max-Age=3600; SameSite=Lax`;
      document.cookie = `sb-refresh-token=${refresh_token}; path=/; Max-Age=3600; SameSite=Lax`;
      document.cookie = `user-role=${role}; path=/; Max-Age=3600; SameSite=Lax`;
    }

    return { role, error: null };
  } catch (error: any) {
    return { role: null, error: error.message };
  }
};
