"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/panel");
        }
      } else {
        setError(data.error || "Giris basarisiz.");
      }
    } catch {
      setError("Bir hata olustu. Lutfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 60px)", background: "var(--cream)" }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 44, width: 400, border: "1px solid var(--border)", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
        <div className="serif" style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>
          7<span style={{ color: "var(--gold)" }}>fil</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Hesabiniza Giris Yapin</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 28 }}>
          Hesabiniz yok mu?{" "}
          <Link href="/kayit" style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>Kayit olun</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
              placeholder="ornek@sirket.com"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Sifre</label>
              <Link href="#" style={{ fontSize: 12, color: "var(--teal)", textDecoration: "none" }}>Sifremi unuttum</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--teal)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#991b1b", marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: loading ? "var(--muted)" : "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.15s" }}>
            {loading ? "Giris yapiliyor..." : "Giris Yap"}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: "16px", background: "#f9fafb", borderRadius: 10, fontSize: 12, color: "var(--muted)" }}>
          <strong style={{ color: "var(--ink)" }}>Test hesabi:</strong><br />
          admin@7fil.com.tr / Admin123! — Admin paneli<br />
          <span style={{ fontSize: 11 }}>(Once /api/seed adresine POST isteği gönderiniz)</span>
        </div>
      </div>
    </div>
  );
}
