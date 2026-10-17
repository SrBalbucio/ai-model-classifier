"use client";

import { useState } from "react";

const PALETTE = [
  "#5eead4",
  "#818cf8",
  "#c084fc",
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#34d399",
  "#f87171",
  "#38bdf8",
];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function ModelLogo({
  name,
  logoUrl,
  size = 44,
}: {
  name: string;
  logoUrl: string | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/[\s:]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

  if (!logoUrl || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-xl font-semibold"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${colorFor(name)}33, ${colorFor(name)}11)`,
          border: `1px solid ${colorFor(name)}55`,
          color: colorFor(name),
          fontSize: size * 0.36,
        }}
      >
        {initials || "?"}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-xl"
      style={{
        width: size,
        height: size,
        background: "#0b0d10",
        border: "1px solid var(--color-edge)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
