"use client";
import { useState, useRef, useEffect } from "react";

interface Message { role: "user" | "ai"; text: string; time: string; }

const aiReplies = [
  "Peki, bu konuyu analiz ediyorum... 📊\n\nGüncel veriler inceleniyor, bir saniye bekleyin.",
  "7fil piyasa verilerine göre bu bölgede yatırım potansiyeli yüksek görünüyor. Kira getirisi yaklaşık %3.2 ve değer artışı beklentisi olumlu.",
  "Bu mahalledeki son 6 ay içindeki ortalama satış süresi 47 gün. Piyasa hafif alıcı lehine ancak iyi konumlu ilanlar hızlı satılıyor.",
  "Benzer ilanlar karşılaştırıldığında talep ettiğiniz fiyat piyasa değerinin %8 üzerinde. Fiyatı ₺4.2M'a çekmenizi öneririm.",
];

const initialMessages: Message[] = [
  { role: "ai", text: "Merhaba! Ben Atlas, 7fil'in yapay zeka asistanıyım. 🏠\n\nGüncel piyasa verileri, değerleme, mahalle analizi veya yatırım tavsiyesi için buradayım. Ne öğrenmek istersiniz?", time: "14:28" },
  { role: "user", text: "Beşiktaş'ta 3+1 daire fiyatları son 6 ayda nasıl değişti?", time: "14:31" },
  { role: "ai", text: "Beşiktaş 3+1 Piyasa Analizi (Kas 2025 – May 2026)\n\n📈 Ortalama Fiyat Artışı: %14.2 (enflasyon üzeri reel +%3.8)\n💰 Mevcut Ortalama: ₺4.2M – ₺5.8M arası\n📐 m² Birim Fiyat: ₺18.500 – ₺24.000\n\nÖne Çıkan Faktörler:\n• Beşiktaş-Sarıyer metro hattı etkisi (+8%)\n• Deniz manzaralı stoklarda ciddi azalma\n• Yabancı alıcı ilgisinde %22 artış\n\nBelirli bir sokak veya proje için daha detaylı analiz ister misiniz?", time: "14:32" },
];

const historyItems = [
  { title: "Beşiktaş piyasa analizi",       date: "Bugün, 14:32",  active: true },
  { title: "Kadıköy değerleme raporu",       date: "Dün, 09:15",   active: false },
  { title: "Yatırım tavsiyesi — Arnavutköy", date: "19 May",       active: false },
  { title: "DASK prim hesabı",               date: "17 May",       active: false },
];

const quickPrompts = [
  { icon: "📊", label: "Mahalle Skoru",    text: "Mahalle güvenlik skoru ver" },
  { icon: "💡", label: "Yatırım Analizi",  text: "Bu fiyata yatırım değer mi?" },
  { icon: "🔍", label: "Benzer İlanlar",   text: "Yakın çevrede satılan benzer ilanlar" },
  { icon: "🏦", label: "DASK Hesapla",     text: "DASK prim hesapla" },
];

function now() {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AtlasPage() {
  const [msgs, setMsgs] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { role: "user", text, time: now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [...prev, { role: "ai", text: aiReplies[replyIdx % aiReplies.length], time: now() }]);
      setReplyIdx(i => i + 1);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* History */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid var(--border)", padding: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>Konuşmalar</div>
        {historyItems.map(h => (
          <div key={h.title} style={{ padding: "9px 12px", borderRadius: 10, cursor: "pointer", marginBottom: 4, background: h.active ? "var(--ink)" : "transparent", color: h.active ? "#fff" : "var(--ink)" }}
            className={!h.active ? "hover:bg-gray-100" : ""}>
            <p style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{h.title}</p>
            <small style={{ fontSize: 11, color: h.active ? "rgba(255,255,255,0.4)" : "var(--muted)" }}>{h.date}</small>
          </div>
        ))}
        <div style={{ marginTop: 16 }}>
          <button style={{ width: "100%", padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid var(--border)", background: "#fff", color: "var(--ink)" }}>
            + Yeni Konuşma
          </button>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--cream)" }}>
        {/* Messages */}
        <div style={{ flex: 1, padding: 24, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 4, alignSelf: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                padding: "12px 16px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line",
                background: m.role === "user" ? "var(--ink)" : "#fff",
                color: m.role === "user" ? "#fff" : "var(--ink)",
                border: m.role === "ai" ? "1px solid var(--border)" : "none",
              }}>
                {m.text}
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)", textAlign: m.role === "user" ? "right" : "left" }}>{m.time}</div>
            </div>
          ))}
          {typing && (
            <div style={{ maxWidth: "70%" }}>
              <div className="typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "16px 24px", background: "#fff", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {quickPrompts.map(q => (
              <button key={q.label} onClick={() => send(q.text)}
                style={{ padding: "5px 12px", borderRadius: 20, border: "1px solid var(--border)", background: "#fff", fontSize: 12, cursor: "pointer", color: "var(--ink)" }}
                className="hover:border-[var(--teal)] hover:text-[var(--teal)]">
                {q.icon} {q.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              placeholder="Atlas'a sor..."
              style={{ flex: 1, border: "1px solid var(--border)", borderRadius: 12, padding: "10px 16px", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => send(input)}
              style={{ background: "var(--gold)", color: "var(--ink)", border: "none", borderRadius: 12, padding: "0 20px", fontWeight: 700, cursor: "pointer", fontSize: 18 }}>
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
