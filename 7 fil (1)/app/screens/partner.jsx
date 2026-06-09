/* global React, LISTINGS */
const { useState } = React;

const PartnerScreen = () => {
  // 5 partner listings — sourced from LISTINGS, but with management state added.
  const items = LISTINGS.slice(0, 5).map((l, i) => ({
    ...l,
    status: ['featured', 'active', 'active', 'expiring', 'paused'][i],
    views: [1247, 842, 318, 2104, 56][i],
    chats: [34, 21, 7, 88, 1][i],
    favs: [12, 4, 1, 47, 0][i],
    daysLeft: [21, 18, 12, 2, 0][i],
    mls: [true, false, true, true, false][i],
  }));

  return (
    <div className="partner">
      <div className="partner-inner">
        {/* Header */}
        <div className="partner-head">
          <div>
            <span className="eyebrow partner-eyebrow">Connective Partner · Sezon 2026</span>
            <h1>Merhaba <em style={{color:'var(--gold)', fontStyle:'italic'}}>Zeynep.</em></h1>
            <p style={{margin:'10px 0 0', color:'rgba(255,253,248,0.6)', fontSize:15}}>
              Bu ay 312 yeni görüntülenme, 8 sıcak teklif. Atlas AI bu hafta 3 ilanın için optimizasyon önerdi.
            </p>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-outline" style={{color:'var(--paper)', borderColor:'rgba(255,253,248,0.18)'}}>
              <window.IconDocument size={16}/> Aylık Rapor
            </button>
            <button className="btn btn-primary">+ Yeni İlan</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="partner-metrics">
          <Metric label="Aktif İlan" value="12" trend="+ 2 bu hafta" trendUp/>
          <Metric label="Toplam Görüntülenme" value="4.617" trend="+ 312 bu ay" trendUp/>
          <Metric label="WhatsApp Talebi" value="151" trend="+ 22 bu ay" trendUp/>
          <Metric label="Sıcak Teklif" value="8" trend="3 bekliyor"/>
        </div>

        {/* Listing management */}
        <div className="partner-section-head">
          <h2>İlanlarım</h2>
          <div style={{display:'flex', gap:8}}>
            <button className="btn btn-outline btn-sm" style={{color:'var(--paper)', borderColor:'rgba(255,253,248,0.18)'}}>
              <window.IconFilter size={14}/> Filtrele
            </button>
            <select style={{height:32, background:'var(--ink-2)', color:'var(--paper)', border:'1px solid rgba(255,253,248,0.18)', borderRadius:8, padding:'0 28px 0 12px', fontSize:13}}>
              <option>Tümü · 12</option>
              <option>Aktif · 8</option>
              <option>Süresi yakın · 2</option>
            </select>
          </div>
        </div>

        <div>
          {items.map(it => <PartnerCard key={it.id} l={it}/>)}
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, trend, trendUp }) => (
  <div className="pmcard">
    <div className="pmcard-label">{label}</div>
    <div className="pmcard-value">{value}</div>
    <div className={`pmcard-trend ${trendUp ? 'up' : ''}`}>{trendUp && '↑ '}{trend}</div>
  </div>
);

const STATUS_MAP = {
  active:    { label: 'Aktif',          pill: 'success' },
  featured:  { label: 'Öne Çıkarılmış', pill: 'gold' },
  paused:    { label: 'Pasif',          pill: 'mute' },
  expiring:  { label: 'Süresi Doluyor', pill: 'danger' },
  expired:   { label: 'Süresi Doldu',   pill: 'danger' },
};

const PartnerCard = ({ l }) => {
  const [mls, setMls] = useState(l.mls);
  const [menuOpen, setMenuOpen] = useState(false);
  const s = STATUS_MAP[l.status];
  const isRent = l.kind === 'kiralik';
  const lowDays = l.daysLeft <= 3;

  return (
    <div className="plisting">
      <div className="plisting-photo">
        <window.Photo scene={l.scene} palette={l.palette}/>
        <span className={`pill pill-${s.pill}`}>
          {l.status === 'featured' && <window.IconStar size={10}/>} {s.label}
        </span>
      </div>

      <div className="plisting-body">
        <div className="plisting-meta-row">
          <span className={`plisting-kind ${isRent ? 'is-rent' : 'is-sale'}`}>{isRent ? 'Kiralık' : 'Satılık'}</span>
          <span className="plisting-price">{window.fmtTRY(l.price)}{isRent ? ' /ay' : ''}</span>
        </div>
        <div className="plisting-title">{l.title}</div>
        <div className="plisting-loc"><window.IconMapPin/> {l.city}</div>

        <div className="plisting-metrics">
          <span className="plisting-metric"><window.IconEye/> <strong>{l.views.toLocaleString('tr-TR')}</strong> görüntülenme</span>
          <span className="plisting-metric"><window.IconChat/> <strong>{l.chats}</strong> talep</span>
          <span className="plisting-metric"><window.IconBookmark/> <strong>{l.favs}</strong> favori</span>
        </div>

        <div className="plisting-bottom">
          <div className="plisting-bottom-progress">
            <div className="plisting-progress">
              <div
                className={`plisting-progress-fill ${lowDays ? 'is-danger' : ''}`}
                style={{width: `${Math.min(100, (l.daysLeft / 30) * 100)}%`}}
              />
            </div>
            <span className={`plisting-days ${lowDays ? 'is-danger' : ''}`}>
              {l.status === 'paused' ? 'Pasif' : `${l.daysLeft} gün`}
            </span>
          </div>
          <button className="btn btn-atlas btn-sm">
            <window.IconSparkle size={12}/> Atlas AI ile Optimize
          </button>
        </div>
      </div>

      <div className="plisting-side">
        <div className="plisting-mls">
          <span className="plisting-mls-label">MLS</span>
          {mls && <span className="plisting-mls-share">50 / 50</span>}
          <button
            className="toggle"
            aria-checked={mls}
            onClick={() => setMls(!mls)}
            aria-label="MLS Komisyon Paylaşımı"
          />
        </div>
        <div className="kebab-wrap">
          <button className="kebab" onClick={() => setMenuOpen(!menuOpen)} aria-label="Aksiyon menüsü">
            <window.IconKebab/>
          </button>
          {menuOpen && (
            <>
              <div
                style={{position:'fixed', inset:0, zIndex:10}}
                onClick={() => setMenuOpen(false)}
              />
              <div className="kebab-menu">
                <button><window.IconEdit/> Düzenle</button>
                <button><window.IconDocument/> PDF Broşür Oluştur</button>
                <button><window.IconChart/> Detaylı İstatistikler</button>
                <div className="kebab-menu-sep"/>
                <button><window.IconPause/> Pasifleştir</button>
                <button className="danger"><window.IconTrash/> Sil</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

window.PartnerScreen = PartnerScreen;
