import React from 'react'
import Image from 'next/image';

function section1() {
  return (
    <section className="relative w-full h-[calc(100vh-64px)] bg-[#299E63] overflow-hidden">
        {/* Shape kanan (dekoratif) */}
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
              <button className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-black">
                Registrasi
              </button>

              <button className="rounded-xl bg-white px-6 py-3 text-lg font-semibold text-black">
                Kontak Kami
              </button>
            </div>
          </div>
        </div>
      </section>
  )
}

export default section1