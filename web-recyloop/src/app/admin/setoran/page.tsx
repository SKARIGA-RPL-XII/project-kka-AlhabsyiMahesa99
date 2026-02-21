"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Filter, Search } from "lucide-react";
import { PickupItem, PickupStatus } from "@/types/pickup";
import { DetailModal } from "./components/DetailModal";
import { OverviewStats } from "./components/OverviewStats";
import { PickupTable } from "./components/PickupTable";
import { ITEMS_PER_PAGE, usePickups } from "./hooks/usePickups";

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-bold transition ${
        active ? "bg-[#299E63] text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

export default function AdminSetoranPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<"all" | PickupStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState<PickupItem | null>(null);
  const [validatedWeight, setValidatedWeight] = useState("");

  const { pickups, totalData, loading, errorMessage, updatingId, completePickup } = usePickups(
    currentPage,
    activeStatus,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeStatus]);

  useEffect(() => {
    if (!selectedItem) return;
    const defaultWeight = selectedItem.finalWeight ?? selectedItem.estimatedWeight;
    setValidatedWeight(String(defaultWeight || 0));
  }, [selectedItem]);

  const filteredData = useMemo(() => {
    return pickups.filter((item) => {
      const q = search.trim().toLowerCase();
      if (q.length === 0) return true;

      return (
        item.id.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q)
      );
    });
  }, [pickups, search]);

  const stats = useMemo(() => {
    return {
      total: totalData,
      pending: pickups.filter((i) => i.status === "pending").length,
      inProgress: pickups.filter((i) => i.status === "scheduled" || i.status === "picked_up").length,
      completed: pickups.filter((i) => i.status === "completed").length,
    };
  }, [pickups, totalData]);

  const totalPages = Math.max(1, Math.ceil(totalData / ITEMS_PER_PAGE));
  const periodLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
    }).format(new Date());
    return label.charAt(0).toUpperCase() + label.slice(1);
  }, []);

  const previewFinalPoints = useMemo(() => {
    if (!selectedItem) return 0;
    const weight = Number(validatedWeight);
    if (Number.isNaN(weight) || weight <= 0) return 0;
    return Math.floor(weight * selectedItem.pointsPerKg);
  }, [selectedItem, validatedWeight]);

  const handleComplete = async (item: (typeof pickups)[number]) => {
    const success = await completePickup(item, validatedWeight);
    if (success) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-8 font-poppins text-[#222D33]">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Setoran</h1>
          <p className="mt-1 text-gray-500">
            Pantau request pickup, validasi proses jemput, dan review penyelesaian setoran.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Periode Monitoring</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CalendarDays size={14} className="text-[#299E63]" />
            {periodLabel}
          </p>
        </div>
      </section>

      <OverviewStats
        total={stats.total}
        pending={stats.pending}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      <section className="rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ID, nama user, kategori, alamat..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-black outline-none transition focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TabButton label="Semua" active={activeStatus === "all"} onClick={() => setActiveStatus("all")} />
            <TabButton label="Pending" active={activeStatus === "pending"} onClick={() => setActiveStatus("pending")} />
            <TabButton label="Scheduled" active={activeStatus === "scheduled"} onClick={() => setActiveStatus("scheduled")} />
            <TabButton label="Picked Up" active={activeStatus === "picked_up"} onClick={() => setActiveStatus("picked_up")} />
            <TabButton label="Completed" active={activeStatus === "completed"} onClick={() => setActiveStatus("completed")} />
            <button className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">
              <Filter size={14} />
              Filter Lanjutan
            </button>
          </div>
        </div>

        <PickupTable
          loading={loading}
          errorMessage={errorMessage}
          filteredData={filteredData}
          totalData={totalData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => p - 1)}
          onNext={() => setCurrentPage((p) => p + 1)}
          onOpenDetail={(item) => setSelectedItem(item)}
        />
      </section>

      <DetailModal
        selectedItem={selectedItem}
        validatedWeight={validatedWeight}
        setValidatedWeight={setValidatedWeight}
        previewFinalPoints={previewFinalPoints}
        updating={Boolean(selectedItem && updatingId === selectedItem.id)}
        onClose={() => setSelectedItem(null)}
        onComplete={handleComplete}
      />
    </div>
  );
}