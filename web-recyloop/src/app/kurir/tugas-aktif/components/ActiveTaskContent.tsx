import { RefObject } from "react";
import { Camera, ChevronRight, Info, Loader2, MapPin, Navigation, Phone, Scale } from "lucide-react";
import { ActiveTaskRow } from "../hooks/useActiveTask";
import { pickFirstRelation } from "../../shared/utils/pickFirstRelation";

type Props = {
  task: ActiveTaskRow;
  finalWeight: string;
  onChangeWeight: (value: string) => void;
  isSubmitting: boolean;
  previewUrl: string | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
};

export function ActiveTaskContent({
  task,
  finalWeight,
  onChangeWeight,
  isSubmitting,
  previewUrl,
  fileInputRef,
  onFileChange,
  onSubmit,
}: Props) {
  const profile = pickFirstRelation(task.profiles);
  const rawWhatsappPhone = (profile?.phone || "").replace(/\D/g, "");
  const whatsappPhone = rawWhatsappPhone.startsWith("0") ? `62${rawWhatsappPhone.slice(1)}` : rawWhatsappPhone;
  const whatsappText = encodeURIComponent(
    "Halo, saya kurir Recyloop dan sedang menghubungi terkait penjemputan sampah Anda.",
  );
  const whatsappUrl = whatsappPhone ? `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${whatsappText}` : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 font-poppins md:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Validasi Jemputan</h1>
        <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-bold uppercase text-blue-700">{task.status}</span>
      </div>

      <div className="mb-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
        <div className="bg-blue-600 p-6 text-white">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blue-100">Pelanggan</p>
          <h2 className="text-2xl font-bold">{profile?.full_name}</h2>
        </div>
        <div className="space-y-6 p-6">
          <div className="flex items-start">
            <div className="mr-4 rounded-2xl bg-red-50 p-3">
              <MapPin className="text-red-500" size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase text-gray-400">Alamat</p>
              <p className="text-sm font-medium text-gray-700">{task.pickup_address}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              aria-disabled={!whatsappUrl}
              className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100 aria-disabled:pointer-events-none aria-disabled:opacity-50"
            >
              <Phone size={18} className="mr-2 text-green-500" /> Hubungi
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.pickup_address || "")}`}
              target="_blank"
              className="flex items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 py-3 text-sm font-bold text-gray-700 hover:bg-gray-100"
            >
              <Navigation size={18} className="mr-2 text-blue-500" /> Maps
            </a>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl bg-gray-900 p-6 text-white shadow-2xl">
        <div className="mb-2 flex items-center space-x-2">
          <Scale size={20} className="text-blue-400" />
          <h3 className="text-lg font-bold">Input Hasil Timbangan</h3>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={finalWeight}
              onChange={(event) => onChangeWeight(event.target.value)}
              placeholder="0.0"
              className="w-full rounded-2xl border-none bg-gray-800 p-5 text-3xl font-bold text-white placeholder:text-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={onFileChange} />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-700 bg-gray-800 p-6 transition-all hover:border-blue-500"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-40 w-full rounded-xl object-cover" />
            ) : (
              <>
                <div className="mb-2 rounded-full bg-gray-700 p-3 transition-all group-hover:bg-blue-600">
                  <Camera size={24} />
                </div>
                <p className="text-xs font-bold text-gray-400">AMBIL FOTO SAMPAH</p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center rounded-2xl bg-blue-600 py-5 text-lg font-bold text-white shadow-lg transition-all active:scale-95 hover:bg-blue-500 disabled:bg-gray-700"
        >
          {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : "Konfirmasi & Pick Up"}
          {!isSubmitting && <ChevronRight className="ml-2" />}
        </button>
      </div>

      <div className="mt-8 flex items-start rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <Info className="mr-3 shrink-0 text-amber-500" size={20} />
        <p className="text-xs leading-relaxed text-amber-700">
          Pastikan berat sesuai timbangan. Data divalidasi ulang oleh Admin gudang.
        </p>
      </div>
    </div>
  );
}
