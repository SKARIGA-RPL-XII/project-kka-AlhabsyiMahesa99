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
    <section className="relative w-full min-h-[calc(100vh-64px)] bg-[#299E63] overflow-hidden flex items-center">
        {/* Shape kanan */}
        <div className="absolute right-0 top-0 h-full w-[50%] hidden md:block pointer-events-none">
          <Image
            src="/LandingRight.png"
            alt="Landing Right Shape"
            fill
            className="object-contain object-right"
            priority
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20 py-16 sm:py-20 lg:py-28">
          <div className="max-w-xl">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              <span className="block text-white">WELCOME TO</span>
              <span className="block text-[#222D33]">RECYLOOP</span>
            </h1>

            <p
              className="mt-4 sm:mt-6 text-base sm:text-lg text-white"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Kelola sampah rumah tangga lebih mudah dan rapi hanya dengan satu
              klik.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 font-poppins">
            {/* Registrasi */}
            <button
              onClick={() => router.push("/login")}
              className="
                w-full sm:w-auto rounded-xl bg-white px-5 sm:px-6 py-3 text-sm sm:text-base lg:text-lg font-semibold text-black
                transition-all duration-300
                hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer
              "
            >
              Registrasi
            </button>

            {/* Kontak Kami */}
            <button
              onClick={handleWhatsApp}
              className="
                w-full sm:w-auto rounded-xl bg-white px-5 sm:px-6 py-3 text-sm sm:text-base lg:text-lg font-semibold text-black
                transition-all duration-300
                hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer
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