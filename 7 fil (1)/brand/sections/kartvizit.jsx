/* global React */

/* ─── KARTVİZİT (Business card, 85×55mm) ────────────────────────
   Rendered at 8 px/mm → 680×440 px artboard. Brief specifies:
   Front: --ink ground, gold left band with elephant icon, name in
   Playfair Display, contact details in DM Sans, gold thin rule.
   Back:  --cream ground, big "7fil" wordmark, italic tagline,
   QR code with gold border.
   ─────────────────────────────────────────────────────────── */

const KartvizitFront = ({ name = 'Fevzi Torun', title = 'Kurucu Ortak · Strateji Direktörü', phone = '+90 533 000 0000', email = 'fevzi@7fil.com.tr' }) => (
  <div style={{
    width: '100%', height: '100%',
    background: 'var(--ink)',
    color: 'var(--paper)',
    position: 'relative',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '88px 1fr',
  }}>
    {/* Gold left band */}
    <div style={{
      background: 'linear-gradient(180deg, var(--gold) 0%, var(--gold-deep) 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <window.Mark size={56} tone="paper-on-ink" ring={false}/>
      {/* tiny number bottom of band */}
      <div style={{
        position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 8, color: 'rgba(20,20,42,0.5)',
        letterSpacing: '0.18em',
      }}>
        EST · 1990
      </div>
    </div>

    {/* Right info pane */}
    <div style={{ padding: '36px 40px 28px', display:'flex', flexDirection:'column' }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500,
        letterSpacing: '-0.015em', color: 'var(--paper)', lineHeight: 1.05,
      }}>
        {name}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,253,248,0.62)',
        marginTop: 6, letterSpacing: '0.01em',
      }}>
        {title}
      </div>

      <div style={{
        height: 1, background: 'linear-gradient(90deg, var(--gold) 0%, var(--gold) 30%, transparent 100%)',
        margin: '20px 0 18px',
      }}/>

      <div style={{ display:'flex', flexDirection:'column', gap: 6, fontSize: 11, color:'var(--paper)', fontFamily: 'var(--font-body)', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
        <Contact label="T" value={phone}/>
        <Contact label="E" value={email}/>
        <Contact label="W" value="7fil.com.tr"/>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'end',
      }}>
        <div style={{ fontSize: 9, color:'rgba(255,253,248,0.4)', letterSpacing: '0.12em', textTransform:'uppercase' }}>
          Connective Hub Dijital Teknolojiler Ltd. Şti.
        </div>
        <window.Wordmark size={20} tone="gold-on-ink"/>
      </div>
    </div>
  </div>
);

const Contact = ({ label, value }) => (
  <div style={{ display:'flex', alignItems:'baseline', gap: 12 }}>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)',
      letterSpacing: '0.12em', width: 14, flexShrink: 0,
    }}>{label}</span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{value}</span>
  </div>
);

const KartvizitBack = () => (
  <div style={{
    width:'100%', height:'100%',
    background:'var(--cream)',
    position:'relative',
    overflow: 'hidden',
    display:'flex', alignItems:'center', justifyContent:'center',
    padding: '32px',
  }}>
    {/* faint elephant watermark */}
    <div style={{ position:'absolute', right:-90, top:-30, transform:'rotate(8deg)' }}>
      <window.WatermarkElephant size={360} color="rgba(20,20,42,0.06)"/>
    </div>

    <div style={{
      width: '100%', height: '100%',
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 28,
      alignItems: 'center',
      position:'relative', zIndex:1,
    }}>
      <div>
        <window.Logo variant="lockup-h" tone="ink-on-cream" size={70}/>
        <div className="display" style={{
          marginTop: 24, fontStyle:'italic', fontSize: 24, color:'var(--teal-deep)',
          lineHeight:1.2,
        }}>
          Evin için doğru adım.
        </div>
        <div style={{
          marginTop: 16, fontSize: 10, color:'var(--muted)',
          letterSpacing:'0.12em', textTransform:'uppercase',
        }}>
          Türkiye'nin entegre gayrimenkul ekosistemi
        </div>
      </div>

      {/* QR code stand-in with gold frame */}
      <div style={{
        width: 120, height: 120, marginLeft:'auto',
        padding: 6,
        background: 'var(--paper)',
        border: '1px solid var(--gold)',
        position:'relative',
      }}>
        <FakeQR size={108}/>
        <div style={{
          position:'absolute', bottom: -22, left: 0, right: 0,
          textAlign:'center', fontSize: 9, color:'var(--muted)',
          letterSpacing:'0.12em', textTransform:'uppercase',
        }}>
          7fil.com.tr
        </div>
      </div>
    </div>

    <div style={{
      position:'absolute', bottom: 10, left: 0, right: 0,
      textAlign:'center', fontSize: 8, color:'rgba(20,20,42,0.32)',
      letterSpacing:'0.14em', textTransform:'uppercase',
    }}>
      Powered by FILTERRA.AI
    </div>
  </div>
);

/* A QR-code-style abstract block — for prototype only.
   12×12 grid with corner markers. */
const FakeQR = ({ size = 100 }) => {
  // Deterministic pattern so it doesn't reshuffle on re-render.
  const cells = React.useMemo(() => {
    const arr = [];
    let s = 17;
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 12; x++) {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        arr.push((s % 100) < 48 ? 1 : 0);
      }
    }
    // Corner finder markers
    const marker = (cx, cy) => {
      for (let dy = -1; dy <= 3; dy++) for (let dx = -1; dx <= 3; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x < 0 || y < 0 || x >= 12 || y >= 12) continue;
        const onEdge = Math.abs(dx) === 1 || Math.abs(dy) === 1;
        const isCenter = Math.abs(dx) <= 0 && Math.abs(dy) <= 0;
        arr[y * 12 + x] = (dx === -1 || dx === 3 || dy === -1 || dy === 3) ? 0
                       : (isCenter || !onEdge) ? 1 : 0;
      }
    };
    marker(1.5, 1.5); marker(9.5, 1.5); marker(1.5, 9.5);
    return arr;
  }, []);
  const cell = size / 12;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="var(--paper)"/>
      {cells.map((c, i) => c ? (
        <rect key={i}
          x={(i % 12) * cell}
          y={Math.floor(i / 12) * cell}
          width={cell} height={cell}
          fill="var(--ink)"
        />
      ) : null)}
    </svg>
  );
};

window.KartvizitFront = KartvizitFront;
window.KartvizitBack = KartvizitBack;
