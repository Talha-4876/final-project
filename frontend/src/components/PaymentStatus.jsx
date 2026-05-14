// FILE: src/components/PaymentStatus.jsx  (USER SIDE)
// Reusable payment status badge — use anywhere (checkout, history, etc.)
// Props:
//   isPaid  : boolean
//   size    : "sm" | "md" (default "md")
//   showText: boolean (default true)

import React from "react";

export default function PaymentStatus({ isPaid, size = "md", showText = true }) {
  const isSmall = size === "sm";

  if (isPaid) {
    return (
      <span
        style={{ background: "#dcfce7", color: "#15803d" }}
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${
          isSmall ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
        }`}
      >
        <span className={isSmall ? "text-sm" : "text-base"}>✅</span>
        {showText && "Paid"}
      </span>
    );
  }

  return (
    <span
      style={{ background: "#fff7ed", color: "#c2410c" }}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${
        isSmall ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"
      }`}
    >
      <span className={isSmall ? "text-sm" : "text-base"}>⏳</span>
      {showText && "Pending"}
    </span>
  );
}
