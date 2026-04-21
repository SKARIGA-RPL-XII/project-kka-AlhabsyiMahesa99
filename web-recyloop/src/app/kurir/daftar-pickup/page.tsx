"use client";

import { PickupListContent } from "./components/PickupListContent";
import { PickupListHeader } from "./components/PickupListHeader";
import { usePickupList } from "./hooks/usePickupList";

export default function PickupList() {
  const { pickups, loading, hasScheduledTask, takingTaskId, handleAmbilTugas } = usePickupList();

  if (loading) {
    return <div className="p-8 text-center font-poppins">Memuat daftar sampah...</div>;
  }

  return (
    <div className="space-y-8 font-poppins">
      <PickupListHeader />
      <PickupListContent
        pickups={pickups}
        hasScheduledTask={hasScheduledTask}
        takingTaskId={takingTaskId}
        onTakeTask={handleAmbilTugas}
      />
    </div>
  );
}
