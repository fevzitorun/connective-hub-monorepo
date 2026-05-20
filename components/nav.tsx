"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Ana Sayfa",  href: "/" },
  { label: "İlanlar",    href: "/ilanlar" },
  { label: "Müzayede",   href: "/muzayede" },
  { label: "Panel",      href: "/panel" },
  { label: "Atlas AI",   href: "/atlas" },
  { label: "Admin",      href: "/admin" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{ background: "var(--ink)", height: 60, position: "sticky", top: 0, zIndex: 100 }}
      className="flex items-center px-6 gap-2">
      <Link href="/" className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#fff", textDecoration: "none" }}>
        7<span style={{ color: "var(--gold)" }}>fil</span>
      </Link>

      <div className="flex gap-[2px] ml-8">
        {tabs.map(tab => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={active
                ? { background: "var(--gold)", color: "var(--ink)", fontWeight: 600, textDecoration: "none" }
                : { color: "rgba(255,255,255,0.5)", textDecoration: "none" }
              }
              className="px-[14px] py-[6px] rounded-lg text-[13px] transition-all hover:text-white hover:bg-white/10"
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex-1" />

      <button style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
        className="px-4 py-[7px] rounded-[10px] text-[13px] font-semibold border-none cursor-pointer mr-2">
        Giriş Yap
      </button>
      <button style={{ background: "var(--gold)", color: "var(--ink)" }}
        className="px-4 py-[7px] rounded-[10px] text-[13px] font-semibold border-none cursor-pointer">
        Kayıt Ol
      </button>
    </nav>
  );
}
