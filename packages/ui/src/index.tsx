import React from "react";

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#008080", // Transformative Teal (primary)
        color: "#f0f0f0", // off-white
        border: "none",
        borderRadius: "4px",
        padding: "8px 16px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "14px",
      }}
    >
      {children}
    </button>
  );
}
