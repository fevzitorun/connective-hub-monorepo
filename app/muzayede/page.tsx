"use client";
import { useEffect, useState } from "react";

export default function MuzaydePage() {
  const [time, setTime] = useState({ h: 2, m: 34, s: 17 });
  const [bidMsg, setBidMsg] = useState(false);
  const [bidAmount, setBidAmount] = useState("4.700.000");
  const [history, setHistory] = useState([
    { user: "K***n A.", amount: "₺4.650.000", ago: "2 dk önce" },
    { user: "M***t Y.", amount: "₺4.600.000", ago: "5 dk önce" },
    { user: "A***e K.", amount: "₺4.550.000", ago: "9 dk önce" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const placeBid = () => {
    const newEntry = { user: "Siz",  amount: `₺${bidAmount}`, ago: "az önce" };
    setHistory(prev => [newEntry, ...prev.slice(0, 4)]);
    setBidMsg(true);
    setTimeout(() => setBidMsg(false), 2500);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="serif" style={{ fontSize: 26, fontWeight: 700 }}>Gayrimenkul Müzayedeleri</div>
        <div style={{ color: "var(--muted)", marginTop: 6 }}>Canlı teklifler · Anlık güncelleme · Güvenli işlem</div>
      </div>

      {/* Live auction */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ background: "var(--ink)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>🏠 Beşiktaş — Deniz Manzaralı 3+1, 250 m²</div>
          <div style={{ background: "var(--red)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20, display: "flex", alignItems: "center", gap: 6 }}>
            <div className="live-dot" />CANLI
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Mevcut En Yüksek Teklif</div>
              <div className="serif" style={{ fontSize: 36, fontWeight: 700 }}>₺4.650.000</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Başlangıç: ₺4.200.000 · 47 teklif</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "right", marginBottom: 8 }}>Kalan Süre</div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {[{ num: pad(time.h), lbl: "Saat" }, { num: pad(time.m), lbl: "Dak" }, { num: pad(time.s), lbl: "San" }].map(u => (
                  <div key={u.lbl} style={{ textAlign: "center", background: "#f3f4f6", borderRadius: 10, padding: "10px 16px" }}>
                    <div className="serif" style={{ fontSize: 28, fontWeight: 700 }}>{u.num}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>{u.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12 }}>
            {[4700000, 4750000, 4800000].map(v => (
              <button key={v} onClick={() => setBidAmount(v.toLocaleString("tr-TR"))}
                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid var(--border)", background: "#f9fafb", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                ₺{v.toLocaleString("tr-TR")}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <input type="text" value={bidAmount} onChange={e => setBidAmount(e.target.value)}
              style={{ flex: 1, border: "2px solid var(--gold)", borderRadius: 10, padding: "10px 14px", fontSize: 15, fontWeight: 700, outline: "none" }} />
            <button onClick={placeBid}
              style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              Teklif Ver
            </button>
          </div>
          {bidMsg && <div style={{ marginTop: 8, fontSize: 13, color: "var(--green)" }}>✓ Teklifiniz iletildi!</div>}

          <div style={{ marginTop: 16, background: "#f9fafb", borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", marginBottom: 8 }}>SON TEKLİFLER</div>
            {history.map((b, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
                <span>{b.user}</span><span style={{ fontWeight: 700 }}>{b.amount}</span><span style={{ color: "var(--muted)" }}>{b.ago}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { title: "Sarıyer Villa — 4+2",  start: "₺8.500.000",  date: "2 Haziran 2026, 14:00" },
          { title: "Levent Ofis — 380 m²", start: "₺12.000.000", date: "3 Haziran 2026, 10:00" },
        ].map(a => (
          <div key={a.title} style={{ background: "#fff", borderRadius: 16, border: "1px solid var(--border)", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{a.title}</div>
              <span className="badge badge-yellow">Yakında</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>Başlangıç: {a.start}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>⏰ {a.date}</div>
            <button style={{ marginTop: 12, padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "#fff", color: "var(--ink)" }}>
              Hatırlatıcı Kur
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
