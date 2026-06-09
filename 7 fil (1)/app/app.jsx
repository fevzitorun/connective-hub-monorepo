/* global React, ReactDOM */
const { useState, useEffect } = React;

/* ── Persisted defaults (Tweaks rewrites this on disk) ─────── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette":       "ritual",
  "typePairing":   "playfair-dm",
  "motifLevel":    0.18,
  "showRitual":    true,
  "language":      "tr"
}/*EDITMODE-END*/;

/* ── Type pairings ─────────────────────────────────────────── */
const TYPE_PAIRINGS = {
  'playfair-dm': {
    label: 'Playfair Display · DM Sans',
    display: '"Playfair Display", Georgia, serif',
    body:    '"DM Sans", "Inter", system-ui, sans-serif',
    fonts: [
      'family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500',
      'family=DM+Sans:wght@400;500;600;700',
    ],
  },
  'cormorant-inter': {
    label: 'Cormorant Garamond · Inter Tight',
    display: '"Cormorant Garamond", Georgia, serif',
    body:    '"Inter Tight", "Inter", system-ui, sans-serif',
    fonts: [
      'family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500',
      'family=Inter+Tight:wght@400;500;600;700',
    ],
  },
  'fraunces-mono': {
    label: 'Fraunces · IBM Plex Sans',
    display: '"Fraunces", Georgia, serif',
    body:    '"IBM Plex Sans", system-ui, sans-serif',
    fonts: [
      'family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400',
      'family=IBM+Plex+Sans:wght@400;500;600;700',
    ],
  },
};

const PALETTES = ['ritual', 'ocak', 'gece'];
const PALETTE_LABEL = {
  ritual: 'Ritüel — ink, antik altın, derin teal',
  ocak:   'Ocak — sıcak, kahve tonlu',
  gece:   'Gece — yüksek kontrast, ışıltılı altın',
};

/* ── Top bar nav ───────────────────────────────────────────── */

const TABS = [
  { id: 'home',     label: 'Anasayfa' },
  { id: 'listings', label: 'İlanlar' },
  { id: 'detail',   label: 'İlan Detayı' },
  { id: 'partner',  label: 'Partner Panel' },
  { id: 'atlas',    label: 'Atlas AI' },
];

