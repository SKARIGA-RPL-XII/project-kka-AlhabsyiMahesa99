"use client";

import { CourierHistoryContent } from "./components/HistoryContent";
import { HistoryDetailModal } from "./components/HistoryDetailModal";
import { HistoryImagePreviewModal } from "./components/HistoryImagePreviewModal";
import { formatPickupId } from "./components/historyUtils";
import { useCourierHistory } from "./hooks/useCourierHistory";

export default function HistoryPage() {
  const {
    loading,
    summaryLoading,
    errorMessage,
    rows,
    summary,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    totalPages,
    tableCaption,
    selectedDetail,
    setSelectedDetail,
    previewImage,
    setPreviewImage,
    previewTitle,
    setPreviewTitle,
  } = useCourierHistory();

  return (
    <>
      <CourierHistoryContent
        loading={loading}
        summaryLoading={summaryLoading}
        errorMessage={errorMessage}
        rows={rows}
        summary={summary}
        search={search}
        onChangeSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        onChangeStatus={(nextStatus) => {
          setStatus(nextStatus);
          setPage(1);
        }}
        page={page}
        totalPages={totalPages}
        tableCaption={tableCaption}
        onPrevPage={() => setPage((prev) => prev - 1)}
        onNextPage={() => setPage((prev) => prev + 1)}
        onOpenDetail={setSelectedDetail}
        onOpenPreview={(imageUrl, title) => {
          setPreviewImage(imageUrl);
          setPreviewTitle(title);
        }}
      />

      <HistoryDetailModal
        selectedDetail={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        onOpenImage={(imageUrl) => {
          setPreviewImage(imageUrl);
          setPreviewTitle(selectedDetail ? `Foto pickup ${formatPickupId(selectedDetail.id)}` : "Foto pickup");
        }}
      />

      <HistoryImagePreviewModal
        imageUrl={previewImage}
        title={previewTitle}
        onClose={() => {
          setPreviewImage(null);
          setPreviewTitle(null);
        }}
      />
    </>
  );
}
