/* global React */

/* ─── COLOR ARTBOARD ─────────────────────────────────────────── */

const COLORS = [
  { num:'01', name:'Ink',    role:'Birincil — gece mavisi',
    hex:'#14142A', rgb:'20, 20, 42',  cmyk:'90 / 88 / 50 / 65', pantone:'2767 C',
    bg:'#14142A', fg:'#fffdf8' },
  { num:'02', name:'Gold',   role:'Birincil aksan — antik altın',
    hex:'#C9A84C', rgb:'201, 168, 76', cmyk:'18 / 30 / 80 / 6',  pantone:'7563 C',
    bg:'#C9A84C', fg:'#14142A' },
  { num:'03', name:'Teal',   role:'Sekonder — denge ve teknoloji',
    hex:'#2D6A6A', rgb:'45, 106, 106', cmyk:'82 / 40 / 50 / 28', pantone:'5483 C',
    bg:'#2D6A6A', fg:'#fffdf8' },
  { num:'04', name:'Cream',  role:'Zemin — sıcak kağıt',
    hex:'#F8F4EE', rgb:'248, 244, 238', cmyk:'2 / 3 / 6 / 0',     pantone:'7527 C',
    bg:'#F8F4EE', fg:'#14142A' },
  { num:'05', name:'Gold Deep', role:'Aksan — derin altın',
    hex:'#A8893A', rgb:'168, 137, 58', cmyk:'25 / 40 / 90 / 18', pantone:'7565 C',
    bg:'#A8893A', fg:'#fffdf8' },
  { num:'06', name:'Teal Deep', role:'Aksan — derin teal',
    hex:'#234F4F', rgb:'35, 79, 79',   cmyk:'85 / 50 / 60 / 45', pantone:'5535 C',
    bg:'#234F4F', fg:'#fffdf8' },
  { num:'07', name:'Paper',   role:'Beyaz, hafif sıcak',
    hex:'#FFFDF8', rgb:'255, 253, 248', cmyk:'0 / 0 / 2 / 0',     pantone:'White',
    bg:'#FFFDF8', fg:'#14142A' },
  { num:'08', name:'Muted',   role:'Yardımcı metin',
    hex:'#7A7569', rgb:'122, 117, 105', cmyk:'45 / 40 / 50 / 30', pantone:'7536 C',
    bg:'#7A7569', fg:'#fffdf8' },
];

const ColorsArtboard = () => (
  <div className="surface-paper" style={{padding:'72px 72px'}}>
    <div className="page-section-head">
      <div>
        <span className="eyebrow eyebrow-gold">Renk · 03</span>
        <h2 className="display" style={{fontSize:64, marginTop:14}}>
          Dört ana renk, <em>kontrollü kullanım.</em>
        </h2>
        <p style={{fontSize:15, color:'var(--muted)', maxWidth:'56ch', marginTop:14, lineHeight:1.55}}>
          <strong style={{color:'var(--ink)'}}>Ink</strong>, otoritenin sesi.
          <strong style={{color:'var(--gold-deep)'}}> Gold</strong>, bereketin işareti.
          <strong style={{color:'var(--teal)'}}> Teal</strong>, dengenin tonu.
          <strong style={{color:'var(--ink)'}}> Cream</strong>, evin sıcaklığı. Saf beyaz
          nadiren kullanılır; varsayılan zemin daima kağıt-kremidir.
        </p>
      </div>
      <div style={{display:'flex', gap:24, alignItems:'flex-end'}}>
        <Ratio label="Ink"    pct={50} color="#14142A"/>
        <Ratio label="Cream"  pct={30} color="#F8F4EE" ring/>
        <Ratio label="Gold"   pct={15} color="#C9A84C"/>
        <Ratio label="Teal"   pct={5}  color="#2D6A6A"/>
      </div>
    </div>

    {/* Big swatches */}
    <div style={{marginTop:24, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
      {COLORS.slice(0,4).map(c => <Swatch key={c.num} c={c}/>)}
    </div>

    {/* Supporting swatches */}
    <div style={{marginTop:24, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
      {COLORS.slice(4).map(c => <Swatch key={c.num} c={c} compact/>)}
    </div>

    {/* Signal colours */}
    <div style={{marginTop:48, paddingTop:32, borderTop:'1px solid var(--line)'}}>
      <span className="eyebrow">Semantik renkler</span>
      <p style={{fontSize:13, color:'var(--muted)', maxWidth:'52ch', marginTop:8, marginBottom:18}}>
        Sinyal renkleri (başarı / uyarı / hata / bilgi) doygun değildir; marka paleti içinden
        ısı/derinlik almış sönük versiyonlardır.
      </p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14}}>
        <SignalChip name="Başarı"  hex="#4A7A4F"/>
        <SignalChip name="Uyarı"   hex="#B88130"/>
        <SignalChip name="Hata"    hex="#A3433A"/>
        <SignalChip name="Bilgi"   hex="#2D6A6A"/>
      </div>
    </div>

    <div className="spec-line">03 · COLOR</div>
  </div>
);

const Swatch = ({ c, compact }) => (
  <div className="swatch">
    <div className="swatch-fill" style={{ background: c.bg, height: compact ? 140 : 200 }}>
      <span className="swatch-num" style={{ color: c.fg, opacity: 0.7 }}>{c.num}</span>
      <span className="swatch-name" style={{ color: c.fg }}>{c.name}</span>
    </div>
    <div className="swatch-meta">
      <div style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 8 }}>{c.role}</div>
      <div className="swatch-meta-row"><span>HEX</span><strong>{c.hex}</strong></div>
      <div className="swatch-meta-row"><span>RGB</span><strong>{c.rgb}</strong></div>
      {!compact && <>
        <div className="swatch-meta-row"><span>CMYK</span><strong>{c.cmyk}</strong></div>
        <div className="swatch-meta-row"><span>Pantone</span><strong>{c.pantone}</strong></div>
      </>}
    </div>
  </div>
);

