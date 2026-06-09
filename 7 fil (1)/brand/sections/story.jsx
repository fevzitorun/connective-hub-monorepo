/* global React */

/* ─── 1. COVER ARTBOARD ─────────────────────────────────────── */

const CoverArtboard = () => (
  <div className="surface-ink" style={{padding:'80px 72px', overflow:'hidden'}}>
    {/* Background elephant */}
    <div style={{
      position:'absolute', right:-120, bottom:-80,
      transform:'rotate(-4deg)',
    }}>
      <window.WatermarkElephant size={780} color="rgba(201,168,76,0.18)"/>
    </div>

    {/* Top rule */}
    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
      <span className="eyebrow eyebrow-paper" style={{color:'rgba(255,253,248,0.55)'}}>
        Connective Hub Dijital Teknolojiler Ltd. Şti.
      </span>
      <span className="eyebrow eyebrow-paper" style={{color:'rgba(255,253,248,0.55)'}}>
        Marka Kimliği · v 1.0 · Mayıs 2026
      </span>
    </div>

    {/* Title block */}
    <div style={{marginTop: 140, position:'relative'}}>
      <div style={{display:'flex', alignItems:'center', gap:32}}>
        <window.Mark size={120} tone="gold-on-ink"/>
        <div>
          <div style={{fontFamily:'var(--font-display)', fontSize:148, fontWeight:500, lineHeight:0.9, letterSpacing:'-0.03em', color:'var(--paper)'}}>
            7<span style={{fontStyle:'italic', color:'var(--gold)', fontWeight:400}}>fil</span>
          </div>
        </div>
      </div>

      <div className="display" style={{
        marginTop: 80,
        fontSize: 64,
        lineHeight: 1.1,
        color: 'var(--paper)',
        maxWidth: '22ch',
      }}>
        Evin için <em>doğru adım.</em>
      </div>
      <p style={{
        marginTop: 28,
        fontSize: 18,
        lineHeight: 1.55,
        color: 'rgba(255,253,248,0.66)',
        maxWidth: '52ch',
      }}>
        Yedi fil; bereketin, korumanın ve yeni bir kapının açılışının yüzyıllık simgesidir.
        Bu kimlik rehberi, bu inancı dijital çağa taşıyan markanın sesini, görünümünü ve
        karakterini tanımlar.
      </p>
    </div>

    {/* Footer */}
    <div style={{
      position:'absolute', bottom: 52, left: 72, right: 72,
      display:'flex', justifyContent:'space-between', alignItems:'end',
    }}>
      <div style={{display:'flex', gap:48, alignItems:'baseline'}}>
        <Idx num="01" label="Marka Hikayesi"/>
        <Idx num="02" label="Logo Sistemi"/>
        <Idx num="03" label="Renk"/>
        <Idx num="04" label="Tipografi"/>
        <Idx num="05" label="Kurumsal Kimlik"/>
      </div>
      <span className="eyebrow eyebrow-paper" style={{color:'rgba(255,253,248,0.45)'}}>
        Powered by FILTERRA.AI
      </span>
    </div>
  </div>
);

const Idx = ({ num, label }) => (
  <div>
    <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:14, color:'var(--gold)'}}>
      {num}
    </div>
    <div style={{fontSize:12, color:'var(--paper)', marginTop:2, letterSpacing:'0.02em'}}>
      {label}
    </div>
  </div>
);


/* ─── 2. STORY / MANIFESTO ARTBOARD ─────────────────────────── */

