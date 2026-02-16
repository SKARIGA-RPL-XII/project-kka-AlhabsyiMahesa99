import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

export type UserRoleTab = "user" | "kurir";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: "user" | "kurir" | "admin";
  is_active: boolean;
  avatar_url: string | null;
  address?: string | null;
}

export interface SuspendTarget {
  id: string;
  full_name: string;
  role: "user" | "kurir";
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<UserRoleTab>("user");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [suspendTarget, setSuspendTarget] = useState<SuspendTarget | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [submittingSuspend, setSubmittingSuspend] = useState(false);

  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [creatingCourier, setCreatingCourier] = useState(false);
  const [courierForm, setCourierForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [suspensionReasons, setSuspensionReasons] = useState<Record<string, string>>({});

  const loadSuspensionReasons = useCallback(async (userIds: string[]) => {
    if (userIds.length === 0) {
      setSuspensionReasons({});
      return;
    }

    const { data, error } = await supabase
      .from("user_sanctions")
      .select("user_id, reason, created_at")
      .in("user_id", userIds)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading sanction reasons:", error.message);
      return;
    }

    const latestMap: Record<string, string> = {};
    for (const row of data || []) {
      if (!latestMap[row.user_id]) {
        latestMap[row.user_id] = row.reason;
      }
    }

    setSuspensionReasons(latestMap);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, phone, role, is_active, avatar_url, address")
        .eq("role", activeTab)
        .order("full_name", { ascending: true });

      if (error) throw error;
      const result = (data as UserProfile[]) || [];
      setUsers(result);
      await loadSuspensionReasons(result.map((u) => u.id));
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadSuspensionReasons]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleActivateUser = async (userId: string) => {
    if (!confirm("Aktifkan kembali akun ini?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: true })
        .eq("id", userId);

      if (error) throw error;

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: true } : u)));
      alert("Akun berhasil diaktifkan kembali.");
    } catch (error) {
      console.error(error);
      alert("Gagal mengaktifkan akun.");
    }
  };

  const handleOpenSuspendModal = (user: UserProfile) => {
    setSuspendTarget({
      id: user.id,
      full_name: user.full_name || "Tanpa Nama",
      role: user.role === "kurir" ? "kurir" : "user",
    });
    setSuspendReason("");
  };

  const handleSuspendUser = async () => {
    if (!suspendTarget) return;

    const reason = suspendReason.trim();
    if (reason.length < 5) {
      alert("Alasan minimal 5 karakter.");
      return;
    }

    try {
      setSubmittingSuspend(true);

      const { error } = await supabase
        .from("profiles")
        .update({ is_active: false })
        .eq("id", suspendTarget.id);

      if (error) throw error;

      const { error: sanctionError } = await supabase.rpc("log_user_sanction", {
        p_user_id: suspendTarget.id,
        p_reason: reason,
        p_action: "suspend",
      });

      if (sanctionError) {
        console.error("Failed to store sanction reason:", sanctionError.message);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === suspendTarget.id
            ? {
                ...u,
                is_active: false,
              }
            : u,
        ),
      );

      setSuspensionReasons((prev) => ({
        ...prev,
        [suspendTarget.id]: reason,
      }));

      alert("Akun berhasil dinonaktifkan.");
      setSuspendTarget(null);
      setSuspendReason("");
    } catch (error) {
      console.error(error);
      alert("Gagal menonaktifkan akun.");
    } finally {
      setSubmittingSuspend(false);
    }
  };

  const handleCreateCourier = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = courierForm.fullName.trim();
    const email = courierForm.email.trim();
    const password = courierForm.password;
    const phone = courierForm.phone.trim();
    const address = courierForm.address.trim();

    if (!fullName || !email || !password) {
      alert("Nama, email, dan password wajib diisi.");
      return;
    }

    try {
      setCreatingCourier(true);

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "kurir",
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user?.id) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: signUpData.user.id,
          full_name: fullName,
          email,
          phone: phone || null,
          address: address || null,
          role: "kurir",
          is_active: true,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          throw profileError;
        }
      }

      alert("Akun kurir baru berhasil dibuat.");
      setShowAddCourierModal(false);
      setCourierForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
      });

      if (activeTab === "kurir") {
        fetchUsers();
      }
    } catch (error: any) {
      console.error(error);
      alert("Gagal menambahkan kurir: " + (error?.message || "Unknown error"));
    } finally {
      setCreatingCourier(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.full_name?.toLowerCase().includes(q) ||
        user.phone?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(q),
    );
  }, [users, searchTerm]);

  return {
    users: filteredUsers,
    loading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    suspendTarget,
    setSuspendTarget,
    suspendReason,
    setSuspendReason,
    submittingSuspend,
    showAddCourierModal,
    setShowAddCourierModal,
    courierForm,
    setCourierForm,
    creatingCourier,
    suspensionReasons,
    handleActivateUser,
    handleOpenSuspendModal,
    handleSuspendUser,
    handleCreateCourier,
  };
}
