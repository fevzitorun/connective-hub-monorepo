/* global React */

/* ─── T-SHIRT ────────────────────────────────────────────────
   Two colour options: ink/gold and cream/ink. Front (chest left
   logo) + Back (large elephant + tagline + URL).
   ────────────────────────────────────────────────────────── */

const TshirtSilhouette = ({ stroke = '#000' }) => (
  /* a soft, rounded crewneck silhouette. neckline shaped. */
  <path
    d="M 30 18
       L 60 12
       Q 100 4, 140 12
       L 170 18
       L 196 38
       L 184 70
       L 168 62
       L 168 200
       Q 100 208, 32 200
       L 32 62
       L 16 70
       L 4 38
       Z"
    fill="currentColor" stroke={stroke} strokeWidth="0.5"
  />
);

const Tshirt = ({ side = 'front', tone = 'ink' }) => {
  const tones = {
    ink:   { body: '#14142a', accent: '#c9a84c', label: 'Lacivert üzerine altın' },
    cream: { body: '#f8f4ee', accent: '#14142a', label: 'Krem üzerine lacivert' },
  };
  const t = tones[tone];

  return (
    <div style={{
      width:'100%', height:'100%',
      background:'var(--cream-2)',
      position:'relative',
      overflow:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {/* side label */}
      <div style={{
        position:'absolute', top:14, left:18,
        fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
        color:'var(--muted)', fontWeight:600,
      }}>
        {side === 'front' ? 'Ön' : 'Arka'}
      </div>
      <div style={{
        position:'absolute', top:14, right:18,
        fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)',
        letterSpacing:'0.08em', textTransform:'uppercase',
      }}>
        {t.label}
      </div>

      {/* Garment */}
      <svg viewBox="0 0 200 220" width="80%" height="80%" style={{ color: t.body, filter: 'drop-shadow(0 18px 30px rgba(20,20,42,0.18))' }}>
        <TshirtSilhouette stroke={tone === 'cream' ? 'rgba(20,20,42,0.12)' : 'transparent'}/>
        {side === 'front' ? (
          /* Chest left — small mark embroidered look */
          <g transform="translate(50, 64)">
            <circle cx="0" cy="0" r="9" fill={t.accent}/>
            {/* embroidered elephant — single colour */}
            <g transform="translate(-6,-6) scale(0.19)" fill={t.body}>
              <path d="
                M 14 44 C 14 32, 22 25, 33 25 C 42 25, 48 30, 48 39
                L 48 46 L 14 46 Z"/>
              <rect x="17" y="44" width="6" height="9"/>
              <rect x="38" y="44" width="6" height="9"/>
              <path d="
                M 27 27 C 22 27, 20 32, 22 36 C 25 38, 28 37, 29 35 Z"/>
              <path d="
                M 21 31 C 15 31, 12 26, 12 21 C 12 16, 15 12, 20 12
                C 23 12, 25 13, 27 16 L 22 17 C 20 17, 18 19, 18 22
                C 18 25, 20 27, 24 27 L 24 30 Z"/>
            </g>
          </g>
        ) : (
          /* Back — large elephant + tagline + URL */
          <g transform="translate(100, 120)">
            {/* tonal elephant — same colour family, slightly different value */}
            <g transform="translate(-48, -48) scale(1.5)" opacity="0.95">
              {/* drawn at 64 viewBox; needs scale 1.5 to reach 96 */}
              <g fill={t.accent}>
                <path d="
                  M 14 44 C 14 32, 22 25, 33 25 C 42 25, 48 30, 48 39
                  L 48 46 L 14 46 Z"/>
                <rect x="17" y="44" width="6" height="9"/>
                <rect x="38" y="44" width="6" height="9"/>
                <path d="
                  M 27 27 C 22 27, 20 32, 22 36 C 25 38, 28 37, 29 35 Z"/>
                <path d="
                  M 21 31 C 15 31, 12 26, 12 21 C 12 16, 15 12, 20 12
                  C 23 12, 25 13, 27 16 L 22 17 C 20 17, 18 19, 18 22
                  C 18 25, 20 27, 24 27 L 24 30 Z"/>
                <circle cx="29" cy="31" r="1.1" fill={t.body}/>
              </g>
            </g>
            {/* tagline */}
            <text
              x="0" y="42"
              fontFamily="Playfair Display, serif"
              fontStyle="italic"
              fontWeight="400"
              fontSize="9"
              fill={t.accent}
              textAnchor="middle"
              letterSpacing="-0.3"
            >Evin için doğru adım.</text>
            <text
              x="0" y="60"
              fontFamily="DM Sans, sans-serif"
              fontSize="5"
              fill={t.accent}
              opacity="0.7"
              textAnchor="middle"
              letterSpacing="1.4"
            >7FIL.COM.TR</text>
          </g>
        )}
      </svg>
    </div>
  );
};


/* ─── TOTE BAG ────────────────────────────────────────────────
   Natural canvas tote with hand-drawn elephant illustration.
   ────────────────────────────────────────────────────────── */

const Tote = () => (
  <div style={{
    width:'100%', height:'100%',
    background:'var(--cream-2)',
    position:'relative',
    overflow:'hidden',
    display:'flex', alignItems:'center', justifyContent:'center',
  }}>
    <div style={{
      position:'absolute', top:14, left:18,
      fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase',
      color:'var(--muted)', fontWeight:600,
    }}>
      Tote · 38 × 42 cm
    </div>
    <div style={{
      position:'absolute', top:14, right:18,
      fontFamily:'var(--font-mono)', fontSize:9, color:'var(--muted)',
      letterSpacing:'0.08em', textTransform:'uppercase',
    }}>
      Naturel bez · Lacivert + altın baskı
    </div>

    {/* Bag SVG */}
    <svg viewBox="0 0 320 380" width="80%" height="80%"
         style={{ filter: 'drop-shadow(0 16px 28px rgba(20,20,42,0.15))' }}>
      {/* Straps */}
      <path d="M 90 60 Q 100 6, 160 6 Q 220 6, 230 60"
            stroke="#14142a" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Body of bag */}
      <rect x="30" y="56" width="260" height="306" rx="3"
            fill="#f0e4d2" stroke="#cbb98a" strokeWidth="1"/>
      {/* tonal weave hint */}
      <g opacity="0.04">
        {Array.from({length:50}).map((_,i) => (
          <line key={i} x1="30" y1={62 + i*6} x2="290" y2={62 + i*6} stroke="#14142a" strokeWidth="0.5"/>
        ))}
      </g>

      {/* Elephant — hand-drawn style, large central */}
      <g transform="translate(2, 60) scale(0.62)">
        <g stroke="#14142a" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Body */}
          <path d="M 110 320 C 110 230, 180 180, 270 180 C 360 180, 420 220, 420 310 L 420 348 L 110 348 Z"/>
          <path d="M 130 320 C 200 330, 380 330, 420 320" opacity="0.6"/>
          {/* Front legs */}
          <path d="M 145 320 V 388 M 178 320 V 388"/>
          {/* Back legs */}
          <path d="M 354 320 V 388 M 387 320 V 388"/>
          {/* Toes */}
          <path d="M 142 388 h6 M 172 388 h6 M 350 388 h6 M 384 388 h6"/>
          {/* Tail */}
          <path d="M 110 310 C 92 314, 84 332, 96 348"/>
          {/* Ear */}
          <path d="M 248 222 C 214 220, 196 256, 218 282 C 234 296, 254 290, 260 274 Z"/>
          <path d="M 240 244 C 232 254, 234 264, 244 270" opacity="0.5"/>
          {/* Trunk arcing up */}
          <path d="M 232 246 C 184 240, 152 198, 152 152 C 152 108, 184 76, 226 76 C 256 76, 282 96, 288 124"/>
          <path d="M 288 124 L 268 132 C 254 138, 248 154, 252 168 C 256 180, 268 188, 282 188"/>
          {/* Wrinkles */}
          <path d="M 230 140 q -8 -2 -6 -10 M 210 110 q -6 -2 -4 -10" opacity="0.5"/>
        </g>
        {/* Eye + tusk */}
        <circle cx="284" cy="244" r="3" fill="#14142a"/>
        <path d="M 264 268 L 274 280" stroke="#c9a84c" strokeWidth="4" strokeLinecap="round"/>
      </g>

      {/* Wordmark below */}
      <g transform="translate(160, 348)" textAnchor="middle">
        <text
          fontFamily="Playfair Display, serif"
          fontWeight="500"
          fontSize="36"
          fill="#14142a"
          letterSpacing="-1"
        >
          <tspan>7</tspan>
          <tspan fontStyle="italic" fill="#a8893a">fil</tspan>
        </text>
        <text
          y="14"
          fontFamily="DM Sans, sans-serif"
          fontSize="6.5"
          fill="#7a7569"
          letterSpacing="2"
        >7FIL.COM.TR</text>
      </g>
    </svg>
  </div>
);

Object.assign(window, { Tshirt, Tote });
