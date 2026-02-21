import { RelationOrArray } from "../types/report";

// Helper normalisasi relasi Supabase (object atau array)
export const pickFirstRelation = <T,>(value: RelationOrArray<T> | undefined): T | null => {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
};

// Format currency rupiah
export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

// Format tanggal + waktu
export const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
