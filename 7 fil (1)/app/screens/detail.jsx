/* global React, LISTINGS */
const { useState } = React;

const DetailScreen = ({ listingId, onBack, onOpenListing }) => {
  const l = LISTINGS.find(x => x.id === listingId) || LISTINGS[0];
  const isRent = l.kind === 'kiralik';
  const related = LISTINGS.filter(x => x.id !== l.id && x.kind === l.kind).slice(0, 3);

  return (
    <div className="detail-wrap">
      <button className="detail-back" onClick={onBack}>
        <window.IconArrowLeft/> Tüm ilanlara dön
      </button>

      {/* Gallery */}
      <div className="detail-gallery">
        <window.Photo scene={l.scene} palette={l.palette} caption={`${l.district} · ${l.city.split(' · ')[1]||''}`}/>
        <window.Photo scene="apartment" palette="morn" caption="Salon"/>
        <window.Photo scene="historic" palette="warm" caption="Mutfak"/>
        <window.Photo scene="coast" palette={l.palette} caption="Manzara"/>
        <window.Photo scene="villa" palette="cool" caption="Banyo"/>
      </div>

      <div className="detail-cols">
        {/* ── Main column ─────────────────────────────────────── */}
        <div className="detail-main">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
            <window.Pill kind={isRent ? 'teal' : 'gold'}>{isRent ? 'Kiralık' : 'Satılık'}</window.Pill>
            <window.Pill kind="line">{l.rooms}</window.Pill>
            {isRent && <window.Pill kind="warn">7fil Güvence</window.Pill>}
            <span style={{fontSize:12, color:'var(--muted)', marginLeft:'auto'}}>İlan no · 7F-{l.id.toUpperCase()}-2026</span>
          </div>

          <h1>{l.title}</h1>
          <div className="detail-loc"><window.IconMapPin/> {l.district}, {l.city}</div>

          <div className="detail-stats">
            <div className="detail-stat">
              <div className="detail-stat-label">Metrekare</div>
              <div className="detail-stat-value">{l.area}<span style={{fontSize:14, color:'var(--muted)', marginLeft:4}}>m²</span></div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Oda Sayısı</div>
              <div className="detail-stat-value">{l.rooms}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">{l.floor === '—' ? 'Tip' : 'Kat'}</div>
              <div className="detail-stat-value">{l.floor === '—' ? 'Müstakil' : l.floor + '.'}</div>
            </div>
            <div className="detail-stat">
              <div className="detail-stat-label">Bina Yaşı</div>
              <div className="detail-stat-value">{l.age === 0 ? 'Yeni' : l.age}</div>
            </div>
          </div>

          <div className="detail-desc">
            <p>{l.desc}</p>
            <p>
              Senior danışmanımız {l.agent.name}, ilana özel teknik dosyayı hazırladı. Tapu, imar ve
              ipotek kontrolleri sertifikalı avukatımız tarafından incelendi; risk skoru ilan
              sayfasında görünür. Atlas AI mahalle raporu sağ panelde yer alıyor.
            </p>
          </div>

          {/* Features grid */}
          <div className="detail-features">
            <FeatRow label="Isıtma" value={l.heat || (isRent ? 'Klima + Kombi' : '—')}/>
            <FeatRow label="Aidat (₺/ay)" value={l.aidat ? l.aidat.toLocaleString('tr-TR') : '—'}/>
            <FeatRow label="Metroya uzaklık" value={l.metro ? l.metro + ' dk' : '—'}/>
            <FeatRow label="Yapı yaşı" value={l.age === 0 ? 'Yeni teslim' : l.age + ' yıl'}/>
            {isRent && <FeatRow label="Depozito" value={l.deposit + ' aylık kira'}/>}
            <FeatRow label="Özellikler" value={l.features.slice(0,3).join(' · ')}/>
            <FeatRow label="Atlas AI değerleme" value={l.aiValue ? window.fmtTRY(l.aiValue) : 'Hazırlanıyor'}/>
            <FeatRow label="Bölge değişimi" value={l.aiTrend}/>
          </div>

          {/* Atlas AI Mahalle Raporu */}
          <div className="atlas-report">
            <div className="atlas-report-watermark" aria-hidden="true">
              <window.BrandSilhouette color="rgba(201,168,76,0.6)"/>
            </div>
            <div className="atlas-report-head">
              <span className="atlas-report-chip"><window.IconSparkle/> Atlas AI</span>
              <span style={{fontSize:11, color:'rgba(255,253,248,0.55)', letterSpacing:'.16em', textTransform:'uppercase'}}>FILTERRA.AI Powered</span>
            </div>
            <h3>{l.district} Mahalle <em>Raporu</em></h3>
            <div className="atlas-report-grid">
              <div className="atlas-metric">
                <div className="atlas-metric-label">Ortalama m² Fiyatı</div>
                <div className="atlas-metric-value">₺142.500</div>
                <div className="atlas-metric-trend is-up">↑ %8,3 geçen aya göre</div>
              </div>
              <div className="atlas-metric">
                <div className="atlas-metric-label">Ortalama Satış Süresi</div>
                <div className="atlas-metric-value is-teal">47 gün</div>
                <div className="atlas-metric-trend is-down">↓ 5 gün iyileşme</div>
              </div>
              <div className="atlas-metric">
                <div className="atlas-metric-label">Aktif İlan</div>
                <div className="atlas-metric-value is-paper">2.847</div>
                <div className="atlas-metric-trend">Bu ay eklenen: 312</div>
              </div>
            </div>
            <p className="atlas-report-note">
              {l.aiNote || 'Bu mahallede son altı ayda %12 fiyat artışı kaydedildi. Aceleci olmaya gerek yok; benzer ilanlar ortalama 47 günde satışa kapanıyor. Komşu sokaklarda iki aktif teklif bulunuyor.'}
            </p>
          </div>

          {/* Similar listings */}
          <div style={{marginTop:64}}>
            <div className="section-head">
              <div>
                <span className="eyebrow eyebrow-gold">Benzer İlanlar</span>
                <h2 style={{fontSize:32, marginTop:6}}>Aynı bölgede, <em>benzer profilde.</em></h2>
              </div>
            </div>
            <div className="cards-grid">
              {related.map(r => <window.ListingCard key={r.id} l={r} onOpen={onOpenListing}/>)}
            </div>
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="detail-side">
          <div className="detail-side-card">
            <div className="detail-side-price">
              {window.fmtTRY(l.price)}
              {isRent && <span className="detail-side-price-sub"> /ay</span>}
            </div>
            <div className="detail-side-tax">
              {isRent
                ? `Depozito: ${l.deposit} aylık · Aidat dahil değil`
                : `Tapu masrafı yaklaşık ${window.fmtTRY(Math.round(l.price * 0.04))}`}
            </div>

            <div className="detail-agent">
              <div className="detail-agent-avatar">{l.agent.initials}</div>
              <div className="col" style={{gap:2}}>
                <span className="detail-agent-name">{l.agent.name}</span>
                <span className="detail-agent-title">{l.agent.title}</span>
                <span className="detail-agent-rating"><window.IconStar/> {l.agent.rating.toFixed(1)} · 142 referans</span>
              </div>
            </div>

            <div className="detail-actions">
              <button className="btn btn-primary btn-lg">Teklif Ver</button>
              <button className="btn btn-whatsapp">
                <window.IconWhatsapp size={18}/> WhatsApp ile Sor
              </button>
              <button className="btn btn-outline">
                <window.IconChat size={16}/> Atlas AI ile Tartış
              </button>
            </div>
          </div>

          {/* Ritual progress sidebar */}
          <div className="detail-side-card">
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18}}>
              <span className="eyebrow eyebrow-gold">7 Fil Ritüeli</span>
              <span style={{fontSize:11, color:'var(--muted)'}}>2 / 7</span>
            </div>
            <window.RitualVertical activeStep={2}/>
            <hr className="rule" style={{margin:'18px 0 14px'}}/>
            <div style={{fontSize:13, color:'var(--muted)', lineHeight:1.55}}>
              Bir sonraki adım: hukuki doğrulama. Sertifikalı avukatımız tapu ve imar dosyasını
              48 saat içinde inceleyecek.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const FeatRow = ({ label, value }) => (
  <div className="detail-feat-row">
    <span className="detail-feat-label">{label}</span>
    <span className="detail-feat-value">{value}</span>
  </div>
);

window.DetailScreen = DetailScreen;
