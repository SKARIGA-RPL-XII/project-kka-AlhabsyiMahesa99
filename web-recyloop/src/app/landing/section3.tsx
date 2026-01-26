import React from 'react'
import { FiTrash2, FiTruck, FiDollarSign } from 'react-icons/fi';

function section3() {
  return (
    <section className="py-32 bg-[#299E63]">
        <div className="mx-auto max-w-360 px-30">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h3
              className="text-4xl text-white"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              3 Langkah Mudah Menjadi
              <span className="block text-[#222D33]">Pahlawan Lingkungan</span>
            </h3>
            <p
              className="mt-4 text-white/80 text-lg"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Dari rumah, bantu bumi, sekaligus dapat cuan.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {[
              {
                step: "01",
                title: "Pilah Sampah",
                desc: "Pisahkan sampah organik dan anorganik dari rumah.",
                icon: <FiTrash2 size={48} />,
              },
              {
                step: "02",
                title: "Setor Sampah",
                desc: "Request penjemputan lewat dashboard RECYLOOP.",
                icon: <FiTruck size={48} />,
              },
              {
                step: "03",
                title: "Dapatkan Poin",
                desc: "Terima poin dan tukarkan dengan saldo digital!",
                icon: <FiDollarSign size={48} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-white p-8 text-center
border border-transparent
transition-all duration-300 ease-out
hover:-translate-y-1
hover:border-[#299E63]/40
hover:shadow-lg"
              >
                {/* Step number */}
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 rounded-full
            flex items-center justify-center font-bold text-white
            bg-[#222D33]"
                  style={{ fontFamily: "var(--font-red-hat-display)" }}
                >
                  {item.step}
                </div>

                {/* Icon */}
                <div className="mt-10 flex justify-center text-[#299E63] transition-colors duration-300 group-hover:text-[#1E7F50]">
                  {item.icon}
                </div>

                {/* Text */}
                <h4
                  className="mt-6 text-xl font-bold text-[#222D33]"
                  style={{ fontFamily: "var(--font-red-hat-display)" }}
                >
                  {item.title}
                </h4>
                <p
                  className="mt-2 text-gray-600"
                  style={{ fontFamily: "var(--font-red-hat-text)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default section3