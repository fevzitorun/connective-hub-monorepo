/* global React */

/* ─── ANTETLİ KAĞIT (A4, 210×297mm) ─────────────────────────────
   Rendered at ~2.4 px/mm → 504×713 px (or scaled to artboard size).
   Sol kenar altın dikey şerit, üst header + alt footer.
   ─────────────────────────────────────────────────────────── */

const Antetli = () => (
  <div style={{
    width:'100%', height:'100%',
    background:'var(--paper)',
    position:'relative',
    overflow:'hidden',
  }}>
    {/* gold left stripe */}
    <div style={{
      position:'absolute', left:0, top:0, bottom:0, width: 7,
      background:'var(--gold)',
    }}/>

    {/* Header */}
    <div style={{
      padding: '32px 36px 22px 44px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      borderBottom: '1px solid var(--line)',
    }}>
      <div>
        <window.Logo variant="lockup-h" tone="ink-on-cream" size={32}/>
        <div style={{
          fontSize: 8, color:'var(--muted)', marginTop: 6,
          letterSpacing:'0.08em',
        }}>
          Connective Hub Dijital Teknolojiler Ltd. Şti.
        </div>
      </div>
      <div style={{ fontSize: 9, color: 'var(--muted)', textAlign:'right', lineHeight:1.55, fontFamily:'var(--font-mono)', letterSpacing:'0.04em' }}>
        <div>İstanbul Dijital Teknokent · No 14</div>
        <div>Beyoğlu / İstanbul</div>
        <div>+90 533 000 0000 · merhaba@7fil.com.tr</div>
      </div>
    </div>

    {/* Body — letterhead body (sample letter) */}
    <div style={{ padding: '40px 44px 20px 44px', fontSize: 11, color:'var(--ink)', lineHeight: 1.6, position:'relative' }}>
      <div style={{
        fontFamily:'var(--font-mono)', fontSize: 9, color:'var(--muted)',
        letterSpacing:'0.06em',
      }}>
        24 Mayıs 2026 · İstanbul
      </div>
      <div style={{ marginTop: 16, fontSize: 12 }}>
        Sayın <strong style={{ fontWeight: 500 }}>Ahmet Yılmaz</strong>,
      </div>
      <p style={{ marginTop: 14, maxWidth: '64ch' }}>
        Moda, Kadıköy adresindeki 3+1 daire için hazırladığımız değerleme dosyası
        ekteki rapor ile birlikte tarafınıza iletilmiştir. Atlas AI tarafından
        yürütülen piyasa analizi ve sertifikalı avukatımızın tapu incelemesi
        tamamlanmıştır; risk skoru 14/100 olarak hesaplanmıştır.
      </p>
      <p style={{ marginTop: 10, maxWidth: '64ch' }}>
        Bir sonraki adım olarak iki bankayla mortgage karşılaştırmasını
        başlatmamızı önerir, müsait olduğunuz bir günde sizinle yüz yüze
        görüşmek isteriz.
      </p>
      <p style={{ marginTop: 10 }}>
        Saygılarımızla,
      </p>
      <p style={{ marginTop: 4, fontFamily:'var(--font-display)', fontStyle:'italic', fontSize: 15 }}>
        Zeynep Aydın
      </p>
      <p style={{ fontSize: 10, color:'var(--muted)' }}>Senior Danışman, Connective</p>

      {/* faint elephant watermark, lower-right */}
      <div style={{ position:'absolute', right:-40, bottom:-40, transform:'rotate(-4deg)' }}>
        <window.WatermarkElephant size={220} color="rgba(20,20,42,0.04)"/>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      position:'absolute', left:14, right:0, bottom:0,
      borderTop: '1px solid var(--line)',
      padding: '14px 36px',
      display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
      alignItems:'center', gap: 20,
      fontSize: 8, color:'var(--muted)',
      letterSpacing:'0.06em',
      background:'var(--paper)',
    }}>
      <div style={{display:'flex', flexDirection:'column', gap:2}}>
        <span style={{color:'var(--ink)', fontWeight:500, fontSize:9}}>7fil.com.tr</span>
        <span>@7fil.comtr</span>
      </div>
      <div style={{ textAlign:'center', opacity: 0.6, display:'flex', justifyContent:'center' }}>
        <window.WatermarkElephant size={64} color="rgba(20,20,42,0.2)" stroke={1.6}/>
      </div>
      <div style={{ textAlign:'right', textTransform:'uppercase', fontSize:8 }}>
        Powered by FILTERRA.AI
      </div>
    </div>
  </div>
);

/* ─── DL ZARF (220×110mm) ────────────────────────────────────── */

