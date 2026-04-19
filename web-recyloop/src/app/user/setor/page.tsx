"use client";

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { userDashboardKeys } from "@/app/user/dashboard/hooks/dashboardQueries";
import { userProfileKeys } from "@/app/user/profil/hooks/profileQueries";
import { userRiwayatKeys } from "@/app/user/riwayat/hooks/riwayatQueries";
import { SetorHeader } from "./components/SetorHeader";
import { SetorStatsCards } from "./components/SetorStatsCards";
import { SetorStatusFilter, SetorTable } from "./components/SetorTable";
import { USER_SETOR_ITEMS_PER_PAGE, fetchUserSetor, userSetorKeys } from "./hooks/setorQueries";

export default function SetorSampah() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<SetorStatusFilter>("all");

  const { data, isLoading } = useQuery({
    queryKey: userSetorKeys.all,
    queryFn: fetchUserSetor,
    staleTime: 30 * 1000,
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatId = (uuid: string) => `REC-${uuid.substring(0, 5).toUpperCase()}`;

  const pickups = data?.pickups || [];
  const stats = data?.stats || { total: 0, weight: 0, pending: 0 };
  const filteredPickups = pickups.filter((item) => {
    const keyword = searchTerm.trim().toLowerCase();
    const formattedId = formatId(item.id).toLowerCase();
    const category = item.waste_categories?.name?.toLowerCase() || "";
    const status = item.status.toLowerCase();

    const matchesSearch = !keyword || formattedId.includes(keyword) || category.includes(keyword) || status.includes(keyword);
    const matchesStatus = activeStatus === "all" || item.status === activeStatus;

    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.max(1, Math.ceil(filteredPickups.length / USER_SETOR_ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedPickups = filteredPickups.slice(
    (safeCurrentPage - 1) * USER_SETOR_ITEMS_PER_PAGE,
    safeCurrentPage * USER_SETOR_ITEMS_PER_PAGE,
  );

  const getStatusStyle = (status: string) => {
    if (status === "completed") return "bg-green-100 text-green-700";
    if (status === "scheduled") return "bg-blue-100 text-blue-700";
    if (status === "picked_up") return "bg-purple-100 text-purple-700";
    if (status === "pending") return "bg-orange-100 text-orange-700";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Apakah kamu yakin ingin membatalkan setoran ini?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const { error } = await supabase.from("pickups").delete().eq("id", id).eq("status", "pending");

      if (error) throw error;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userSetorKeys.all }),
        queryClient.invalidateQueries({ queryKey: userDashboardKeys.all }),
        queryClient.invalidateQueries({ queryKey: userProfileKeys.all }),
        queryClient.invalidateQueries({ queryKey: userRiwayatKeys.all }),
      ]);

      if (paginatedPickups.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }

      alert("Setoran berhasil dibatalkan.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan saat membatalkan setoran.";
      alert("Gagal menghapus: " + message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="font-poppins space-y-8">
      <SetorHeader onAddSetoran={() => router.push("/user/setor/tambah")} />

      <SetorStatsCards stats={stats} />

      <SetorTable
        loading={isLoading}
        pickups={paginatedPickups}
        deletingId={deletingId}
        searchTerm={searchTerm}
        activeStatus={activeStatus}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        formatDate={formatDate}
        formatId={formatId}
        getStatusStyle={getStatusStyle}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setActiveStatus(value);
          setCurrentPage(1);
        }}
        onOpenDetail={(id) => router.push(`/user/setor/detail/${id}`)}
        onDelete={handleDelete}
        onPrevPage={() => setCurrentPage((prev) => prev - 1)}
        onNextPage={() => setCurrentPage((prev) => prev + 1)}
      />
    </div>
  );
}
