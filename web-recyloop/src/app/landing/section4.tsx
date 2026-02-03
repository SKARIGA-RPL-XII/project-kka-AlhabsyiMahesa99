import React from 'react'
import { useRouter } from 'next/navigation'

function section4() {
  const router = useRouter();

  return (
    <section className="py-32 bg-white">
        <div className="mx-auto max-w-360 px-30">
          <div
            className="mx-auto max-w-3xl rounded-2xl border
      border-[#299E63]/30 px-16 py-20 text-center"
          >
            <h3
              className="text-4xl text-[#222D33]"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              Siap Mengubah Sampah
              <span className="block text-[#299E63]">Jadi Saldo?</span>
            </h3>

            <p
              className="mt-6 text-lg text-gray-600"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Bergabunglah dengan ribuan warga yang sudah mulai peduli
              lingkungan sekaligus menambah penghasilan.
            </p>

            <div className="mt-10">
              <button
                onClick={() => router.push("/login")}
                className="rounded-xl bg-[#299E63] px-10 py-4 text-lg font-semibold cursor-pointer
          text-white transition
          hover:bg-[#248a56]"
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