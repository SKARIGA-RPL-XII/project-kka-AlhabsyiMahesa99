import React from 'react'
import { useRouter } from 'next/navigation'

function section4() {
  const router = useRouter();

  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-white">
        <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20">
          <div
            className="mx-auto w-full max-w-3xl rounded-2xl border
      border-[#299E63]/30 px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20 text-center transition-all duration-300 hover:shadow-xl"
          >
            <h3
              className="text-2xl sm:text-3xl md:text-4xl text-[#222D33] leading-snug"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              Siap Mengubah Sampah
              <span className="block text-[#299E63]">Jadi Saldo?</span>
            </h3>

            <p
              className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Bergabunglah dengan ribuan warga yang sudah mulai peduli
              lingkungan sekaligus menambah penghasilan.
            </p>

            <div className="mt-6 sm:mt-8 lg:mt-10">
              <button
                onClick={() => router.push("/login")}
                className="w-full sm:w-auto rounded-xl bg-[#299E63] px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold cursor-pointer text-white transition-all duration-300 hover:bg-[#248a56] hover:scale-105 hover:shadow-lg active:scale-95"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Daftar Sekarang – Gratis!
              </button>
            </div>
          </div>
        </div>
      </section>
  )
}

export default section4