/* global React, LISTINGS */
const { useState } = React;

const FILTER_SECTIONS = [
  { label: 'İlan Tipi',   keys: ['Satılık', 'Kiralık'] },
  { label: 'Mülk Tipi',   keys: ['Konut', 'Villa', 'Ticari', 'Arsa', 'Endüstriyel'] },
  { label: 'Oda Sayısı',  keys: ['1+0', '1+1', '2+1', '3+1', '4+1', '5+'] },
  { label: 'Özellikler',  keys: ['Asansör', 'Otopark', 'Balkon', 'Havuz', 'Bahçe', 'Manzara'] },
];

const ListingsScreen = ({ onOpenListing }) => {
  const [chips, setChips] = useState({ 'Satılık': true, 'Konut': true });
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('Önerilen');
  const toggleChip = (k) => setChips(s => ({ ...s, [k]: !s[k] }));

  return (
    <div className="listings-shell">
      {/* ── Filters ─────────────────────────────────────────── */}
      <aside className="filters">
        <h3>Filtreler</h3>
        <div style={{fontSize:13, color:'var(--muted)'}}>İstanbul · 1.284 ilan</div>

        {FILTER_SECTIONS.map(s => (
          <div key={s.label} className="filter-section">
            <div className="filter-label">{s.label}</div>
            <div className="filter-chips">
              {s.keys.map(k => (
                <button
                  key={k}
                  className="fchip"
                  aria-pressed={!!chips[k]}
                  onClick={() => toggleChip(k)}
                >{k}</button>
              ))}
            </div>
          </div>
        ))}

        <div className="filter-section">
          <div className="filter-label">Fiyat (₺)</div>
          <div className="filter-range">
            <input defaultValue="500.000"/>
            <span className="filter-range-sep">—</span>
            <input defaultValue="15.000.000"/>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">m² Aralığı</div>
          <div className="filter-range">
            <input defaultValue="80"/>
            <span className="filter-range-sep">—</span>
            <input defaultValue="500"/>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-label">Atlas AI Filtresi</div>
          <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:4}}>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
              <input type="checkbox" defaultChecked/> Piyasa değerinin altında
            </label>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
              <input type="checkbox"/> Avukat onaylı
            </label>
            <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,cursor:'pointer'}}>
              <input type="checkbox"/> Depozito Güvence kapsamında
            </label>
          </div>
        </div>

        <button className="btn btn-secondary" style={{width:'100%', marginTop:24}}>Filtreleri Uygula</button>
        <button className="btn btn-ghost btn-sm" style={{width:'100%', marginTop:6}}>Temizle</button>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="listings-main">
        <div className="listings-toolbar">
          <div className="listings-count">
            <strong>1.284</strong> <span style={{color:'var(--muted)'}}>ilan · İstanbul, Türkiye</span>
          </div>
          <div className="listings-toolbar-spacer"/>
          <span style={{fontSize:13, color:'var(--muted)'}}>Sırala</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option>Önerilen</option>
            <option>En yeni</option>
            <option>Fiyat — artan</option>
            <option>Fiyat — azalan</option>
            <option>m² — artan</option>
            <option>Atlas AI skoru</option>
          </select>
          <div className="viewtoggle">
            <button aria-pressed={view==='grid'} onClick={() => setView('grid')}>
              <window.IconGrid/> Liste
            </button>
            <button aria-pressed={view==='map'} onClick={() => setView('map')}>
              <window.IconMap/> Harita
            </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="cards-grid">
            {LISTINGS.map(l => <window.ListingCard key={l.id} l={l} onOpen={onOpenListing}/>)}
          </div>
        ) : (
          <MapView/>
        )}
      </main>
    </div>
  );
};

