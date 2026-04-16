import React from 'react'
import { FiTrash2, FiTruck, FiDollarSign } from 'react-icons/fi';

function section3() {
  return (
    <section className="py-16 sm:py-20 lg:py-32 bg-[#299E63]">
        <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <h3
              className="text-2xl sm:text-3xl md:text-4xl text-white leading-snug"
              style={{ fontFamily: "var(--font-audiowide)" }}
            >
              3 Langkah Mudah Menjadi
              <span className="block text-[#222D33]">Pahlawan Lingkungan</span>
            </h3>
            <p
              className="mt-3 sm:mt-4 text-white/80 text-sm sm:text-base lg:text-lg"
              style={{ fontFamily: "var(--font-bai-jamjuree)" }}
            >
              Dari rumah, bantu bumi, sekaligus dapat cuan.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mt-12 sm:mt-16 lg:mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 items-stretch">
            {[
              {
                step: "01",
                title: "Pilah Sampah",
                desc: "Pisahkan sampah organik dan anorganik dari rumah.",
                icon: <FiTrash2 size={44} />,
              },
              {
                step: "02",
                title: "Setor Sampah",
                desc: "Request penjemputan lewat dashboard RECYLOOP.",
                icon: <FiTruck size={44} />,
              },
              {
                step: "03",
                title: "Dapatkan Poin",
                desc: "Terima poin dan tukarkan dengan saldo digital!",
                icon: <FiDollarSign size={44} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-2xl bg-white p-6 sm:p-8 text-center border border-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#299E63]/40 hover:shadow-xl"
                >
                {/* Step number */}
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white bg-[#222D33]"
                  style={{ fontFamily: "var(--font-red-hat-display)" }}
                >
                  {item.step}
                </div>

                {/* Icon */}
                <div className="mt-8 sm:mt-10 flex justify-center text-[#299E63] transition-all duration-300 group-hover:text-[#1E7F50] group-hover:scale-110">
                  {item.icon}
                </div>

                {/* Text */}
                <h4
                  className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold text-[#222D33]"
                  style={{ fontFamily: "var(--font-red-hat-display)" }}
                >
                  {item.title}
                </h4>
                <p
                  className="mt-2 text-gray-600 text-sm sm:text-base leading-relaxed"
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