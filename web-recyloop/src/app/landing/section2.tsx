import React, { useState, useRef } from 'react'
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function section2() {
    const [active, setActive] = useState<"left" | "right">("right");

    const sliderRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        sliderRef.current?.scrollBy({ left: -320, behavior: "smooth" });
      };
    
      const scrollRight = () => {
        sliderRef.current?.scrollBy({ left: 320, behavior: "smooth" });
      };

  return (
    <section className="py-16 sm:py-20 lg:py-32">
            <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20">
              {/* Heading atas */}
              <div className="text-center">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl text-[#222D33]"
                  style={{ fontFamily: "var(--font-audiowide)" }}
                >
                  RECYLOOP
                </h2>
                <p
                  className="text-black mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto"
                  style={{ fontFamily: "var(--font-bai-jamjuree)" }}
                >
                  Setor Sampahnya, Kumpulkan Poinnya, Tukarkan dengan Berbagai
                  Reward Menarik!
                </p>
              </div>
    
              {/* Layanan */}
              <div className="mt-12 sm:mt-16 lg:mt-24 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h3
                    className="text-black text-2xl sm:text-3xl lg:text-4xl font-bold"
                    style={{ fontFamily: "var(--font-red-hat-display)" }}
                  >
                    Layanan
                  </h3>
                  <p
                    className="mt-2 text-gray-600 text-sm sm:text-base max-w-md"
                    style={{ fontFamily: "var(--font-red-hat-text)" }}
                  >
                    Solusi cerdas pengelolaan sampah untuk lingkungan yang lebih
                    hijau.
                  </p>
                </div>
    
                {/* Navigation */}
                <div className="flex gap-3 sm:gap-4">
                  <button
                    onClick={() => {
                      scrollLeft();
                      setActive("right");
                    }}
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer
          ${
            active === "left"
              ? "border-[#299E63] text-[#299E63]"
              : "border-[#D9D9D9] text-[#D9D9D9]"
          }`}
                  >
                    <FiChevronLeft size={20} />
                  </button>
    
                  <button
                    onClick={() => {
                      scrollRight();
                      setActive("left");
                    }}
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 bg-white transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer
          ${
            active === "right"
              ? "border-[#299E63] text-[#299E63]"
              : "border-[#D9D9D9] text-[#D9D9D9]"
          }`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
    
              {/* Cards */}
              <div
                ref={sliderRef}
                className="mt-10 sm:mt-12 lg:mt-16 flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing pb-2"
              >
                {[
                  {
                    title: "Pick Up",
                    desc: "Tidak perlu keluar rumah. Cukup upload foto sampahmu, tentukan lokasi, dan kurir kami akan datang.",
                    img: "/PickUp.png",
                  },
                  {
                    title: "Drop Off",
                    desc: "Antar langsung sampahmu ke Recyloop Hub terdekat dan dapatkan poin instan.",
                    img: "/DropOff.png",
                  },
                  {
                    title: "Eco-Point Reward",
                    desc: "Kumpulkan poin dan tukarkan dengan berbagai reward menarik.",
                    img: "/Eco.png",
                  },
                  {
                    title: "Real-time Monitoring",
                    desc: "Pantau status penjemputan dan kontribusi lingkunganmu secara real-time.",
                    img: "/RealTime.png",
                  },
                  {
                    title: "Edukasi Daur Ulang",
                    desc: "Bingung cara memilah? Akses panduan lengkap klasifikasi sampah organik dan anorganik.",
                    img: "/Education.png",
                  },
                ].map((item, i) => (
                  <div key={i} className="min-w-65 sm:min-w-75 lg:min-w-[320px] rounded-2xl border border-gray-200 p-5 sm:p-6 bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <Image src={item.img} alt={item.title} width={48} height={48} />
                    <h4
                      className="text-black mt-4 text-lg sm:text-xl font-bold"
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

export default section2