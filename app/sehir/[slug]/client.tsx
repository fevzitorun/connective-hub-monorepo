"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LISTINGS, fmtTRY } from "@/lib/data";
import type { City } from "@/lib/cities";
import { CITIES } from "@/lib/cities";
import { BrandSilhouette, IconSearch, IconSparkle, IconMapPin, IconChart } from "@/components/icons";
import { ListingCard } from "@/components/ui";
import type { Listing } from "@/lib/data";

// ─── Stat card ────────────────────────────────────────────────────────────────

const Stat = ({ num, label, sub }: { num: string; label: string; sub?: string }) => (
  <div className="city-stat">
    <div className="city-stat-num">{num}</div>
    <div className="city-stat-label">{label}</div>
    {sub && <div className="city-stat-sub">{sub}</div>}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CityPageClient({ city }: { city: City }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Use global LISTINGS filtered loosely by city name for demo
  const cityListings = LISTINGS.filter((l) =>
    l.city.toLowerCase().includes(city.name.toLowerCase()) ||
    l.city.toLowerCase().includes(city.nameFull.split(" · ")[0].toLowerCase())
  ).slice(0, 4);

  // Fallback: show first 4 listings if none match
  const displayListings = cityListings.length >= 2 ? cityListings : LISTINGS.slice(0, 4);

  const handleOpen = (l: Listing) => router.push(`/ilanlar/${l.id}`);

  return (
    <div style={{ background: "var(--cream)" }}>
      {/* Hero */}
      <section className="city-hero">
        <div className="city-hero-watermark" aria-hidden="true">
          <BrandSilhouette color="rgba(201,168,76,0.12)" />
        </div>
        <div className="city-hero-inner">
          <span className="eyebrow eyebrow-gold">{city.nameFull} · 7fil</span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px,4vw,56px)", fontWeight: 400, color: "var(--ink)", margin: "12px 0 16px", lineHeight: 1.15 }}>
            {city.name}&apos;de <em style={{ color: "var(--gold-deep)" }}>doğru ev.</em>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17, maxWidth: 560, marginBottom: 32, lineHeight: 1.6 }}>
            {city.desc}
          </p>

          {/* Search */}
          <div className="hero-search" role="search" style={{ maxWidth: 640 }}>
            <IconSearch />
            <input
              placeholder={`${city.name}'de ara — "metroya yakın 3+1"`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="hero-search-divider" />
            <button className="hero-aimode">
              <IconSparkle size={12} /> Atlas AI
            </button>
            <button className="btn btn-primary btn-sm" style={{ height: 40, padding: "0 18px" }}>
              Ara
            </button>
          </div>

          {/* District chips */}
          <div className="hero-chips" style={{ marginTop: 20 }}>
            {city.districts.map((d) => (
              <button key={d} className="hero-chip">{d}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--ink)", padding: "32px 24px" }}>
        <div className="city-stats" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Stat num={city.listingCount.toLocaleString("tr-TR")} label="Aktif İlan" />
          <Stat num={city.agentCount.toLocaleString("tr-TR")} label="Onaylı Acenta" />
          <Stat
            num={`${Math.round(city.avgPrice / 1000000 * 10) / 10}M ₺`}
            label="Ortalama Fiyat"
            sub="satılık konut"
          />
          <Stat num={city.trend} label="Yıllık Artış" sub="FILTERRA.AI endeksi" />
        </div>
      </section>

      {/* Listings */}
      <section className="section section-tight">
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow-gold">{city.name} İlanları</span>
            <h2>{city.name}&apos;in <em>öne çıkan ilanları.</em></h2>
          </div>
          <button className="btn btn-outline" onClick={() => router.push("/ilanlar")}>
            Tümünü Gör
          </button>
        </div>
        <div className="cards-grid">
          {displayListings.map((l) => (
            <ListingCard key={l.id} l={l} onOpen={handleOpen} />
          ))}
        </div>
      </section>

      {/* Atlas AI mahalle raporu */}
      <section className="section-ink">
        <div className="section-inner" style={{ maxWidth: 900 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 48, height: 48, background: "rgba(201,168,76,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconChart size={22} style={{ color: "var(--gold)" }} />
              </div>
            </div>
            <div>
              <span className="eyebrow" style={{ color: "var(--gold)" }}>FILTERRA.AI · Piyasa Raporu</span>
              <h2 style={{ marginTop: 8 }}>{city.name} <em>piyasa özeti.</em></h2>
              <p style={{ color: "rgba(255,253,248,0.6)", marginTop: 12, lineHeight: 1.7 }}>
                {city.name} gayrimenkul piyasası son 12 ayda <strong style={{ color: "var(--gold)" }}>{city.trend}</strong> değer artışı gösterdi.{" "}
                {city.districts[0]} ve {city.districts[1]} bölgelerinde talep en yüksek seviyede seyrediyor.
                Atlas AI ile kişisel piyasa raporu alabilir, FILTERRA.AI değerleme aracıyla
                baktığınız mülkün gerçek değerini öğrenebilirsiniz.
              </p>
              <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
                <button className="btn btn-atlas btn-sm">
                  <IconSparkle size={13} /> Atlas AI Piyasa Raporu
                </button>
                <button className="btn btn-outline btn-sm" style={{ color: "var(--paper)", borderColor: "rgba(255,253,248,0.18)" }}>
                  PDF Olarak İndir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other cities */}
      <section className="section section-tight">
        <div className="section-head">
          <div>
            <span className="eyebrow eyebrow-gold">Diğer Şehirler</span>
            <h2>Türkiye&apos;nin her köşesinde <em>7fil.</em></h2>
          </div>
        </div>
        <div className="city-grid">
          {CITIES.filter((c) => c.slug !== city.slug).map((c) => (
            <button
              key={c.slug}
              className="city-chip-card"
              onClick={() => router.push(`/sehir/${c.slug}`)}
            >
              <div className="city-chip-name">{c.name}</div>
              <div className="city-chip-meta">
                {c.listingCount.toLocaleString("tr-TR")} ilan · {c.trend}
              </div>
              <IconMapPin size={12} style={{ color: "var(--gold)", marginTop: 6 }} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
