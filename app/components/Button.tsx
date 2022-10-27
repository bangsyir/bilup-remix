import React from "react";

export default function Button({
  children,
  type,
}: {
  children: React.ReactNode;
  type: "submit" | "button" | "reset";
}) {
  return (
    <button
      type={type}
      className="bg-cyan-900 text-white hover:bg-cyan-700 px-2 py-2 rounded-md"
    >
      {children}
    </button>
  );
}
