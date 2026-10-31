"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function SearchNav() {
  const pathname = usePathname();

  if (!pathname.startsWith("/player/")) {
    return null;
  }

  return (
    <nav>
      <Link className="brand" href="/">SEARCH</Link>
    </nav>
  );
}
