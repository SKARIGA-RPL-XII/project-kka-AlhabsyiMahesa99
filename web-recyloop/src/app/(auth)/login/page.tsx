"use client";
import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { handleRegister } from "../registerHandler"; 
import { handleLogin } from "../loginHandler"; 
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // State Form
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState(""); // Bisa berisi Email atau Username
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi Submit Utama
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      // --- LOGIKA REGISTER ---
      if (password !== confirmPassword) {
        alert("Konfirmasi password tidak sesuai!");
        setLoading(false);
        return;
      }

      // Saat register, identifier haruslah email
      const { data, error } = await handleRegister(identifier, password, fullName);
      
      if (error) {
        alert("Gagal daftar: " + error);
      } else {
        alert("Registrasi berhasil! Silakan login.");
        setMode("login");
        setFullName("");
        setIdentifier("");
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      // --- LOGIKA LOGIN (Email atau Username) ---
      const { role, error } = await handleLogin(identifier, password);

      if (error) {
        alert("Login Gagal: " + error);
      } else {
        // Redirect berdasarkan role dari database
        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "kurir") {
          router.push("/kurir/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center px-4">
      {/* Background Shapes */}
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#299E63]/50" />
      <div className="absolute -bottom-40 -right-40 h-112 w-md rounded-full bg-[#299E63]/50" />

      {/* Card Form */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-300">
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#222D33] font-poppins">
            {mode === "login" ? "Masuk ke Akun" : "Buat Akun Baru"}
          </h1>
          <p className="mt-2 text-gray-500 font-poppins">
            {mode === "login"
              ? "Kelola sampahmu dan kumpulkan poin sekarang"
              : "Mulai kontribusi untuk lingkungan hari ini"}
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={onSubmit}>
          {/* Input Nama Lengkap (Khusus Register) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-[#222D33] font-poppins">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="text-black mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/30 outline-none transition"
              />
            </div>
          )}

          {/* Input Identifier (Username / Email) */}
          <div>
            <label className="block text-sm font-medium text-[#222D33] font-poppins">
              {mode === "login" ? "Username / Email" : "Email"}
            </label>
            <input
              type={mode === "login" ? "text" : "email"}
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={mode === "login" ? "Masukkan username atau email" : "Masukkan email"}
              className="text-black mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/30 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#222D33] font-poppins">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/30 outline-none transition"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#299E63]"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              )}
            </div>
          </div>

          {/* Confirm Password (Khusus Register) */}
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-[#222D33] font-poppins">
                Konfirmasi Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password"
                  className="text-black w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:border-[#299E63] focus:ring-2 focus:ring-[#299E63]/30 outline-none transition"
                />
                {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#299E63]"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#299E63] py-3 text-white font-semibold transition hover:bg-[#238553] active:scale-[0.98] cursor-pointer disabled:bg-gray-400"
          >
            {loading ? "Memproses..." : mode === "login" ? "Login" : "Daftar"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-poppins">
          {mode === "login" ? (
            <>
              Belum punya akun?{" "}
              <span
                onClick={() => {
                  setMode("register");
                  setIdentifier(""); // Reset biar bersih
                }}
                className="text-[#299E63] font-semibold cursor-pointer hover:underline"
              >
                Daftar sekarang
              </span>
            </>
          ) : (
            <>
              Sudah punya akun?{" "}
              <span
                onClick={() => {
                  setMode("login");
                  setIdentifier("");
                }}
                className="text-[#299E63] font-semibold cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}