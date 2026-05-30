"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    type: "agency", message: "", city: "", country: "TR",
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Bir hata oluştu");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Bağlantı hatası, lütfen tekrar deneyin");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{
        background: "rgba(45,212,191,0.1)",
        border: "1px solid var(--teal)",
        borderRadius: 16,
        padding: "40px 32px",
        textAlign: "center",
        maxWidth: 520,
        margin: "0 auto",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <div style={{ fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 8 }}>
          Başvurunuz alındı!
        </div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6 }}>
          Lansman öncesinde sizinle iletişime geçeceğiz.
          Sorularınız için:{" "}
          <a href="mailto:info@7fil.com.tr" style={{ color: "var(--teal)", textDecoration: "none" }}>
            info@7fil.com.tr
          </a>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 520, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Ad Soyad *</label>
          <input
            required
            value={form.name}
            onChange={e => set("name", e.target.value)}
            placeholder="Adınız"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>E-posta *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={e => set("email", e.target.value)}
            placeholder="ornek@sirket.com"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Telefon</label>
          <input
            value={form.phone}
            onChange={e => set("phone", e.target.value)}
            placeholder="+90 5xx xxx xx xx"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Şirket / Ajans Adı</label>
          <input
            value={form.company}
            onChange={e => set("company", e.target.value)}
            placeholder="Şirket adı"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Sizi En İyi Tanımlayan</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { val: "agency",   label: "Gayrimenkul Ajansı" },
            { val: "investor", label: "Yatırımcı" },
            { val: "partner",  label: "Hukuk / Banka / Sigorta" },
            { val: "press",    label: "Medya / Basın" },
          ].map(opt => (
            <button
              key={opt.val}
              type="button"
              onClick={() => set("type", opt.val)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                border: "1px solid",
                borderColor: form.type === opt.val ? "var(--gold)" : "rgba(255,255,255,0.15)",
                background: form.type === opt.val ? "var(--gold)" : "transparent",
                color: form.type === opt.val ? "var(--ink)" : "rgba(255,255,255,0.7)",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Mesajınız</label>
        <textarea
          value={form.message}
          onChange={e => set("message", e.target.value)}
          placeholder="Platforma beklentileriniz, sorularınız veya önerileriniz..."
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <label style={labelStyle}>Şehir</label>
          <input
            value={form.city}
            onChange={e => set("city", e.target.value)}
            placeholder="İstanbul"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Ülke</label>
          <select
            value={form.country}
            onChange={e => set("country", e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="TR">Türkiye</option>
            <option value="UK">United Kingdom</option>
            <option value="OTHER">Diğer</option>
          </select>
        </div>
      </div>

      {status === "error" && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#fca5a5",
          fontSize: 13,
          marginBottom: 16,
        }}>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          padding: "14px",
          background: "var(--gold)",
          color: "var(--ink)",
          border: "none",
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 15,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {status === "loading" ? "Gönderiliyor..." : "Bekleme Listesine Katıl"}
      </button>
    </form>
  );
}
