import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { HeroesProvider } from "./Context/HeroesContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "League of Heroes - PV33680/29373",
  description: "Ficha 8 - Deploy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${inter.className} appShell`}>
        <HeroesProvider>
          <Header myName="Armelis" projectName="League of Heroes" />

          {/* ÁREA CENTRAL (onde o loader deve ficar) */}
          <main className="appMain">{children}</main>

          <Footer myName="Armelis" projectName="League of Heroes" />
        </HeroesProvider>
      </body>
    </html>
  );
}
