import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7fil — Türkiye'nin Entegre Gayrimenkul Ekosistemi",
  description: "İlan, hukuk, finans, müzayede ve yapay zeka — tek platformda.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}
