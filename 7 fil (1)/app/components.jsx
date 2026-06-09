/* global React, STEPS */
/* 7fil — shared components: ritual strip, listing card, agent card, pills. */

const { useState } = React;

/* ── 7-step ritual (horizontal, hero-grade) ──────────────────────── */

const RitualStrip = ({ activeStep = 1, onStep }) => {
  return (
    <div className="ritual">
      <div className="ritual-eyebrow">
        <span className="eyebrow eyebrow-gold">7 Fil Ritüeli</span>
        <span style={{color:'var(--muted)', fontSize:13}}>· ev sahibi olmanın yedi adımı</span>
      </div>
      <div className="ritual-steps">
        {STEPS.map(s => {
          const state = s.num < activeStep ? 'done' : s.num === activeStep ? 'active' : 'future';
          const IconComp = window[s.icon] || window.IconCompass;
          return (
            <button
              key={s.num}
              className="ritual-step"
              data-state={state}
              onClick={() => onStep && onStep(s.num)}
              style={{background:'transparent', border:0, padding:0, cursor:'pointer'}}
            >
              <div className="ritual-step-icon">
                <IconComp/>
              </div>
              <div className="ritual-step-num">{String(s.num).padStart(2,'0')}</div>
              <div className="ritual-step-label">{s.label}</div>
            </button>
          );
        })}
      </div>
      <div className="ritual-footer">
        <div className="ritual-footer-now">
          <span className="eyebrow" style={{color:'var(--muted)'}}>Şu an</span>
          <span className="ritual-footer-step">
            Adım {String(activeStep).padStart(2,'0')} · {STEPS[activeStep-1].labelFull}
          </span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center',fontSize:13,color:'var(--muted)'}}>
          <span>Her adım Atlas AI ve avukat ağı tarafından yönlendirilir.</span>
        </div>
      </div>
    </div>
  );
};

/* Vertical ritual for sidebar */
const RitualVertical = ({ activeStep = 1 }) => (
  <div className="ritual-vert">
    {STEPS.map(s => {
      const state = s.num < activeStep ? 'done' : s.num === activeStep ? 'active' : 'future';
      const IconComp = window[s.icon] || window.IconCompass;
      return (
        <div key={s.num} className="ritual-vert-item" data-state={state}>
          <div className="ritual-vert-icon"><IconComp size={18}/></div>
          <div><span className="ritual-vert-num">{String(s.num).padStart(2,'0')}</span> <span className="ritual-vert-label">{s.labelFull}</span></div>
        </div>
      );
    })}
  </div>
);

/* ── Listing card ────────────────────────────────────────────────── */

const Pill = ({ kind = 'gold', children }) => (
  <span className={`pill pill-${kind}`}>{children}</span>
);

const ListingCard = ({ l, onOpen }) => {
  const [fav, setFav] = useState(false);
  const isRent = l.kind === 'kiralik';
  return (
    <article className="lcard" onClick={() => onOpen && onOpen(l)}>
      <div className="lcard-photo">
        <window.Photo scene={l.scene} palette={l.palette}/>
        <div className="lcard-photo-top">
          <Pill kind={isRent ? 'teal' : 'gold'}>{isRent ? 'Kiralık' : 'Satılık'}</Pill>
          <button
            className="lcard-heart"
            data-on={fav}
            onClick={(e) => { e.stopPropagation(); setFav(!fav); }}
            aria-label="Favori"
          >
            {fav ? <window.IconHeart size={18}/> : <window.IconHeartLine size={18}/>}
          </button>
        </div>
        <div className="lcard-atlas">
          <span className="lcard-atlas-spark"><window.IconSparkle/></span>
          Atlas AI Değerleme
        </div>
      </div>

      <div className="lcard-body">
        <div className="lcard-price">
          {window.fmtTRY(l.price)}
          {isRent && <span className="lcard-price-sub"> /ay</span>}
        </div>
        <div className="lcard-title">{l.title}</div>
        <div className="lcard-loc"><window.IconMapPin/> {l.city}</div>

        <div className="lcard-meta">
          <span className="lcard-meta-item"><window.IconArea/>{l.area} m²</span>
          <span className="lcard-meta-item"><window.IconBed/>{l.rooms}</span>
          <span className="lcard-meta-item"><window.IconBuilding/>{l.floor === '—' ? 'Müstakil' : l.floor + '. kat'}</span>
        </div>

        {isRent && (
          <>
            <span className="guvence-badge">
              <window.IconShield/> 7fil Güvence
              <span className="guvence-tooltip">
                Bu ilan 7fil Depozito Güvence sistemi kapsamındadır. Depozitonuz avukat onaylı escrow hesabında tutulur.
              </span>
            </span>
            {l.daysAvg && (
              <div className="market-rate">
                <window.IconClock/> Bu bölgede ilanlar ortalama {l.daysAvg} günde kiranıyor.
              </div>
            )}
          </>
        )}
      </div>

      <div className="lcard-agent">
        <div className="lcard-agent-avatar">{l.agent.initials}</div>
        <div className="col" style={{gap:0}}>
          <span className="lcard-agent-name">{l.agent.name}</span>
          <span className="lcard-agent-sub">{l.agent.title}</span>
        </div>
        <div className="lcard-agent-meta" style={{fontSize:12,color:'var(--muted)',display:'inline-flex',alignItems:'center',gap:3}}>
          <window.IconStar size={12}/> {l.agent.rating.toFixed(1)}
        </div>
      </div>
    </article>
  );
};

Object.assign(window, { RitualStrip, RitualVertical, Pill, ListingCard });
