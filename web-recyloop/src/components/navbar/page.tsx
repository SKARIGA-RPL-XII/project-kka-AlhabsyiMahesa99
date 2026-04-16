import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 lg:px-18">
      {/* Container sesuai Figma */}
      <div
        className="mx-auto flex items-center justify-between py-3 sm:py-4 px-4 sm:px-6 lg:px-10 xl:px-0"
        style={{
          maxWidth: "1440px",
        }}
      >
        {/* Logo */}
        <Link href="/" className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide transition hover:opacity-90">
          <span style={{ color: "#299E63" }}>RECYLOOP</span>
        </Link>

        {/* Menu kanan */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          <Link href="/" className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 transition hover:text-black">
            Home
          </Link>

          <Link
            href="/login"
            className="rounded-xl px-4 sm:px-6 lg:px-8 py-2 text-sm sm:text-base lg:text-lg font-semibold text-black transition-all duration-200 hover:brightness-95 hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundColor: "#A0FC01" }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}