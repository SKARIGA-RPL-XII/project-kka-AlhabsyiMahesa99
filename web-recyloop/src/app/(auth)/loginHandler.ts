import { supabase } from "@/lib/supabase";

export const handleLogin = async (identifier: string, password: string) => {
  try {
    let email = identifier;
    const isEmail = identifier.includes('@');

    if (!isEmail) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("full_name", identifier)
        .single();

      if (profileError || !profile) throw new Error("Username tidak ditemukan!");
      email = profile.email;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const { data: roleData, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (roleError) throw roleError;

    // --- LOGIKA UPDATE METADATA ---
    await supabase.auth.updateUser({
      data: { role: roleData.role }
    });

    // Middleware butuh ini karena dia gak bisa baca LocalStorage
    if (authData.session) {
      const { access_token, refresh_token } = authData.session;
      const role = roleData.role;

      document.cookie = `sb-access-token=${access_token}; path=/; Max-Age=3600; SameSite=Lax`;
      document.cookie = `sb-refresh-token=${refresh_token}; path=/; Max-Age=3600; SameSite=Lax`;
      document.cookie = `user-role=${role}; path=/; Max-Age=3600; SameSite=Lax`;
    }

    return { role: roleData.role, error: null };
  } catch (error: any) {
    return { role: null, error: error.message };
  }
};