const Ratio = ({ label, pct, color, ring }) => (
  <div style={{textAlign:'center'}}>
    <div style={{
      width: 16 + pct * 1.6, height: 64,
      background: color,
      borderRadius: 2,
      margin: '0 auto',
      border: ring ? '1px solid var(--line)' : '0',
    }}/>
    <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', marginTop:6, letterSpacing:'0.06em' }}>
      {label.toUpperCase()} · {pct}%
    </div>
  </div>
);

const SignalChip = ({ name, hex }) => (
  <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'var(--paper)', border:'1px solid var(--line)', borderRadius:4 }}>
    <span style={{ width:36, height:36, borderRadius:4, background:hex }}/>
    <div>
      <div style={{ fontSize:13, fontWeight:500 }}>{name}</div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:'0.06em' }}>{hex}</div>
    </div>
  </div>
);


/* ─── TYPE ARTBOARD ──────────────────────────────────────────── */

const TypeArtboard = () => (
  <div className="surface-paper" style={{padding:'72px 72px'}}>
    <div className="page-section-head">
      <div>
        <span className="eyebrow eyebrow-gold">Tipografi · 04</span>
        <h2 className="display" style={{fontSize:64, marginTop:14}}>
          Bir serif, bir sans, <em>ölçülü kontrast.</em>
        </h2>
        <p style={{fontSize:15, color:'var(--muted)', maxWidth:'56ch', marginTop:14, lineHeight:1.55}}>
          Başlıkları <strong style={{color:'var(--ink)'}}>Playfair Display</strong> taşır —
          editoryal, köklü, karakterli. Gövde metni
          <strong style={{color:'var(--ink)'}}> DM Sans</strong>'tır; nötr, sıcak, modern.
          Mono sadece teknik bağlamlarda.
        </p>
      </div>
    </div>

    {/* Specimen — giant letter */}
    <div style={{
      marginTop:24,
      padding:'48px 64px 32px',
      background:'var(--cream)',
      borderRadius:4,
      display:'grid',
      gridTemplateColumns:'1fr 1fr',
      gap:64,
      alignItems:'center',
    }}>
      <div className="specimen-letter">A<em>a</em></div>
      <div>
        <span className="eyebrow">Birincil — başlık</span>
        <div style={{fontFamily:'var(--font-display)', fontSize:48, fontWeight:500, marginTop:8, letterSpacing:'-0.01em', lineHeight:1.05}}>
          Playfair Display
        </div>
        <div style={{display:'flex', gap:14, marginTop:14, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase'}}>
          <span>Regular 400</span>
          <span>·</span>
          <span>Medium 500</span>
          <span>·</span>
          <span>Italic</span>
        </div>
        <div style={{marginTop:24, fontSize:14, color:'var(--ink)', lineHeight:1.65, maxWidth:'42ch'}}>
          Editoryal manşet, kapak yazısı ve pull-quote için. Sıkı tracking
          (<span className="mono">-0.01em</span> ile <span className="mono">-0.02em</span>);
          gevşek leading (1.05–1.15). Asla 18 px altında gövde metni olarak kullanılmaz.
        </div>
      </div>
    </div>

    {/* Body specimen */}
    <div style={{
      marginTop:20,
      padding:'40px 64px',
      background:'var(--paper)',
      border:'1px solid var(--line)',
      borderRadius:4,
      display:'grid',
      gridTemplateColumns:'1fr 1fr',
      gap:64,
    }}>
      <div>
        <span className="eyebrow">Gövde — uzun metin</span>
        <div style={{fontFamily:'var(--font-body)', fontSize:42, fontWeight:500, marginTop:8, letterSpacing:'-0.01em', lineHeight:1.05}}>
          DM Sans
        </div>
        <div style={{display:'flex', gap:14, marginTop:14, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--muted)', letterSpacing:'0.06em', textTransform:'uppercase'}}>
          <span>Regular 400</span>
          <span>·</span>
          <span>Medium 500</span>
          <span>·</span>
          <span>Bold 700</span>
        </div>
      </div>
      <div style={{fontSize:14, color:'var(--ink)', lineHeight:1.65}}>
        Gövde metni, navigasyon, formlar ve düğmeler. Rahat
        ölçü 62–72 karakter. Satır yüksekliği uzun metinde 1.55–1.65.
        Çizelgelerde tabular numeral, gövde içinde proportional rakam.
      </div>
    </div>

    {/* Scale */}
    <div style={{marginTop:48}}>
      <span className="eyebrow">Hiyerarşi · type-scale</span>
      <div style={{marginTop:18, display:'grid', gridTemplateColumns:'120px 1fr', gap:'20px 32px', alignItems:'baseline'}}>
        <Spec label="H1" px="64 px" font="Playfair Display 400" lh="1.05">
          Evin için doğru adım.
        </Spec>
        <Spec label="H2" px="44 px" font="Playfair Display 400" lh="1.08">
          Yedi adımda ev sahibi olmak.
        </Spec>
        <Spec label="H3" px="28 px" font="Playfair Display 500" lh="1.15">
          Atlas AI Mahalle Raporu
        </Spec>
        <Spec label="Lead" px="20 px" font="DM Sans 400" lh="1.55">
          7fil, ev sahibi olmanın yedi adımını tek çatı altında birleştirir.
        </Spec>
        <Spec label="Body" px="15 px" font="DM Sans 400" lh="1.65">
          Senior danışmanlarımız her dosyayı kişisel olarak inceler; Atlas AI piyasa
          analizini hazırlar, sertifikalı avukat tapuyu kontrol eder.
        </Spec>
        <Spec label="Caption" px="13 px" font="DM Sans 500" lh="1.5" muted>
          Moda, Kadıköy · İstanbul — Mayıs 2026
        </Spec>
        <Spec label="Eyebrow" px="11 px" font="DM Sans 600 · 0.16 em tracking · upper" lh="1.4" muted>
          CASE STUDY · 2026
        </Spec>
      </div>
    </div>

    <div className="spec-line">04 · TYPOGRAPHY</div>
  </div>
);

const Spec = ({ label, px, font, lh, muted, children }) => {
  // Apply CSS based on label
  let style = { fontFamily: 'var(--font-body)' };
  if (['H1', 'H2', 'H3'].includes(label)) style = {
    fontFamily: 'var(--font-display)',
    fontWeight: label === 'H3' ? 500 : 400,
    letterSpacing: '-0.015em',
  };
  if (label === 'Eyebrow') style = {
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    fontWeight: 600,
  };
  if (label === 'Lead') style = { fontFamily: 'var(--font-body)', fontWeight: 400 };
  if (label === 'Body') style = { fontFamily: 'var(--font-body)', fontWeight: 400 };
  if (label === 'Caption') style = { fontFamily: 'var(--font-body)', fontWeight: 500 };

  return (
    <>
      <div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.12em' }}>
          {label}
        </div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--ink)', marginTop:4 }}>{px}</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', marginTop:2 }}>{font}</div>
        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)' }}>line-height {lh}</div>
      </div>
      <div style={{
        ...style,
        fontSize: parseFloat(px),
        lineHeight: parseFloat(lh),
        color: muted ? 'var(--muted)' : 'var(--ink)',
        textWrap: 'pretty',
        paddingBottom: 16,
        borderBottom: '1px solid var(--line)',
      }}>
        {children}
      </div>
    </>
  );
};

window.ColorsArtboard = ColorsArtboard;
window.TypeArtboard = TypeArtboard;
