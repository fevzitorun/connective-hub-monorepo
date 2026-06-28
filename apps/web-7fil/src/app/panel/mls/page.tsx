"use client";

import React, { useState } from "react";
import { LISTINGS, fmtTRY } from "@/lib/data";
import { Photo } from "@/components/photos";
import { IconLayer, IconSparkle, IconMapPin, IconChart, IconChat, IconFilter } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type MLSTab = "havuz" | "ilanlarim" | "isbirlikleri";

interface MLSListing {
  id: string;
  title: string;
  city: string;
  price: number;
  kind: "satilik" | "kiralik";
  scene: string;
  palette: string;
  rooms: string;
  area: number;
  agentName: string;
  agentAgency: string;
  commission: number; // % each side gets
  shared: boolean; // already in cooperation?
  daysOnMLS: number;
}

// ─── Sample MLS pool (mix of LISTINGS + extras) ──────────────────────────────

const MLS_POOL: MLSListing[] = [
  ...LISTINGS.slice(0, 6).map((l, i) => ({
    id: l.id,
    title: l.title,
    city: l.city,
    price: l.price,
    kind: l.kind as "satilik" | "kiralik",
    scene: l.scene,
    palette: l.palette,
    rooms: l.rooms,
    area: l.area,
    agentName: l.agent.name,
    agentAgency: "Connective Partner",
    commission: 2,
    shared: ([false, true, false, true, false, false][i] ?? false) as boolean,
    daysOnMLS: ([3, 12, 7, 1, 21, 5][i] ?? 0) as number,
  })),
];

const MY_MLS = MLS_POOL.slice(0, 2); // first 2 are "mine"
const COOPERATIONS = MLS_POOL.filter((l) => l.shared);

// ─── MLS Card ─────────────────────────────────────────────────────────────────

const MLSCard = ({ l, showCoopBtn = true }: { l: MLSListing; showCoopBtn?: boolean }) => (
  <div className="plisting">
    <div className="plisting-photo" style={{ width: 120, minWidth: 120 }}>
      <Photo scene={l.scene} palette={l.palette} />
      <span className="pill pill-gold" style={{ fontSize: 10 }}>
        <IconLayer size={9} /> MLS
      </span>
    </div>

    <div className="plisting-body">
      <div className="plisting-meta-row">
        <span className={`plisting-kind ${l.kind === "kiralik" ? "is-rent" : "is-sale"}`}>
          {l.kind === "kiralik" ? "Kiralık" : "Satılık"}
        </span>
        <span className="plisting-price">
          {fmtTRY(l.price)}
          {l.kind === "kiralik" ? " /ay" : ""}
        </span>
      </div>
      <div className="plisting-title">{l.title}</div>
      <div className="plisting-loc">
        <IconMapPin /> {l.city}
      </div>
      <div className="plisting-metrics">
        <span className="plisting-metric">
          {l.rooms} · {l.area} m²
        </span>
        <span className="plisting-metric">{l.daysOnMLS} gün önce eklendi</span>
      </div>
    </div>

    <div className="plisting-side" style={{ gap: 12, minWidth: 180 }}>
      <div style={{ fontSize: 12, color: "rgba(255,253,248,0.5)" }}>
        {l.agentName}
        <br />
        <span style={{ fontSize: 11, color: "rgba(255,253,248,0.3)" }}>{l.agentAgency}</span>
      </div>
      <div className="mls-commission">
        <div className="mls-commission-label">Komisyon payı</div>
        <div className="mls-commission-value">%{l.commission} / %{l.commission}</div>
        <div className="mls-commission-sub">Satıcı · Alıcı acentası</div>
      </div>
      {showCoopBtn && (
        <button className="btn btn-primary btn-sm" style={{ width: "100%" }}>
          <IconChat size={12} /> İşbirliği Talep Et
        </button>
      )}
      {!showCoopBtn && (
        <span className="pill pill-success" style={{ fontSize: 11 }}>Aktif işbirliği</span>
      )}
    </div>
  </div>
);

// ─── Tab content ──────────────────────────────────────────────────────────────

