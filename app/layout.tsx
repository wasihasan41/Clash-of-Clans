import type { Metadata } from "next";
import Link from "next/link";
import { SearchNav } from "@/components/SearchNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clash Lookup",
  description: "Look up Clash of Clans players, clans and leaderboards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <h1 className="brand">
            COC STATS TRACKER
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