const StoryArtboard = () => (
  <div className="surface-cream" style={{padding:'80px 80px', display:'grid', gridTemplateColumns: '1.1fr 0.9fr', gap:80}}>
    {/* Left column */}
    <div>
      <span className="eyebrow eyebrow-gold">Marka Hikayesi · 01</span>
      <h2 className="display" style={{fontSize:72, marginTop:16}}>
        Yedi fil, <em>yedi adım.</em>
      </h2>

      <div style={{marginTop:48, columnCount:1, fontSize:17, lineHeight:1.65, color:'var(--ink)', maxWidth:'48ch'}}>
        <p style={{marginTop:0}}>
          <span style={{fontFamily:'var(--font-display)', fontSize:44, lineHeight:1, float:'left', marginRight:8, marginTop:6, color:'var(--gold-deep)'}}>Y</span>
          edi fil figürü; Türkiye, Hindistan, Güneydoğu Asya ve Orta
          Doğu'da yüzyıllardır kapı üstüne asılan, vitrinde sergilenen
          bereket ve koruma sembolüdür. Seramik, ahşap, mermer, cam,
          gümüş — her maddede karşımıza çıkar.
        </p>
        <p>
          Hortumu yukarıya dönük fil bereket getirir. Bu inanç, ev
          edinmenin sessiz ritüellerinden biri olarak nesilden nesile
          taşınmıştır.
        </p>
        <p>
          7fil bu köklü inancı dijital çağa taşır.
          Ev sahibi olmanın yedi adımı; arama, değerleme, hukuki
          doğrulama, finansman, sigorta, imza ve taşınma — tek bir
          ekosistemde, kıdemli danışmanlar ve yapay zekanın
          rehberliğiyle yürür.
        </p>
      </div>

      <div style={{marginTop:48, display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14}}>
        {[
          {n:'01', t:'Güven'},
          {n:'02', t:'Bereket'},
          {n:'03', t:'Prestij'},
          {n:'04', t:'Modernlik'},
        ].map(v => (
          <div key={v.n}>
            <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:14, color:'var(--gold-deep)'}}>{v.n}</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, marginTop:6, letterSpacing:'-0.01em'}}>{v.t}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Right column — the 7 steps */}
    <div style={{borderLeft:'1px solid var(--line)', paddingLeft:64}}>
      <span className="eyebrow">7 Adım</span>
      <h3 className="display" style={{fontSize:32, marginTop:10, marginBottom:32}}>
        Ev sahibi olmanın <em>ritüeli.</em>
      </h3>

      {[
        {n:'01', t:'Ara',         d:'Niyet ve keşif. Doğal dilde arama, lokasyon önerisi.'},
        {n:'02', t:'Değerle',     d:'Atlas AI piyasa değerlemesi ve mahalle raporu.'},
        {n:'03', t:'Doğrula',     d:'Tapu, ipotek ve imar — avukat ağı tarafından risk skoru.'},
        {n:'04', t:'Finanse et',  d:'Mortgage ve katılım karşılaştırması; faizli ve faizsiz.'},
        {n:'05', t:'Sigorta et',  d:'DASK, konut, taşınma sigortası — tek başvuru.'},
        {n:'06', t:'İmzala',      d:'e-İmza, avukat onayı, dijital tapu protokolü.'},
        {n:'07', t:'Taşın',       d:'Tadilat, nakliye partnerleri ve mülk sağlık skoru.'},
      ].map((s, i) => (
        <div key={s.n} style={{
          display:'grid', gridTemplateColumns:'56px 1fr', gap:20,
          padding:'18px 0',
          borderBottom: i < 6 ? '1px solid var(--line)' : '0',
        }}>
          <div style={{fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:28, color:'var(--gold-deep)', lineHeight:1}}>
            {s.n}
          </div>
          <div>
            <div style={{fontFamily:'var(--font-display)', fontSize:22, fontWeight:500, letterSpacing:'-0.01em', lineHeight:1}}>
              {s.t}
            </div>
            <div style={{fontSize:13, color:'var(--muted)', marginTop:6, lineHeight:1.5}}>
              {s.d}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


/* ─── 3. VOICE & TONE ARTBOARD ───────────────────────────────── */

const VoiceArtboard = () => (
  <div className="surface-paper" style={{padding:'80px 80px'}}>
    <div className="page-section-head">
      <div>
        <span className="eyebrow eyebrow-gold">Ses ve Üslup</span>
        <h2 className="display" style={{fontSize:64, marginTop:14}}>
          Sakin, bilge, <em>sıcak ama profesyonel.</em>
        </h2>
        <p style={{fontSize:16, color:'var(--muted)', maxWidth:'56ch', marginTop:16, lineHeight:1.55}}>
          7fil bir satıcı gibi konuşmaz. Deneyimli, dürüst, sözünü ölçen bir büyükbaba
          avukat gibi konuşur. Her cümle yer hak ediyor olmalı; pazarlama abartısı bu
          markanın düşmanıdır.
        </p>
      </div>
      <div style={{textAlign:'right'}}>
        <window.Mark size={72} tone="ink-on-cream"/>
      </div>
    </div>

    {/* The pull quote */}
    <div style={{
      margin:'40px 0 56px',
      padding:'48px 64px',
      background:'var(--cream)',
      borderLeft:'4px solid var(--gold)',
      borderRadius:'0 6px 6px 0',
    }}>
      <div className="pull-quote" style={{maxWidth:'34ch'}}>
        Bu bölgede son altı ayda yüzde on iki fiyat artışı var. Aceleci olmaya gerek yok —
        benzer ilanlar ortalama kırk yedi günde satılıyor.
      </div>
      <div style={{marginTop:24, fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--muted)'}}>
        Atlas AI · sahada bir örnek
      </div>
    </div>

    {/* Do / Don't grid */}
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48}}>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
          <span style={{width:10, height:10, borderRadius:'50%', background:'var(--gold)'}}/>
          <span className="eyebrow eyebrow-gold">Böyle yazarız</span>
        </div>
        {[
          '35 yıllık stratejik iletişim deneyimi.',
          'İkinci görüş, 48 saatte teslim.',
          'Hortumu yukarıya dönük fil bereket getirir.',
          'Tapu kontrolü tamamlandı; risk skoru 14/100.',
        ].map((t,i) => (
          <div key={i} className="display" style={{fontSize:22, lineHeight:1.35, marginTop:12, fontStyle:'italic', fontWeight:400}}>
            “{t}”
          </div>
        ))}
      </div>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
          <span style={{width:10, height:10, borderRadius:'50%', background:'#b56b58'}}/>
          <span className="eyebrow" style={{color:'#a3433a'}}>Böyle yazmayız</span>
        </div>
        {[
          'Marka potansiyelinizi keşfedin! 🚀',
          'Türkiye’nin ONE numara emlak platformu!',
          'Hemen tıkla, fırsatı kaçırma!',
          'Devrim niteliğinde, AI destekli, end-to-end çözüm.',
        ].map((t,i) => (
          <div key={i} style={{fontSize:18, lineHeight:1.4, marginTop:12, color:'#7a6863', textDecoration:'line-through', textDecorationColor:'#b56b58', textDecorationThickness:'1px'}}>
            {t}
          </div>
        ))}
      </div>
    </div>

    {/* Punctuation & numbers row */}
    <div style={{marginTop:64, paddingTop:32, borderTop:'1px solid var(--line)', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32}}>
      <Rule label="Cümle başlığı" text="Sentence case kullanılır. ALL CAPS yalnızca eyebrow etiketlerde."/>
      <Rule label="Tarih" text="27 Nisan 2026 · uzun · veya 27.04.26 · kompakt"/>
      <Rule label="Para" text="₺1.250  ·  ₺48.500.000 — binlik nokta, ondalık virgül"/>
      <Rule label="Tırnak" text="“Kıvırcık tırnak” her zaman. ‘Tek tırnak’ alıntı içinde."/>
    </div>
  </div>
);

const Rule = ({ label, text }) => (
  <div>
    <div className="eyebrow" style={{color:'var(--muted)'}}>{label}</div>
    <div style={{fontFamily:'var(--font-display)', fontSize:18, marginTop:10, lineHeight:1.4, letterSpacing:'-0.005em'}}>
      {text}
    </div>
  </div>
);

Object.assign(window, { CoverArtboard, StoryArtboard, VoiceArtboard });
