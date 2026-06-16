"use client";

import React, { useState } from "react";
import { IconSparkle, IconShield, IconLayer, IconChart, IconDocument, IconChat, IconRobot, IconKey, IconCoin, IconScale } from "@/components/icons";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "free",
    name: "Ücretsiz",
    price: { monthly: 0, yearly: 0 },
    desc: "Başlamak için.",
    color: "var(--muted)",
    features: [
      { text: "3 aktif ilan", ok: true },
      { text: "Atlas AI (5 sorgu/ay)", ok: true },
      { text: "Temel analitik", ok: true },
      { text: "MLS erişimi", ok: false },
      { text: "WhatsApp entegrasyonu", ok: false },
      { text: "PDF Broşür", ok: false },
      { text: "CRM Kanban", ok: false },
    ],
    cta: "Ücretsiz Başla",
    ctaStyle: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 990, yearly: 790 },
    desc: "Bireysel danışman veya küçük acenta.",
    color: "var(--teal)",
    popular: false,
    features: [
      { text: "10 aktif ilan", ok: true },
      { text: "Atlas AI sınırsız", ok: true },
      { text: "Gelişmiş analitik", ok: true },
      { text: "MLS erişimi", ok: true },
      { text: "WhatsApp entegrasyonu", ok: true },
      { text: "PDF Broşür (5/ay)", ok: true },
      { text: "CRM Kanban", ok: false },
    ],
    cta: "14 Gün Ücretsiz Dene",
    ctaStyle: "primary",
  },
  {
    id: "kurumsal",
    name: "Kurumsal",
    price: { monthly: 2490, yearly: 1990 },
    desc: "Büyüyen acentalar için tam paket.",
    color: "var(--gold)",
    popular: true,
    features: [
      { text: "Sınırsız ilan", ok: true },
      { text: "Atlas AI öncelikli", ok: true },
      { text: "Tam analitik dashboard", ok: true },
      { text: "MLS + komisyon yönetimi", ok: true },
      { text: "WhatsApp toplu kampanya", ok: true },
      { text: "PDF Broşür sınırsız", ok: true },
      { text: "CRM Kanban + takvim", ok: true },
    ],
    extras: ["SCRIBE içerik fabrikası", "Beyaz etiket site", "Öncelikli destek"],
    cta: "14 Gün Ücretsiz Dene",
    ctaStyle: "atlas",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 5990, yearly: 4990 },
    desc: "Çok şubeli kurumsal acentalar.",
    color: "#7c6fcd",
    features: [
      { text: "Her şey dahil", ok: true },
      { text: "Özel hesap yöneticisi", ok: true },
      { text: "FILTERRA.AI B2B API", ok: true },
      { text: "Toplu ilan aktarımı", ok: true },
      { text: "SLA %99.9 garantisi", ok: true },
      { text: "Özel AI fine-tuning", ok: true },
      { text: "Çok kullanıcı / rol", ok: true },
    ],
    extras: ["TicariMetre Pro raporu", "Banka veri entegrasyonu", "Özel sözleşme"],
    cta: "Satış Ekibiyle Görüş",
    ctaStyle: "outline-light",
  },
];