const App = () => {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, () => {}];

  const [screen, setScreen] = useState('home');
  const [detailId, setDetailId] = useState('l1');

  // Apply type pairing dynamically
  useEffect(() => {
    const pair = TYPE_PAIRINGS[tweaks.typePairing] || TYPE_PAIRINGS['playfair-dm'];
    const root = document.documentElement;
    root.style.setProperty('--font-display', pair.display);
    root.style.setProperty('--font-body', pair.body);
    // load Google fonts
    const id = 'tweakable-fonts';
    let link = document.getElementById(id);
    const href = 'https://fonts.googleapis.com/css2?' + pair.fonts.map(f => f).join('&') + '&display=swap';
    if (!link) {
      link = document.createElement('link');
      link.id = id; link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }, [tweaks.typePairing]);

  // Apply motif level
  useEffect(() => {
    document.documentElement.style.setProperty('--motif', String(tweaks.motifLevel));
  }, [tweaks.motifLevel]);

  // Apply palette
  useEffect(() => {
    document.documentElement.setAttribute('data-palette', tweaks.palette);
  }, [tweaks.palette]);

  const openListing = (l) => { setDetailId(l.id); setScreen('detail'); };
  const back = () => setScreen('listings');

  return (
    <div className="app">
      {/* App bar */}
      <header className="appbar">
        <div className="appbar-inner">
          <div className="brand" onClick={() => setScreen('home')}>
            <window.BrandMark size={36}/>
            <span className="brand-name">7<em>fil</em></span>
          </div>
          <nav className="appnav">
            {TABS.map(t => (
              <button
                key={t.id}
                aria-current={screen === t.id || (screen === 'detail' && t.id === 'detail')}
                onClick={() => {
                  if (t.id === 'detail') { setScreen('detail'); }
                  else setScreen(t.id);
                }}
              >{t.label}</button>
            ))}
          </nav>
          <select
            className="appnav-mobile"
            value={screen === 'detail' ? 'detail' : screen}
            onChange={(e) => setScreen(e.target.value)}
          >
            {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
          <div className="appbar-spacer"/>
          <div className="appbar-actions">
            <button className="btn btn-ghost btn-sm">Giriş Yap</button>
            <button className="btn btn-primary btn-sm">Ücretsiz Dene</button>
          </div>
        </div>
      </header>

      {/* Screens */}
      <main style={{flex:1, minHeight:0}}>
        {screen === 'home'     && <window.HomeScreen   onOpenListing={openListing} onGo={setScreen}/>}
        {screen === 'listings' && <window.ListingsScreen onOpenListing={openListing}/>}
        {screen === 'detail'   && <window.DetailScreen listingId={detailId} onBack={back} onOpenListing={openListing}/>}
        {screen === 'partner'  && <window.PartnerScreen/>}
        {screen === 'atlas'    && <window.AtlasScreen onOpenListing={openListing}/>}
      </main>

      {/* Footer */}
      {screen !== 'atlas' && (
        <footer style={{background:'var(--ink)', color:'rgba(255,253,248,0.6)', padding:'56px 28px 40px'}}>
          <div style={{maxWidth:1320, margin:'0 auto'}}>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:32, alignItems:'start'}}>
              <div>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <window.BrandMark size={36}/>
                  <span style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:500, color:'var(--paper)'}}>
                    7<em style={{color:'var(--gold)', fontStyle:'italic'}}>fil</em>
                  </span>
                </div>
                <p style={{marginTop:14, maxWidth:'42ch', fontSize:14, lineHeight:1.6}}>
                  Türkiye’nin ilk entegre gayrimenkul ekosistemi. Connective Hub Dijital Teknolojiler Ltd. Şti.
                  bünyesinde, FILTERRA.AI ve Atlas AI tarafından desteklenir.
                </p>
              </div>
              <FooterCol title="Platform" items={['Satılık','Kiralık','Müzayede','Atlas AI','Piyasa Raporu']}/>
              <FooterCol title="Kurumsal" items={['Hakkımızda','Hukuki','KVKK','Basın','İletişim']}/>
              <FooterCol title="Partnerler" items={['Avukat ağı','Banka ağı','Ajans paneli','MLS','Beyaz etiket']}/>
            </div>
            <hr style={{margin:'40px 0 18px', border:0, borderTop:'1px solid rgba(255,253,248,0.08)'}}/>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,253,248,0.4)', letterSpacing:'.02em'}}>
              <span>© 2026 Connective Hub Dijital Teknolojiler Ltd. Şti.</span>
              <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
                <window.IconSparkle size={12} style={{color:'var(--gold)'}}/> Powered by FILTERRA.AI
              </span>
            </div>
          </div>
        </footer>
      )}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection title="Renk paleti">
            <PaletteSwatches value={tweaks.palette} onChange={(v) => setTweak('palette', v)}/>
          </window.TweakSection>
          <window.TweakSection title="Tipografi">
            <window.TweakRadio
              value={tweaks.typePairing}
              onChange={(v) => setTweak('typePairing', v)}
              options={Object.keys(TYPE_PAIRINGS).map(k => ({ value: k, label: TYPE_PAIRINGS[k].label }))}
            />
          </window.TweakSection>
          <window.TweakSection title="Fil motifi">
            <window.TweakSlider
              label="Süsleme yoğunluğu"
              value={tweaks.motifLevel}
              min={0} max={0.9} step={0.02}
              onChange={(v) => setTweak('motifLevel', v)}
              format={(v) => `${Math.round(v*100)} %`}
            />
            <div style={{fontSize:11, color:'var(--muted)', marginTop:6, lineHeight:1.45}}>
              Hero ve Atlas raporundaki fil watermark’ının görünürlüğünü kontrol eder.
            </div>
          </window.TweakSection>
          <window.TweakSection title="Hızlı geçiş">
            <window.TweakRadio
              value={screen === 'detail' ? 'detail' : screen}
              onChange={setScreen}
              options={TABS.map(t => ({ value: t.id, label: t.label }))}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
};

const FooterCol = ({ title, items }) => (
  <div>
    <div style={{fontSize:11, textTransform:'uppercase', letterSpacing:'.16em', color:'rgba(255,253,248,0.5)', fontWeight:600, marginBottom:12}}>
      {title}
    </div>
    <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8}}>
      {items.map(i => (
        <li key={i} style={{fontSize:14}}>
          <a style={{color:'rgba(255,253,248,0.7)'}} href="#">{i}</a>
        </li>
      ))}
    </ul>
  </div>
);

const PaletteSwatches = ({ value, onChange }) => (
  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
    {PALETTES.map(p => {
      const swatches = {
        ritual: ['#14142a', '#c9a84c', '#2d6a6a', '#f8f4ee'],
        ocak:   ['#1f1c2c', '#b8954a', '#3a5e5e', '#f3ece0'],
        gece:   ['#0c0c1a', '#d9b85a', '#2b8585', '#f5f1e8'],
      }[p];
      const active = value === p;
      return (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            border: active ? '2px solid var(--c-teal-deep, #234f4f)' : '1px solid var(--c-line, #e3ddcd)',
            borderRadius: 8,
            padding: 8,
            background: '#fff',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{display:'flex', gap:2, marginBottom:6}}>
            {swatches.map((c, i) => (
              <div key={i} style={{flex:1, height:24, background:c, borderRadius:i===0?'4px 0 0 4px':i===3?'0 4px 4px 0':0}}/>
            ))}
          </div>
          <div style={{fontSize:11, color:'#14142a', fontWeight:600, textTransform:'capitalize'}}>
            {p}
          </div>
          <div style={{fontSize:10, color:'#7a7569', marginTop:2, lineHeight:1.3}}>
            {PALETTE_LABEL[p].split('—')[1]}
          </div>
        </button>
      );
    })}
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