/* Editorial map placeholder — tonal, not garish. */
const MapView = () => {
  const pins = [
    {top:'24%', left:'30%', label:'Beşiktaş', price:'₺8,5M'},
    {top:'38%', left:'52%', label:'Kadıköy', price:'₺4,2M'},
    {top:'18%', left:'62%', label:'Sarıyer', price:'₺12M'},
    {top:'58%', left:'40%', label:'Kartal', price:'₺2,0M'},
    {top:'72%', left:'66%', label:'Pendik', price:'₺1,8M'},
    {top:'46%', left:'24%', label:'Bakırköy', price:'₺6,2M'},
  ];

  return (
    <div style={{
      position:'relative',
      background:'var(--paper)',
      border:'1px solid var(--line)',
      borderRadius:16,
      height:640,
      overflow:'hidden',
    }}>
      {/* abstract Bosphorus-like map */}
      <svg width="100%" height="100%" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0v48" fill="none" stroke="rgba(124,116,99,0.08)"/>
          </pattern>
        </defs>
        <rect width="1200" height="640" fill="var(--cream-2)"/>
        <rect width="1200" height="640" fill="url(#grid)"/>
        {/* water — Bosphorus */}
        <path d="M520 0 C 500 120, 600 220, 540 320 C 480 420, 600 520, 560 640 L 700 640 C 720 520, 660 420, 720 320 C 780 220, 700 120, 740 0 z"
              fill="#cfd8d6" opacity="0.95"/>
        {/* land tones */}
        <path d="M0 0 L 520 0 C 500 120, 600 220, 540 320 C 480 420, 600 520, 560 640 L 0 640 z" fill="rgba(192,176,152,0.18)"/>
        <path d="M740 0 L 1200 0 L 1200 640 L 560 640 C 600 520, 480 420, 540 320 C 600 220, 500 120, 740 0 z" fill="rgba(192,176,152,0.12)"/>
        {/* roads */}
        <path d="M0 220 C 200 220, 320 260, 400 200 C 500 140, 520 200, 520 300" stroke="rgba(124,116,99,0.25)" fill="none" strokeWidth="2"/>
        <path d="M740 320 C 820 320, 900 260, 1000 280 C 1100 300, 1200 220, 1200 220" stroke="rgba(124,116,99,0.25)" fill="none" strokeWidth="2"/>
      </svg>

      {/* pins */}
      {pins.map(p => (
        <div key={p.label} style={{
          position:'absolute', top:p.top, left:p.left,
          transform:'translate(-50%, -100%)',
          display:'flex', flexDirection:'column', alignItems:'center', cursor:'pointer',
        }}>
          <div style={{
            background:'var(--ink)', color:'var(--paper)',
            padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:600,
            whiteSpace:'nowrap', boxShadow:'0 4px 14px rgba(20,20,42,0.25)'
          }}>
            <span style={{color:'var(--gold)'}}>{p.price}</span> · {p.label}
          </div>
          <svg width="14" height="8" viewBox="0 0 14 8"><path d="M0 0 L 14 0 L 7 8 z" fill="var(--ink)"/></svg>
        </div>
      ))}

      {/* layers panel */}
      <div style={{
        position:'absolute', top:16, right:16,
        background:'var(--paper)', border:'1px solid var(--line)',
        borderRadius:12, padding:12, width:220, boxShadow:'var(--shadow-2)'
      }}>
        <div className="filter-label" style={{marginBottom:8}}>Harita Katmanları</div>
        {[
          {label:'Fiyat ısı haritası', on:true},
          {label:'Ulaşım & metro', on:true},
          {label:'Okul puanları', on:false},
          {label:'Gürültü', on:false},
          {label:'Su baskını riski', on:false},
        ].map(it => (
          <label key={it.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',fontSize:13,cursor:'pointer'}}>
            {it.label}
            <span style={{
              width:30,height:18,borderRadius:10,
              background:it.on?'var(--teal)':'var(--line-strong)',
              position:'relative',transition:'background .2s'
            }}>
              <span style={{
                position:'absolute',top:2,left:it.on?14:2,width:14,height:14,
                background:'#fff',borderRadius:'50%',transition:'left .2s'
              }}/>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

window.ListingsScreen = ListingsScreen;