const FEATURES_COMPARE = [
  { label: "Aktif İlan", free: "3", pro: "10", kurumsal: "Sınırsız", enterprise: "Sınırsız", icon: IconDocument },
  { label: "Atlas AI", free: "5/ay", pro: "Sınırsız", kurumsal: "Öncelikli", enterprise: "Fine-tuned", icon: IconRobot },
  { label: "MLS Erişimi", free: "—", pro: "✓", kurumsal: "✓ + Yönetim", enterprise: "✓ Platform geneli", icon: IconLayer },
  { label: "CRM Kanban", free: "—", pro: "—", kurumsal: "✓", enterprise: "✓ Çok kullanıcı", icon: IconChart },
  { label: "PDF Broşür", free: "—", pro: "5/ay", kurumsal: "Sınırsız", enterprise: "Sınırsız + API", icon: IconDocument },
  { label: "WhatsApp", free: "—", pro: "✓", kurumsal: "✓ Toplu", enterprise: "✓ Toplu + Bot", icon: IconChat },
  { label: "Hukuki Doğrulama", free: "—", pro: "—", kurumsal: "✓", enterprise: "✓ Öncelikli", icon: IconShield },
  { label: "FILTERRA.AI Değerleme", free: "—", pro: "—", kurumsal: "✓", enterprise: "✓ B2B API", icon: IconScale },
  { label: "Depozito Güvence", free: "—", pro: "—", kurumsal: "✓", enterprise: "✓ Escrow entegrasyonu", icon: IconKey },
  { label: "Ödeme", free: "Ücretsiz", pro: "990/mo", kurumsal: "2.490/mo", enterprise: "5.990/mo", icon: IconCoin },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FiyatlarPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="section" style={{ paddingTop: 96, paddingBottom: 64, textAlign: "center" }}>
        <span className="eyebrow eyebrow-gold">Fiyatlandırma</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 52px)", color: "var(--ink)", margin: "12px 0 16px", fontWeight: 400 }}>
          Sahibinden&apos;in yıllık bedeli kadar.<br />
          <em style={{ color: "var(--gold-deep)" }}>On katı değerinde.</em>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 560, margin: "0 auto 32px" }}>
          İlk 14 gün ücretsiz. Kredi kartı gerekmez. İstediğiniz zaman iptal edin.
        </p>

        {/* Toggle */}
        <div className="pricing-toggle">
          <span className={!yearly ? "is-active" : ""} onClick={() => setYearly(false)}>Aylık</span>
          <button
            className={`toggle ${yearly ? "" : ""}`}
            aria-checked={yearly}
            onClick={() => setYearly(!yearly)}
            aria-label="Yıllık fiyatlandırma"
            style={{ margin: "0 10px" }}
          />
          <span className={yearly ? "is-active" : ""} onClick={() => setYearly(true)}>
            Yıllık <span className="pricing-save-badge">%20 İndirim</span>
          </span>
        </div>
      </section>

      {/* Plans grid */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="pricing-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "is-popular" : ""}`}
              style={{ borderTopColor: plan.color }}
            >
              {plan.popular && (
                <div className="pricing-popular-badge" style={{ background: plan.color }}>
                  En Çok Tercih Edilen
                </div>
              )}
              <div className="pricing-plan-name" style={{ color: plan.color }}>{plan.name}</div>
              <div className="pricing-plan-price">
                {plan.price.monthly === 0 ? (
                  <span className="pricing-price-num">Ücretsiz</span>
                ) : (
                  <>
                    <span className="pricing-price-num">
                      {(yearly ? plan.price.yearly : plan.price.monthly).toLocaleString("tr-TR")}
                    </span>
                    <span className="pricing-price-period"> ₺/ay</span>
                  </>
                )}
              </div>
              <div className="pricing-plan-desc">{plan.desc}</div>

              <ul className="pricing-features">
                {plan.features.map((f) => (
                  <li key={f.text} className={f.ok ? "ok" : "no"}>
                    <span>{f.ok ? "✓" : "—"}</span> {f.text}
                  </li>
                ))}
              </ul>

              {plan.extras && (
                <div className="pricing-extras">
                  {plan.extras.map((e) => (
                    <div key={e} className="pricing-extra-chip">
                      <IconSparkle size={10} /> {e}
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`btn btn-${plan.ctaStyle === "atlas" ? "atlas" : plan.ctaStyle === "outline-light" ? "outline" : plan.ctaStyle} pricing-cta`}
                style={plan.ctaStyle === "outline" && plan.id !== "free" ? { color: "var(--ink)", borderColor: "rgba(20,20,42,0.2)" } : {}}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-ink">
        <div className="section-inner">
          <div className="section-head" style={{ marginBottom: 40 }}>
            <div>
              <span className="eyebrow" style={{ color: "var(--gold)" }}>Karşılaştırma</span>
              <h2>Hangi pakette ne var?</h2>
            </div>
          </div>
          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Özellik</th>
                  <th>Ücretsiz</th>
                  <th>Pro</th>
                  <th style={{ color: "var(--gold)" }}>Kurumsal ★</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {FEATURES_COMPARE.map((f) => (
                  <tr key={f.label}>
                    <td>
                      <span className="pricing-table-icon"><f.icon size={14} /></span>
                      {f.label}
                    </td>
                    <td>{f.free}</td>
                    <td>{f.pro}</td>
                    <td style={{ color: "var(--gold)" }}>{f.kurumsal}</td>
                    <td>{f.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ / CTA */}
      <section className="section" style={{ textAlign: "center", paddingTop: 80, paddingBottom: 96 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: "var(--ink)", fontWeight: 400 }}>
          Hâlâ sorularınız var mı?
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 12, marginBottom: 32 }}>
          Satış ekibimiz 09:00–19:00 arasında WhatsApp&apos;ta.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-primary">14 Gün Ücretsiz Başla</button>
          <button className="btn btn-outline">WhatsApp&apos;ta Yaz</button>
        </div>
      </section>
    </div>
  );
}
