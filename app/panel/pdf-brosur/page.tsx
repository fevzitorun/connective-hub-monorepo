"use client";

import React, { useState } from "react";
import { LISTINGS, fmtTRY } from "@/lib/data";
import { Photo } from "@/components/photos";
import { IconDocument, IconSparkle, IconMapPin, IconEye, IconChat, IconBookmark } from "@/components/icons";
import type { Listing } from "@/lib/data";

// ─── Brochure templates ───────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    desc: "Temiz, beyaz zemin. Kurumsal.",
    preview: "bg-white text",
  },
  {
    id: "luxury",
    name: "Lüks",
    desc: "Koyu zemin, altın detaylar.",
    preview: "bg-dark gold",
  },
  {
    id: "editorial",
    name: "Editoryal",
    desc: "Büyük fotoğraf, magazine tarzı.",
    preview: "bg-cream serif",
  },
];

const LANGS = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "ar", label: "العربية" },
  { id: "ru", label: "Русский" },
];

// ─── Brochure Preview ─────────────────────────────────────────────────────────

const BrochurePreview = ({ listing, template, lang }: { listing: Listing; template: string; lang: string }) => {
  const isLuxury = template === "luxury";
  const isEditorial = template === "editorial";

  const bg = isLuxury ? "var(--ink)" : isEditorial ? "var(--cream)" : "#fff";
  const textColor = isLuxury ? "var(--paper)" : "var(--ink)";
  const accentColor = isLuxury ? "var(--gold)" : "var(--teal)";

  const labels: Record<string, Record<string, string>> = {
    tr: { sale: "Satılık", rent: "Kiralık", month: "/ay", rooms: "Oda", area: "m²", floor: "Kat", agent: "Danışman", contact: "İletişim" },
    en: { sale: "For Sale", rent: "For Rent", month: "/mo", rooms: "Rooms", area: "m²", floor: "Floor", agent: "Agent", contact: "Contact" },
    ar: { sale: "للبيع", rent: "للإيجار", month: "/شهر", rooms: "غرف", area: "م²", floor: "طابق", agent: "وكيل", contact: "تواصل" },
    ru: { sale: "Продажа", rent: "Аренда", month: "/мес", rooms: "Комн.", area: "м²", floor: "Этаж", agent: "Агент", contact: "Контакт" },
  };

  const t = labels[lang] ?? labels.tr;

  return (
    <div
      className="pdf-preview"
      style={{ background: bg, color: textColor, fontFamily: isEditorial ? "var(--font-serif)" : "var(--font-sans)" }}
    >
      {/* Header stripe */}
      <div className="pdf-preview-header" style={{ borderBottomColor: accentColor }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: accentColor, letterSpacing: "-0.02em" }}>7fil</div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>7fil.com.tr</div>
      </div>

      {/* Photo */}
      <div className="pdf-preview-photo">
        <Photo scene={listing.scene} palette={listing.palette} />
        <div
          className="pdf-preview-badge"
          style={{ background: accentColor, color: isLuxury ? "var(--ink)" : "white" }}
        >
          {listing.kind === "kiralik" ? t.rent : t.sale}
        </div>
      </div>

      {/* Content */}
      <div className="pdf-preview-body">
        <div className="pdf-preview-price" style={{ color: accentColor }}>
          {fmtTRY(listing.price)}{listing.kind === "kiralik" ? t.month : ""}
        </div>
        <div className="pdf-preview-title">{listing.title}</div>
        <div className="pdf-preview-loc" style={{ opacity: 0.55 }}>
          <IconMapPin /> {listing.city}
        </div>

        <div className="pdf-preview-stats">
          <div className="pdf-preview-stat">
            <div style={{ fontSize: 18, fontWeight: 700 }}>{listing.rooms}</div>
            <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase" }}>{t.rooms}</div>
          </div>
          <div className="pdf-preview-stat">
            <div style={{ fontSize: 18, fontWeight: 700 }}>{listing.area}</div>
            <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase" }}>{t.area}</div>
          </div>
          <div className="pdf-preview-stat">
            <div style={{ fontSize: 18, fontWeight: 700 }}>{listing.floor}</div>
            <div style={{ fontSize: 10, opacity: 0.5, textTransform: "uppercase" }}>{t.floor}</div>
          </div>
        </div>

        <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.7, margin: "12px 0" }}>
          {listing.desc.slice(0, 180)}…
        </p>

        <div
          className="pdf-preview-agent"
          style={{ borderTopColor: `${accentColor}30` }}
        >
          <div
            className="pdf-preview-agent-avatar"
            style={{ background: accentColor, color: isLuxury ? "var(--ink)" : "white" }}
          >
            {listing.agent.initials}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{listing.agent.name}</div>
            <div style={{ fontSize: 11, opacity: 0.5 }}>{listing.agent.title}</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 11, opacity: 0.5, textAlign: "right" }}>
            7fil.com.tr<br />+90 850 000 00 00
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PDFBrosurPage() {
  const [selectedListing, setSelectedListing] = useState<Listing>(LISTINGS[0]);
  const [template, setTemplate] = useState("minimal");
  const [lang, setLang] = useState("tr");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1800));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="partner">
      <div className="partner-inner">
        {/* Header */}
        <div className="partner-head">
          <div>
            <span className="eyebrow partner-eyebrow">İlan Yönetimi · PDF Broşür</span>
            <h1>
              Profesyonel <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Broşür.</em>
            </h1>
            <p style={{ margin: "10px 0 0", color: "rgba(255,253,248,0.6)", fontSize: 15 }}>
              Atlas AI açıklama yazar, SCRIBE SEO optimize eder. Tek tıkla 4 dilde.
            </p>
          </div>
        </div>

        <div className="pdf-layout">
          {/* Left — controls */}
          <div className="pdf-controls">
            {/* Listing picker */}
            <div className="pdf-section">
              <div className="pdf-section-label">İlan Seç</div>
              <div className="pdf-listing-list">
                {LISTINGS.slice(0, 5).map((l) => (
                  <button
                    key={l.id}
                    className={`pdf-listing-item ${selectedListing.id === l.id ? "is-selected" : ""}`}
                    onClick={() => { setSelectedListing(l); setGenerated(false); }}
                  >
                    <div className="pdf-listing-thumb">
                      <Photo scene={l.scene} palette={l.palette} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--paper)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {l.title}
                      </div>
                      <div style={{ fontSize: 11, color: "rgba(255,253,248,0.4)" }}>{fmtTRY(l.price)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template */}
            <div className="pdf-section">
              <div className="pdf-section-label">Şablon</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    className={`pdf-template-btn ${template === t.id ? "is-selected" : ""}`}
                    onClick={() => setTemplate(t.id)}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--paper)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,253,248,0.4)" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="pdf-section">
              <div className="pdf-section-label">Dil</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {LANGS.map((l) => (
                  <button
                    key={l.id}
                    className={`pdf-lang-btn ${lang === l.id ? "is-selected" : ""}`}
                    onClick={() => setLang(l.id)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Atlas AI options */}
            <div className="pdf-section">
              <div className="pdf-section-label">Atlas AI Seçenekleri</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  "Açıklamayı AI ile yeniden yaz",
                  "SEO başlık ekle",
                  "QR kod ekle (WhatsApp)",
                  "FILTERRA.AI değerleme notu",
                ].map((opt) => (
                  <label key={opt} className="pdf-checkbox">
                    <input type="checkbox" defaultChecked={opt.includes("AI ile")} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              className="btn btn-atlas"
              style={{ width: "100%", height: 48, fontSize: 15 }}
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>Oluşturuluyor…</>
              ) : (
                <><IconSparkle size={15} /> Atlas AI ile Broşür Oluştur</>
              )}
            </button>

            {generated && (
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1, height: 40 }}>
                  <IconDocument size={14} /> PDF İndir
                </button>
                <button className="btn btn-outline" style={{ flex: 1, height: 40, color: "var(--paper)", borderColor: "rgba(255,253,248,0.18)" }}>
                  Paylaş
                </button>
              </div>
            )}
          </div>

          {/* Right — preview */}
          <div className="pdf-preview-wrap">
            <div className="pdf-preview-label">
              <IconEye size={13} /> Önizleme — A4
            </div>
            <BrochurePreview listing={selectedListing} template={template} lang={lang} />
            <div style={{ marginTop: 12, fontSize: 11, color: "rgba(255,253,248,0.3)", textAlign: "center" }}>
              Gerçek PDF Puppeteer ile sunucu tarafında üretilir
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
