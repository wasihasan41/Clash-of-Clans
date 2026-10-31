"use client";

import { useEffect, useRef, useState } from "react";

export function UnitIcon({
  srcs,
  name,
  size = 36,
  fallback,
  title,
}: {
  srcs: string[];
  name: string;
  size?: number;
  fallback?: string; // icon na mile toh ye text dikhega (default: naam ka pehla letter)
  title?: string;
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLImageElement>(null);
  const src = srcs[index];

  // Agar image hydration se pehle hi fail ho chuki ho, toh onError miss ho jaata hai.
  // Isliye yahan dobara check karte hain.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setIndex((i) => i + 1);
  }, [index]);

  if (!src) {
    return (
      <span
        className="icon-fallback"
        style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.3)) }}
        title={title}
        aria-hidden="true"
      >
        {fallback ?? name.charAt(0)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className="unit-icon"
      src={src}
      alt=""
      title={title}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setIndex((i) => i + 1)}
    />
  );
}