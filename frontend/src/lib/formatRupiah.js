// src/lib/formatRupiah.js

export function formatRupiah(value) {
    if (typeof value !== "number") {
      value = Number(value);
    }
    if (isNaN(value)) return "Rp 0";
  
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // kalau mau 2 angka di belakang koma ubah ke 2
    }).format(value);
  }


export const unformatRupiah = (str) => {
  if (!str) return 0;
  return parseInt(str.replace(/[^0-9]/g, ""), 10);
};

export const formatRupiahInput = (value) => {
  const num = value.replace(/\D/g, ""); // hanya angka
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
