import { supabase } from "@/lib/supabase";

export const handleLogin = async (identifier: string, password: string) => {
  try {
    let email = identifier;

    // Cek apakah identifier itu email atau username (pake regex simpel)
    const isEmail = identifier.includes('@');

    if (!isEmail) {
      // Jika bukan email, cari email di tabel profiles berdasarkan username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("full_name", identifier)
        .single();

      if (profileError || !profile) {
        throw new Error("Username tidak ditemukan!");
      }
      email = profile.email;
    }

    // Proses Login ke Auth Supabase pake Email yang udah ketemu
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    // Ambil Role untuk redirect
    const { data: roleData, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (roleError) throw roleError;

    return { role: roleData.role, error: null };
  } catch (error: any) {
    return { role: null, error: error.message };
  }
};