const Envelope = () => (
  <div style={{
    width:'100%', height:'100%',
    background:'var(--cream)',
    position:'relative',
    overflow:'hidden',
  }}>
    {/* faint elephant pattern (single, subtle) */}
    <div style={{ position:'absolute', right:-60, top:-30, transform:'rotate(-8deg)' }}>
      <window.WatermarkElephant size={380} color="rgba(20,20,42,0.04)"/>
    </div>

    {/* sender block */}
    <div style={{ padding:'28px 36px' }}>
      <window.Logo variant="lockup-h" tone="ink-on-cream" size={28}/>
      <div style={{
        marginTop:10, fontSize:9, color:'var(--ink)',
        lineHeight: 1.55, letterSpacing:'0.02em', maxWidth:'34ch',
      }}>
        <div style={{ fontWeight:500 }}>Connective Hub Dijital Teknolojiler Ltd. Şti.</div>
        <div style={{ color:'var(--muted)' }}>İstanbul Dijital Teknokent · No 14</div>
        <div style={{ color:'var(--muted)' }}>34430 Beyoğlu / İstanbul</div>
      </div>
    </div>

    {/* Recipient placeholder area */}
    <div style={{
      position:'absolute', bottom: 60, right: 32, width: 280,
    }}>
      <div style={{ fontSize: 8, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.14em' }}>
        Alıcı
      </div>
      <div style={{ height: 1, background:'var(--line)', marginTop: 4 }}/>
      <div style={{ height: 18 }}/>
      <div style={{ height: 1, background:'var(--line)' }}/>
      <div style={{ height: 18 }}/>
      <div style={{ height: 1, background:'var(--line)' }}/>
    </div>

    {/* gold bottom stripe */}
    <div className="gold-stripe-bottom" style={{ height: 5 }}/>
  </div>
);

/* ─── DOSYA / KLASÖR A4 KAPAK ─────────────────────────────────── */

const Folder = () => (
  <div style={{
    width:'100%', height:'100%',
    background:'var(--ink)',
    color:'var(--paper)',
    position:'relative',
    overflow:'hidden',
  }}>
    {/* large elephant watermark, bottom-right */}
    <div style={{ position:'absolute', right:-100, bottom: 40, transform:'rotate(-6deg)' }}>
      <window.WatermarkElephant size={520} color="rgba(255,253,248,0.10)"/>
    </div>

    {/* Logo top-left */}
    <div style={{ padding: '40px 44px 0' }}>
      <window.Logo variant="lockup-h" tone="gold-on-ink" size={40}/>
    </div>

    {/* Headline block */}
    <div style={{ padding: '52px 44px 0' }}>
      <div className="eyebrow eyebrow-paper" style={{color:'rgba(255,253,248,0.55)'}}>
        Gayrimenkul Danışmanlık Dosyası
      </div>
      <div className="display" style={{ marginTop: 16, fontSize: 50, color:'var(--paper)', lineHeight: 1.05 }}>
        Moda, Kadıköy<br/>
        <em style={{color:'var(--gold)'}}>3+1 daire dosyası.</em>
      </div>
      <div style={{ marginTop: 24, fontSize: 11, color:'rgba(255,253,248,0.6)', maxWidth:'48ch', lineHeight: 1.55 }}>
        Bu dosya, ilana özel hazırlanmış Atlas AI mahalle raporunu, sertifikalı avukatımız
        tarafından imzalanmış tapu inceleme notunu ve mortgage karşılaştırma tablosunu
        içerir.
      </div>
    </div>

    {/* spec field bottom-right */}
    <div style={{
      position:'absolute', right: 44, bottom: 56,
      width: 220,
      border: '1px solid rgba(201,168,76,0.5)',
      padding: '14px 16px',
      background: 'transparent',
    }}>
      <Field label="Müvekkil" value="A. Yılmaz"/>
      <Field label="Danışman" value="Z. Aydın"/>
      <Field label="Dosya no" value="7F-L1-2026"/>
      <Field label="Tarih"    value="24 · 05 · 2026"/>
    </div>

    {/* gold bottom stripe */}
    <div className="gold-stripe-bottom" style={{ height: 8 }}/>
    <div style={{
      position:'absolute', bottom: 24, left: 44,
      fontSize: 9, color:'rgba(255,253,248,0.4)',
      letterSpacing:'0.14em', textTransform:'uppercase',
    }}>
      Connective Hub · 7fil.com.tr
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', fontSize: 10, fontFamily:'var(--font-mono)' }}>
    <span style={{ color:'rgba(255,253,248,0.55)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</span>
    <span style={{ color:'var(--paper)' }}>{value}</span>
  </div>
);

Object.assign(window, { Antetli, Envelope, Folder });
