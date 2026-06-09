/* global React */
/* ────────────────────────────────────────────────────────────
   7fil — Logo system

   Five official variants:
     1. <Logo variant="lockup-h">  — primary horizontal lockup
     2. <Logo variant="lockup-v">  — vertical / stacked
     3. <Logo variant="icon">      — mark in circle (favicon, social)
     4. <Logo variant="wordmark">  — type-only "7fil"
     5. <Logo variant="silhouette">— mark, no enclosing circle
   Tones:
     ink-on-cream | gold-on-ink | paper-on-ink | mono-ink | mono-paper
   ──────────────────────────────────────────────────────────── */

const TONES = {
  'ink-on-cream':  { bg: null,           body: '#14142a', accent: '#c9a84c', word: '#14142a', wordAccent: '#a8893a', ring: '#14142a' },
  'gold-on-ink':   { bg: '#14142a',      body: '#14142a', accent: '#c9a84c', word: '#fffdf8', wordAccent: '#c9a84c', ring: '#c9a84c' },
  'paper-on-ink':  { bg: '#14142a',      body: '#14142a', accent: '#fffdf8', word: '#fffdf8', wordAccent: '#fffdf8', ring: '#fffdf8' },
  'mono-ink':      { bg: null,           body: '#14142a', accent: '#14142a', word: '#14142a', wordAccent: '#14142a', ring: '#14142a' },
  'mono-paper':    { bg: null,           body: '#fffdf8', accent: '#fffdf8', word: '#fffdf8', wordAccent: '#fffdf8', ring: '#fffdf8' },
};

/* The elephant glyph, no enclosing circle. trunk-up.
   Single, refined geometry — proportional at any size. */
const ElephantGlyph = ({ accent = 'currentColor', body, eye }) => (
  <g fill={accent}>
    {/* Body */}
    <path d="
      M 14 44
      C 14 32, 22 25, 33 25
      C 42 25, 48 30, 48 39
      L 48 46
      L 14 46
      Z" />
    {/* Front leg */}
    <rect x="17" y="44" width="6" height="9" rx="0.5"/>
    {/* Back leg */}
    <rect x="38" y="44" width="6" height="9" rx="0.5"/>
    {/* Ear */}
    <path d="
      M 27 27
      C 22 27, 20 32, 22 36
      C 25 38, 28 37, 29 35
      Z" />
    {/* Trunk — large J curling up and forward */}
    <path d="
      M 21 31
      C 15 31, 12 26, 12 21
      C 12 16, 15 12, 20 12
      C 23 12, 25 13, 27 16
      L 22 17
      C 20 17, 18 19, 18 22
      C 18 25, 20 27, 24 27
      L 24 30
      Z" strokeLinejoin="round"/>
    {/* Eye dot — drawn in body colour through the silhouette */}
    <circle cx="29" cy="31" r="1.1" fill={eye || body || '#14142a'} />
  </g>
);

const Mark = ({ size = 96, tone = 'gold-on-ink', ring = true }) => {
  const t = TONES[tone];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      {ring && <circle cx="32" cy="32" r="30" fill={t.bg || t.body}/>}
      <ElephantGlyph
        accent={ring ? t.accent : t.body}
        body={t.bg || (ring ? t.body : null)}
        eye={t.bg || t.body}
      />
    </svg>
  );
};

/* Wordmark — "7fil" with italic "fil".
   Set in Playfair Display via the parent stylesheet. */
const Wordmark = ({ size = 64, tone = 'ink-on-cream', italicAccent = true }) => {
  const t = TONES[tone];
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: '-0.02em',
        fontWeight: 500,
        color: t.word,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontWeight: 500 }}>7</span>
      <span style={{
        fontStyle: italicAccent ? 'italic' : 'normal',
        fontWeight: 400,
        color: t.wordAccent,
        marginLeft: '-0.04em',
      }}>fil</span>
    </span>
  );
};

const Logo = ({ variant = 'lockup-h', tone = 'ink-on-cream', size = 72, ring = true }) => {
  if (variant === 'icon') {
    return <Mark size={size} tone={tone}/>;
  }
  if (variant === 'silhouette') {
    return <Mark size={size} tone={tone} ring={false}/>;
  }
  if (variant === 'wordmark') {
    return <Wordmark size={size} tone={tone}/>;
  }
  if (variant === 'lockup-v') {
    return (
      <div style={{display:'inline-flex', flexDirection:'column', alignItems:'center', gap: size * 0.18}}>
        <Mark size={size} tone={tone} ring={ring}/>
        <Wordmark size={size * 0.55} tone={tone}/>
      </div>
    );
  }
  // lockup-h (default)
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap: size * 0.22}}>
      <Mark size={size} tone={tone} ring={ring}/>
      <Wordmark size={size * 0.62} tone={tone}/>
    </div>
  );
};

/* Larger watermark-style silhouette for stationery decorations. */
const WatermarkElephant = ({ size = 600, color = 'currentColor', stroke = 2.4 }) => (
  <svg width={size} viewBox="0 0 600 360" fill="none" stroke={color} strokeWidth={stroke} aria-hidden="true">
    <path d="
      M 120 280
      C 120 200, 180 160, 260 160
      C 340 160, 400 200, 400 280
      L 400 310
      L 120 310 Z" strokeLinejoin="round"/>
    <path d="M 150 280 V 340 M 180 280 V 340" strokeLinecap="round"/>
    <path d="M 340 280 V 340 M 370 280 V 340" strokeLinecap="round"/>
    <path d="
      M 240 200
      C 210 200, 200 230, 220 250
      C 232 258, 252 252, 256 240 Z" strokeLinejoin="round"/>
    <path d="
      M 220 220
      C 170 220, 140 180, 140 140
      C 140 100, 170 70, 210 70
      C 240 70, 260 88, 264 110
      L 240 116
      C 230 118, 220 128, 220 142
      C 220 160, 232 172, 250 174
      L 250 220 Z" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="280" cy="220" r="3" fill={color} stroke="none"/>
    <path d="M 120 280 C 105 282, 100 295, 110 305" strokeLinecap="round"/>
  </svg>
);

/* Hand-drawn (rougher) version for the tote bag illustration — uses
   the same geometry but with sketched strokes and a fill-less look. */
const HandDrawnElephant = ({ size = 400, color = '#14142a' }) => (
  <svg width={size} viewBox="0 0 600 420" fill="none" stroke={color} strokeWidth="4"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* Body */}
    <path d="M 110 320 C 110 230, 180 180, 270 180 C 360 180, 420 220, 420 310 L 420 348 L 110 348 Z"/>
    {/* Belly fold (hint of dimensionality) */}
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
    {/* Trunk tip */}
    <path d="M 288 124 L 268 132 C 254 138, 248 154, 252 168 C 256 180, 268 188, 282 188"/>
    {/* Trunk wrinkles */}
    <path d="M 230 140 q -8 -2 -6 -10 M 210 110 q -6 -2 -4 -10 M 200 92 q -8 0 -6 -8" opacity="0.5"/>
    {/* Eye */}
    <circle cx="284" cy="244" r="3" fill={color} stroke="none"/>
    <path d="M 280 240 C 278 234, 290 234, 292 240" opacity="0.6"/>
    {/* Tusk (small) */}
    <path d="M 264 268 L 274 280"/>
  </svg>
);

Object.assign(window, {
  Mark,
  Wordmark,
  Logo,
  WatermarkElephant,
  HandDrawnElephant,
  ElephantGlyph,
});
