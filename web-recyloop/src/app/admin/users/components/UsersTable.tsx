import React from "react";
import { Mail, Phone, UserCheck, UserX } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: "user" | "kurir" | "admin";
  is_active: boolean;
  avatar_url: string | null;
}

export function UsersTable({
  users,
  loading,
  suspensionReasons,
  onOpenSuspend,
  onActivate,
}: {
  users: UserProfile[];
  loading: boolean;
  suspensionReasons: Record<string, string>;
  onOpenSuspend: (user: UserProfile) => void;
  onActivate: (userId: string) => void;
}) {
  return (
    // Table
    <div className="overflow-hidden rounded-4xl border border-gray-50 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[11px] font-bold uppercase tracking-[2px] text-gray-400">
              <th className="px-8 py-6">Profil Pengguna</th>
              <th className="px-8 py-6">Informasi Kontak</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400 animate-pulse">
                  Memuat data pengguna...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                  Tidak ada pengguna ditemukan.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="group transition-colors hover:bg-gray-50/80">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={
                            user.avatar_url ||
                            `https://ui-avatars.com/api/?name=${user.full_name}&background=F3F4F6&color=299E63&bold=true`
                          }
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-gray-50 shadow-sm"
                          alt=""
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                            user.is_active ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800 transition-colors group-hover:text-[#299E63]">
                          {user.full_name || "Tanpa Nama"}
                        </p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-gray-400">
                          ID: {user.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-xs font-medium">{user.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-xs font-medium">{user.phone || "-"}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-bold tracking-wide ${
                          user.is_active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                        }`}
                      >
                        {user.is_active ? "AKTIF" : "NONAKTIF"}
                      </span>

                      {!user.is_active && suspensionReasons[user.id] && (
                        <div className="max-w-xs rounded-xl border border-red-100 bg-red-50 p-2">
                          <p className="text-[10px] font-bold uppercase text-red-500">Alasan Nonaktif</p>
                          <p className="mt-1 text-xs text-red-600">{suspensionReasons[user.id]}</p>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      {user.is_active ? (
                        <button
                          onClick={() => onOpenSuspend(user)}
                          className="cursor-pointer rounded-xl p-2.5 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                          title="Nonaktifkan"
                        >
                          <UserX size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => onActivate(user.id)}
                          className="cursor-pointer rounded-xl p-2.5 text-gray-400 transition-all hover:bg-green-50 hover:text-green-500"
                          title="Aktifkan"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
