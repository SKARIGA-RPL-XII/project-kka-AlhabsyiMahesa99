import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function section1() {
  const router = useRouter();

  const handleWhatsApp = () => {
    const phone = "6289516207301"; 
    const text = encodeURIComponent(
      "Halo Recyloop, saya menghubungi melalui website dan tertarik untuk mengetahui lebih lanjut mengenai aplikasi Recyloop."
    );

    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${text}`, "_blank");
  };

  return (
    <section className="relative w-full h-[calc(100vh-64px)] bg-[#299E63] overflow-hidden">
        {/* Shape kanan */}
        <div className="absolute right-0 top-0 h-full w-[50%] hidden md:block">
          <Image
            src="/LandingRight.png"
            alt="Landing Right Shape"
            fill
            className="hidden md:block object-contain object-right"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-360 px-30 py-28">
          <div className="max-w-xl">
            <h1
              className="text-6xl leading-tight"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              <span className="block text-white">WELCOME TO</span>
              <span className="block text-[#222D33]">RECYLOOP</span>
            </h1>

            <p
              className="mt-6 text-lg text-white"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Kelola sampah rumah tangga lebih mudah dan rapi hanya dengan satu
              klik.
            </p>

            <div className="mt-8 flex gap-4 font-poppins">
            {/* Registrasi */}
            <button
              onClick={() => router.push("/login")}
              className="
                rounded-xl bg-white px-6 py-3 text-lg font-semibold text-black
                transition-all duration-300
                hover:bg-[#1f7f52] hover:text-white hover:scale-105 hover:shadow-xl cursor-pointer
              "
            >
              Registrasi
            </button>

            {/* Kontak Kami */}
            <button
              onClick={handleWhatsApp}
              className="
                rounded-xl bg-white px-6 py-3 text-lg font-semibold text-black
                transition-all duration-300
                hover:bg-[#1f7f52] hover:text-white hover:scale-105 hover:shadow-xl cursor-pointer
              "
            >
              Kontak Kami
            </button>
          </div>

          </div>
        </div>
      </section>
  )
}

export default section1