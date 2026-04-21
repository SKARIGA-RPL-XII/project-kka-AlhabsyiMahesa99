import { Package } from "lucide-react";

export function ActiveTaskEmptyState() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center px-6 text-center font-poppins">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <Package size={48} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Tidak ada tugas aktif</h2>
      <p className="mt-2 text-gray-500">Cek daftar jemputan dulu, Bro!</p>
    </div>
  );
}
