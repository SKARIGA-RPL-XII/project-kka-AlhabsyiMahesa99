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
    <footer className="bg-[#1C1C1C] py-20">
      <div className="mx-auto max-w-360 px-30 text-center">
        {/* Social Icons */}
        <div className="flex justify-center gap-6">
          {[
            { icon: <FiFacebook size={22} />, href: "#" },
            { icon: <FiTwitter size={22} />, href: "#" },
            { icon: <FiInstagram size={22} />, href: "#" },
            { icon: <FiLinkedin size={22} />, href: "#" },
            { icon: <FaWhatsapp size={22} />, href: "#" },
          ].map((item, i) => (
            <a
              key={i}
              href={item.href}
              className="flex h-12 w-12 items-center justify-center
              rounded-lg border border-white/20 text-white
              transition hover:bg-white hover:text-[#1C1C1C]"
            >
              {item.icon}
            </a>
          ))}
        </div>

        {/* Description */}
        <p
          className="mt-10 max-w-2xl mx-auto text-white/80 text-lg"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Solusi cerdas pengelolaan sampah rumah tangga untuk masa depan bumi
          yang lebih hijau dan berkelanjutan.
        </p>

        {/* Copyright */}
        <p
          className="mt-10 text-white/60 text-sm"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          © 2026 RECYLOOP. All rights reserved. Created for Environment
        </p>
      </div>
    </footer>
  );
}