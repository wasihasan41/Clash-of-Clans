import type { Metadata } from "next";
import Link from "next/link";
import { SearchNav } from "@/components/SearchNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dark Stats",
  description: " Search a player by tag to see their heroes, troops, equipment, pets, spells and recent battles."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <h1 className="brand">
            DARK STATS
          </h1>
          <SearchNav />
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          {"\u00A9"} {new Date().getFullYear()} Dark. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
