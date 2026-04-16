import React from "react";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-10 xl:px-20 text-center">
        {/* Social Icons */}
        <div className="flex justify-center gap-4 sm:gap-5 lg:gap-6">
          {[
            { icon: <FiFacebook size={20} />, href: "#" },
            { icon: <FiTwitter size={20} />, href: "#" },
            { icon: <FiInstagram size={20} />, href: "#" },
            { icon: <FiLinkedin size={20} />, href: "#" },
            { icon: <FaWhatsapp size={20} />, href: "#" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center
              rounded-lg border border-white/20 text-white
              transition-all duration-300 hover:bg-white hover:text-[#1C1C1C] hover:scale-105 active:scale-95"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Description */}
        <p
          className="mt-6 sm:mt-8 lg:mt-10 max-w-xl sm:max-w-2xl mx-auto text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Solusi cerdas pengelolaan sampah rumah tangga untuk masa depan bumi
          yang lebih hijau dan berkelanjutan.
        </p>

        {/* Copyright */}
        <p
          className="mt-6 sm:mt-8 lg:mt-10 text-white/60 text-xs sm:text-sm"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          © 2026 RECYLOOP. All rights reserved. Created for Environment
        </p>
      </div>
    </footer>
  );
}