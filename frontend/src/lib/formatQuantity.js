// src/lib/formatQuantity.js

export function formatQuantity(value) {
    if (typeof value !== "number") {
      value = Number(value);
    }
    if (isNaN(value)) return "0";
  
    return new Intl.NumberFormat("id-ID").format(value);
  }
  