"use client";

type ImagePreviewModalProps = {
  imageUrl: string | null;
  onClose: () => void;
};

export function ImagePreviewModal({
  imageUrl,
  onClose,
}: ImagePreviewModalProps) {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-2xl bg-white p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="h-auto w-full rounded-xl object-contain"
        />
      </div>
    </div>
  );
}
