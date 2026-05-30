import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7fil — Yakında | Türkiye & UK Gayrimenkul Ekosistemi",
  description: "İlan, hukuk, finans, müzayede ve yapay zeka — tek platformda. Eylül 2025'te açılıyor.",
  openGraph: {
    title: "7fil — Gayrimenkul Ekosistemi",
    description: "Türkiye ve UK'nin entegre gayrimenkul platformu. Eylül 2025.",
    type: "website",
  },
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
