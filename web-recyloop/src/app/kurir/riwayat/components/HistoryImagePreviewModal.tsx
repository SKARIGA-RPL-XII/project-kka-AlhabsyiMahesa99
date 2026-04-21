import { X } from "lucide-react";

type Props = {
  imageUrl: string | null;
  title: string | null;
  onClose: () => void;
};

export function HistoryImagePreviewModal({ imageUrl, title, onClose }: Props) {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/75 p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-950 p-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <div>
            <p className="text-sm font-semibold">{title || "Preview Gambar"}</p>
            <p className="text-xs text-slate-400">Klik area luar atau tombol silang untuk menutup.</p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-slate-900">
          <img src={imageUrl} alt={title || "Preview"} className="max-h-[75vh] w-full object-contain" />
        </div>
      </div>
    </div>
  );
}