const HavuzTab = () => (
  <div>
    <div className="partner-section-head">
      <h2>MLS Havuzu <span style={{ fontSize: 14, color: "rgba(255,253,248,0.4)", fontWeight: 400 }}>· {MLS_POOL.length} ilan</span></h2>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-outline btn-sm" style={{ color: "var(--paper)", borderColor: "rgba(255,253,248,0.18)" }}>
          <IconFilter size={14} /> Filtrele
        </button>
        <button className="btn btn-atlas btn-sm">
          <IconSparkle size={13} /> Atlas AI Eşleştir
        </button>
      </div>
    </div>
    <div>
      {MLS_POOL.map((l) => (
        <MLSCard key={l.id} l={l} showCoopBtn={!l.shared} />
      ))}
    </div>
  </div>
);

const IlanlarimTab = () => (
  <div>
    <div className="partner-section-head">
      <h2>MLS&apos;e Açtığım İlanlar</h2>
      <button className="btn btn-primary btn-sm">+ MLS&apos;e İlan Ekle</button>
    </div>
    {MY_MLS.length === 0 ? (
      <div className="mls-empty">
        <IconLayer size={32} />
        <p>Henüz MLS&apos;e açık ilanınız yok.</p>
        <button className="btn btn-primary">İlan Ekle</button>
      </div>
    ) : (
      <div>
        {MY_MLS.map((l) => (
          <MLSCard key={l.id} l={l} showCoopBtn={false} />
        ))}
      </div>
    )}
  </div>
);

const IsbirlikleriTab = () => (
  <div>
    <div className="partner-section-head">
      <h2>Aktif İşbirliklerim <span style={{ fontSize: 14, color: "rgba(255,253,248,0.4)", fontWeight: 400 }}>· {COOPERATIONS.length} aktif</span></h2>
    </div>
    {COOPERATIONS.length === 0 ? (
      <div className="mls-empty">
        <p>Henüz aktif işbirliği yok.</p>
      </div>
    ) : (
      <div>
        {COOPERATIONS.map((l) => (
          <div key={l.id}>
            <MLSCard l={l} showCoopBtn={false} />
            <div className="mls-coop-detail">
              <div className="mls-coop-item">
                <span>Karşı acenta</span>
                <strong>{l.agentName} · {l.agentAgency}</strong>
              </div>
              <div className="mls-coop-item">
                <span>Komisyon paylaşımı</span>
                <strong>%{l.commission} — %{l.commission}</strong>
              </div>
              <div className="mls-coop-item">
                <span>Durum</span>
                <span className="pill pill-success" style={{ fontSize: 11 }}>Aktif</span>
              </div>
              <button className="btn btn-outline btn-sm" style={{ color: "var(--paper)", borderColor: "rgba(255,253,248,0.18)" }}>
                <IconChart size={13} /> Performans Gör
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MLSPage() {
  const [tab, setTab] = useState<MLSTab>("havuz");

  return (
    <div className="partner">
      <div className="partner-inner">
        {/* Header */}
        <div className="partner-head">
          <div>
            <span className="eyebrow partner-eyebrow">MLS · Komisyon Paylaşım Sistemi</span>
            <h1>
              Türkiye&apos;nin <em style={{ color: "var(--gold)", fontStyle: "italic" }}>İlk MLS&apos;i.</em>
            </h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,253,248,0.6)", fontSize: 15 }}>
              İlanını paylaş, daha hızlı sat. Komisyon otomatik 50/50 bölünür.
            </p>
          </div>
          <div className="mls-stats-mini">
            <div className="mls-stat">
              <div className="mls-stat-num">{MLS_POOL.length}</div>
              <div className="mls-stat-label">MLS İlanı</div>
            </div>
            <div className="mls-stat">
              <div className="mls-stat-num">{COOPERATIONS.length}</div>
              <div className="mls-stat-label">İşbirliğim</div>
            </div>
            <div className="mls-stat">
              <div className="mls-stat-num">%2</div>
              <div className="mls-stat-label">Komisyon/taraf</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mls-tabs">
          {(
            [
              { id: "havuz", label: "MLS Havuzu" },
              { id: "ilanlarim", label: "İlanlarım" },
              { id: "isbirlikleri", label: `İşbirliklerim (${COOPERATIONS.length})` },
            ] as { id: MLSTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              className={`mls-tab ${tab === t.id ? "is-active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "havuz" && <HavuzTab />}
        {tab === "ilanlarim" && <IlanlarimTab />}
        {tab === "isbirlikleri" && <IsbirlikleriTab />}
      </div>
    </div>
  );
}
