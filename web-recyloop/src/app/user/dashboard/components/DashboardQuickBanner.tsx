type Props = {
  onGoSetor: () => void;
};

export default function DashboardQuickBanner({ onGoSetor }: Props) {
  return (
    <div className="bg-[#299E63] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg shadow-[#299E63]/20">
      {/* Banner Aksi Cepat */}
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold font-poppins">Punya sampah di rumah?</h2>
        <p className="text-green-50 opacity-90 font-poppins">Yuk setor sekarang dan kumpulkan poin untuk ditukar ke saldo!</p>
      </div>
      <button
        onClick={onGoSetor}
        className="mt-6 md:mt-0 bg-white text-[#299E63] px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition active:scale-95 shadow-lg cursor-pointer font-poppins"
      >
        Setor Sekarang
      </button>
    </div>
  );
}
