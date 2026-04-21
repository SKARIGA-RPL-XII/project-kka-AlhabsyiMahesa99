type Props = {
  onStart: () => void;
};

export function CourierDashboardAction({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-between rounded-3xl bg-blue-600 p-8 text-white md:flex-row">
      <div className="mb-4 md:mb-0">
        <h2 className="mb-1 text-xl font-bold">Siap Bekerja?</h2>
        <p className="opacity-90">Aktifkan statusmu untuk mulai menerima pesanan jemputan.</p>
      </div>
      <button
        onClick={onStart}
        className="cursor-pointer rounded-full bg-white px-8 py-3 font-bold text-blue-600 shadow-lg transition-colors hover:bg-blue-50"
      >
        Mulai Terima Tugas
      </button>
    </div>
  );
}
