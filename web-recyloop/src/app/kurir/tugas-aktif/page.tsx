"use client";

import { ActiveTaskContent } from "./components/ActiveTaskContent";
import { ActiveTaskEmptyState } from "./components/ActiveTaskEmptyState";
import { useActiveTask } from "./hooks/useActiveTask";

export default function ActiveTask() {
  const {
    task,
    loading,
    finalWeight,
    setFinalWeight,
    isSubmitting,
    previewUrl,
    fileInputRef,
    handleFileSelect,
    handleValidationAndPickUp,
  } = useActiveTask();

  if (loading) {
    return <div className="p-8 text-center font-poppins text-black">Mencari tugas aktif...</div>;
  }

  if (!task) {
    return <ActiveTaskEmptyState />;
  }

  return (
    <ActiveTaskContent
      task={task}
      finalWeight={finalWeight}
      onChangeWeight={setFinalWeight}
      isSubmitting={isSubmitting}
      previewUrl={previewUrl}
      fileInputRef={fileInputRef}
      onFileChange={handleFileSelect}
      onSubmit={handleValidationAndPickUp}
    />
  );
}
