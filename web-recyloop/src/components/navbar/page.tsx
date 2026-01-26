import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white">
      {/* Container sesuai Figma */}
      <div
        className="mx-auto flex items-center justify-between py-4"
        style={{
          maxWidth: "1440px",
          paddingLeft: "120px",
          paddingRight: "120px",
        }}
      >
        {/* Logo */}
        <Link href="/" className="text-4xl font-bold tracking-wide">
          <span style={{ color: "#299E63" }}>RECYLOOP</span>
        </Link>

        {/* Menu kanan */}
        <div className="flex items-center gap-10">
          <Link href="/" className="text-lg font-medium text-gray-700">
            Home
          </Link>

          <Link
            href="/login"
            className="rounded-xl px-8 py-2 text-lg font-semibold text-black transition hover:brightness-95"
            style={{ backgroundColor: "#A0FC01" }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}