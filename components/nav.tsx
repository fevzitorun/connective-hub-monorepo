"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

const mainTabs = [
  { label: "Ilanlar",   href: "/ilanlar" },
  { label: "Muzayede", href: "/muzayede" },
  { label: "Atlas AI", href: "/atlas" },
];

export default function Nav() {
  const pathname = usePathname();
  const [user, setUser] = useState<NavUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.ok) setUser(data.user);
        else setUser(null);
      })
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  }

  const panelHref = user?.role === "admin" ? "/admin" : "/panel";

  return (
    <nav style={{ background: "var(--ink)", height: 60, position: "sticky", top: 0, zIndex: 100 }}
      className="flex items-center px-6 gap-2">
      <Link href="/" className="serif" style={{ fontSize: 22, fontWeight: 700, color: "#fff", textDecoration: "none", flexShrink: 0 }}>
        7<span style={{ color: "var(--gold)" }}>fil</span>
      </Link>

      <div className="flex gap-[2px] ml-8">
        {mainTabs.map(tab => {
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

      {user ? (
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", color: "#fff", border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <span style={{ width: 24, height: 24, background: "var(--gold)", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "var(--ink)" }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
            {user.name.split(" ")[0]}
            <span style={{ fontSize: 10, opacity: 0.6 }}>▼</span>
          </button>

          {menuOpen && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 180, zIndex: 200 }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{user.email}</div>
                <div style={{ fontSize: 10, marginTop: 4, background: "#f3f4f6", borderRadius: 4, padding: "2px 6px", display: "inline-block", fontFamily: "monospace", color: "var(--muted)" }}>
                  {user.role}
                </div>
              </div>
              <div style={{ padding: "6px 8px" }}>
                <Link href={panelHref} onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "8px 10px", borderRadius: 8, textDecoration: "none", fontSize: 13, color: "var(--ink)", fontWeight: 600 }}
                  className="hover:bg-gray-50">
                  {user.role === "admin" ? "Admin Paneli" : "Panel"}
                </Link>
                <Link href="/ilanlar" onClick={() => setMenuOpen(false)}
                  style={{ display: "block", padding: "8px 10px", borderRadius: 8, textDecoration: "none", fontSize: 13, color: "var(--ink)" }}
                  className="hover:bg-gray-50">
                  Ilanlar
                </Link>
              </div>
              <div style={{ padding: "6px 8px", borderTop: "1px solid var(--border)" }}>
                <button onClick={handleLogout}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, background: "transparent", border: "none", fontSize: 13, color: "#dc2626", fontWeight: 600, cursor: "pointer" }}
                  className="hover:bg-red-50">
                  Cikis Yap
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/giris"
            style={{ background: "rgba(255,255,255,0.08)", color: "#fff", textDecoration: "none" }}
            className="px-4 py-[7px] rounded-[10px] text-[13px] font-semibold">
            Giris Yap
          </Link>
          <Link href="/kayit"
            style={{ background: "var(--gold)", color: "var(--ink)", textDecoration: "none" }}
            className="px-4 py-[7px] rounded-[10px] text-[13px] font-semibold">
            Kayit Ol
          </Link>
        </div>
      )}
    </nav>
  );
}
