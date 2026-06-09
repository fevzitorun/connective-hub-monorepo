/* global React */

/* ─── LOGO SYSTEM ARTBOARD ────────────────────────────────── */

const LogoSystemArtboard = () => (
  <div className="surface-paper" style={{padding:'72px 72px'}}>
    <div className="page-section-head">
      <div>
        <span className="eyebrow eyebrow-gold">Logo Sistemi · 02</span>
        <h2 className="display" style={{fontSize:64, marginTop:14}}>
          Bir fil, bir <em>kelime,</em> tek bir kurgu.
        </h2>
        <p style={{fontSize:15, color:'var(--muted)', maxWidth:'56ch', marginTop:14, lineHeight:1.55}}>
          Marka iki temel parçadan oluşur: hortumu yukarıya dönük fil silüeti ve
          Playfair Display ile dizilmiş <em>“7fil”</em> kelime markası. Aşağıdaki
          beş lockup, tüm yüzeyleri kapsar.
        </p>
      </div>
    </div>

    {/* Primary lockup — large */}
    <div style={{
      marginTop:24,
      padding:'72px 56px',
      background:'var(--cream)',
      borderRadius:4,
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      position:'relative',
    }}>
      <div style={{position:'absolute', top:18, left:24}}>
        <span className="eyebrow">Birincil yatay lockup</span>
      </div>
      <div style={{position:'absolute', bottom:18, right:24, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:'0.08em'}}>
        7FIL · LOCKUP-H · INK ON CREAM
      </div>
      <window.Logo variant="lockup-h" tone="ink-on-cream" size={140}/>
    </div>

    {/* Variants strip */}
    <div style={{marginTop:32, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
      <Tile title="Dikey lockup" code="LOCKUP-V">
        <window.Logo variant="lockup-v" tone="ink-on-cream" size={72}/>
      </Tile>
      <Tile title="İkon · favicon" code="ICON" background="var(--ink)">
        <window.Mark size={96} tone="gold-on-ink"/>
      </Tile>
      <Tile title="Kelime markası" code="WORDMARK">
        <window.Wordmark size={56} tone="ink-on-cream"/>
      </Tile>
      <Tile title="Silüet" code="SILHOUETTE">
        <window.Logo variant="silhouette" tone="ink-on-cream" size={96}/>
      </Tile>
    </div>

    {/* Tone variants */}
    <div style={{marginTop:48}}>
      <span className="eyebrow">Renk varyasyonları</span>
      <div style={{marginTop:14, display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12}}>
        <ToneTile bg="var(--cream)"  label="Ink on cream"  tone="ink-on-cream"  primary/>
        <ToneTile bg="var(--ink)"    label="Gold on ink"   tone="gold-on-ink"   primary/>
        <ToneTile bg="var(--ink)"    label="Paper on ink"  tone="paper-on-ink"/>
        <ToneTile bg="var(--paper)"  label="Mono ink"      tone="mono-ink"/>
        <ToneTile bg="var(--ink)"    label="Mono paper"    tone="mono-paper"/>
      </div>
    </div>

    {/* Clear space + min size + rules */}
    <div style={{marginTop:48, display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:48}}>
      <div>
        <span className="eyebrow">Koruma alanı (Clear-space)</span>
        <h3 style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:500, marginTop:8, marginBottom:0, letterSpacing:'-0.01em'}}>
          Marka çevresinde, <em style={{color:'var(--gold-deep)'}}>x</em> kadar boş alan.
        </h3>
        <p style={{fontSize:13, color:'var(--muted)', marginTop:10, lineHeight:1.55, maxWidth:'52ch'}}>
          <strong>x</strong> = fil ikonunun genişliğinin yarısı. Hiçbir grafik, yazı
          veya kenarlık bu alan içinde kalmaz.
        </p>

        <div style={{
          marginTop:24, padding:'72px 56px', background:'var(--cream)',
          borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          {/* dotted clear-space frame */}
          <div style={{
            position:'absolute', top:24, left:24, right:24, bottom:24,
            border:'1px dashed rgba(20,20,42,0.25)',
            pointerEvents:'none',
          }}/>
          <window.Logo variant="lockup-h" tone="ink-on-cream" size={88}/>
          {/* x markers */}
          <div style={{position:'absolute', top:8, left:24, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)'}}>x</div>
          <div style={{position:'absolute', bottom:8, left:24, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)'}}>x</div>
          <div style={{position:'absolute', top:24, left:8, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)'}}>x</div>
          <div style={{position:'absolute', top:24, right:8, fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)'}}>x</div>
        </div>
      </div>

      <div>
        <span className="eyebrow">Minimum boyut</span>
        <h3 style={{fontFamily:'var(--font-display)', fontSize:26, fontWeight:500, marginTop:8, marginBottom:0, letterSpacing:'-0.01em'}}>
          Dijital <em style={{color:'var(--gold-deep)'}}>16 px</em> · baskı <em style={{color:'var(--gold-deep)'}}>10 mm</em>.
        </h3>
        <p style={{fontSize:13, color:'var(--muted)', marginTop:10, lineHeight:1.55, maxWidth:'40ch'}}>
          Bu boyutların altında yalnızca silüet kullanın; kelime markası çıkartılır.
        </p>

        <div style={{
          marginTop:24, padding:'40px 32px', background:'var(--cream)',
          borderRadius:4,
          display:'flex', gap:32, alignItems:'flex-end',
        }}>
          {[
            {size:96, label:'96 px'},
            {size:48, label:'48 px'},
            {size:24, label:'24 px'},
            {size:16, label:'16 px'},
          ].map(s => (
            <div key={s.size} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:8}}>
              <window.Mark size={s.size} tone="gold-on-ink"/>
              <span style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--muted)', letterSpacing:'0.06em'}}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Do / Don't */}
    <div style={{marginTop:48, paddingTop:32, borderTop:'1px solid var(--line)'}}>
      <span className="eyebrow">Kullanım kuralları</span>
      <div style={{marginTop:18, display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12}}>
        <RuleTile ok>
          <window.Logo variant="lockup-h" tone="ink-on-cream" size={40}/>
          <span>Krem üzerine lacivert</span>
        </RuleTile>
        <RuleTile ok bg="var(--ink)">
          <window.Logo variant="lockup-h" tone="gold-on-ink" size={40}/>
          <span>Lacivert üzerine altın</span>
        </RuleTile>
        <RuleTile ok bg="var(--gold)">
          <window.Logo variant="lockup-h" tone="ink-on-cream" size={40}/>
          <span>Altın üzerine lacivert (özel)</span>
        </RuleTile>
        <RuleTile bad bg="#ff8a4d">
          <window.Logo variant="lockup-h" tone="ink-on-cream" size={40}/>
          <span>Marka dışı bir aksanın üzerine</span>
        </RuleTile>
        <RuleTile bad>
          <div style={{transform:'skewX(-12deg) scale(1.04)', display:'inline-block'}}>
            <window.Logo variant="lockup-h" tone="ink-on-cream" size={40}/>
          </div>
          <span>Eğmek, döndürmek, oranı bozmak</span>
        </RuleTile>
        <RuleTile bad>
          <div style={{filter:'drop-shadow(0 4px 0 rgba(0,0,0,0.6)) drop-shadow(0 0 8px #fff)'}}>
            <window.Logo variant="lockup-h" tone="ink-on-cream" size={40}/>
          </div>
          <span>Gölge, parıltı, dış kontur eklemek</span>
        </RuleTile>
      </div>
    </div>

    <div className="spec-line">02 · LOGO SYSTEM</div>
  </div>
);

/* ── Helpers ──────────────────────────────────────────────── */

const Tile = ({ title, code, children, background = 'var(--cream)' }) => (
  <div style={{position:'relative'}}>
    <div style={{
      background, borderRadius:4,
      height:160, display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {children}
    </div>
    <div style={{marginTop:10, display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
      <span style={{fontSize:12, fontWeight:500, color:'var(--ink)'}}>{title}</span>
      <span style={{fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)', letterSpacing:'0.08em'}}>{code}</span>
    </div>
  </div>
);

const ToneTile = ({ bg, label, tone, primary }) => (
  <div style={{position:'relative'}}>
    <div style={{
      background: bg, borderRadius:4,
      height:110, display:'flex', alignItems:'center', justifyContent:'center',
      border: '1px solid var(--line)',
    }}>
      <window.Logo variant="lockup-h" tone={tone} size={36}/>
    </div>
    <div style={{marginTop:8, fontSize:11, color: primary ? 'var(--ink)' : 'var(--muted)'}}>
      {label}{primary && <span style={{color:'var(--gold-deep)', marginLeft:6, fontWeight:600}}>·  birincil</span>}
    </div>
  </div>
);

const RuleTile = ({ ok, bad, bg = 'var(--cream)', children }) => {
  const [body, label] = React.Children.toArray(children);
  return (
    <div>
      <div style={{
        background: bg, borderRadius:4,
        height:110, display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative',
        overflow:'hidden',
      }}>
        {body}
        <div style={{
          position:'absolute', top:8, right:8,
          width:14, height:14, borderRadius:'50%',
          background: ok ? 'var(--gold)' : '#b56b58',
          display:'flex', alignItems:'center', justifyContent:'center',
          color: ok ? 'var(--ink)' : '#fff',
          fontSize: 10, fontWeight: 700, lineHeight:1,
        }}>
          {ok ? '✓' : '×'}
        </div>
      </div>
      <div style={{marginTop:8, fontSize:11, color:'var(--muted)', lineHeight:1.4}}>
        {label}
      </div>
    </div>
  );
};

window.LogoSystemArtboard = LogoSystemArtboard;
