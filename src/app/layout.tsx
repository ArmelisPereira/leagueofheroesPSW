import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "./Components/Header";
import Footer from "./Components/Footer";
import { HeroesProvider } from "./Context/HeroesContext";

const inter = Inter({
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
        className={inter.className}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <HeroesProvider>
          <Header myName="Armelis" projectName="League of Heroes" />

          <main style={{ flex: 1, padding: "20px" }}>{children}</main>

          <Footer myName="Armelis" projectName="League of Heroes" />
        </HeroesProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "League of Heroes - PV33680/29373",
  description: "Ficha 8 - Deploy",
};
