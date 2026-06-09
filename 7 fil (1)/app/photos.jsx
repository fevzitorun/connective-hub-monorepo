/* global React */
/* ────────────────────────────────────────────────────────────────
   7fil — Editorial placeholder photography.
   Hand-drawn architectural SVGs in a calm tonal palette, captioned
   with the property's district. These stand in for real listing
   photography without resorting to gradient-and-emoji slop.
   ──────────────────────────────────────────────────────────────── */

/* Tonal palette pairs — each is [sky, building face, building shadow, ground, accent] */
const PHOTO_PALETTES = {
  warm:  ['#e8d9b6', '#c2a878', '#8a6e44', '#a08054', '#6e4f2a'],
  cool:  ['#cbd6d6', '#92aaa9', '#5d7c7b', '#7a9695', '#3e5757'],
  dusk:  ['#d8c2a8', '#7c5b48', '#4e3a2e', '#3a2c24', '#c9a84c'],
  morn:  ['#e9e0cf', '#b4a08a', '#7a6a58', '#8d7e6c', '#5e4f3c'],
  sea:   ['#d4dfd9', '#b7c2bc', '#6a7d76', '#4f5e58', '#c9a84c'],
  ink:   ['#3a3954', '#272641', '#15142a', '#5c5b76', '#c9a84c'],
};

/* ── Scene primitives ───────────────────────────────────────── */

const SceneApartment = ({ p }) => (
  <g>
    {/* sky */}
    <rect width="400" height="300" fill={p[0]}/>
    {/* mid-buildings */}
    <rect x="20"  y="120" width="80"  height="180" fill={p[1]}/>
    <rect x="290" y="100" width="90"  height="200" fill={p[1]}/>
    {/* hero building */}
    <rect x="110" y="60" width="180" height="240" fill={p[2]}/>
    {/* roof line */}
    <rect x="110" y="56" width="180" height="6" fill={p[4]}/>
    {/* windows grid */}
    {Array.from({length: 5}).map((_, r) =>
      Array.from({length: 5}).map((_, c) => (
        <rect key={r+'-'+c} x={120 + c*32} y={78 + r*42} width="20" height="26" fill={p[0]} opacity={r%2 ? 0.85 : 0.95}/>
      ))
    )}
    {/* mid-building windows */}
    {Array.from({length: 6}).map((_, r) => (
      <rect key={'sl-'+r} x="32" y={130 + r*26} width="18" height="14" fill={p[0]} opacity="0.7"/>
    ))}
    {Array.from({length: 6}).map((_, r) => (
      <rect key={'sr-'+r} x="302" y={110 + r*28} width="20" height="14" fill={p[0]} opacity="0.7"/>
    ))}
    {Array.from({length: 6}).map((_, r) => (
      <rect key={'sr2-'+r} x="346" y={110 + r*28} width="20" height="14" fill={p[0]} opacity="0.7"/>
    ))}
    {/* ground */}
    <rect y="280" width="400" height="20" fill={p[3]}/>
  </g>
);

const SceneVilla = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* hills */}
    <path d="M0 220 Q 100 180 200 210 T 400 200 V300 H0z" fill={p[3]} opacity="0.55"/>
    <path d="M0 240 Q 80 215 200 235 T 400 230 V300 H0z" fill={p[3]}/>
    {/* villa */}
    <rect x="120" y="160" width="200" height="100" fill={p[1]}/>
    {/* slim wing */}
    <rect x="80" y="200" width="60" height="60" fill={p[2]}/>
    {/* roof */}
    <polygon points="120,160 220,128 320,160" fill={p[2]}/>
    {/* windows */}
    <rect x="140" y="180" width="36" height="46" fill={p[0]}/>
    <rect x="186" y="180" width="36" height="46" fill={p[0]}/>
    <rect x="232" y="180" width="36" height="46" fill={p[0]} opacity="0.8"/>
    {/* door */}
    <rect x="278" y="200" width="28" height="60" fill={p[3]}/>
    {/* tree */}
    <circle cx="350" cy="220" r="30" fill={p[2]} opacity="0.55"/>
    <rect x="346" y="220" width="6" height="40" fill={p[2]}/>
    {/* pool hint */}
    <ellipse cx="200" cy="278" rx="80" ry="6" fill={p[4]} opacity="0.35"/>
  </g>
);

const SceneTower = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* low backdrop */}
    <rect y="200" width="400" height="100" fill={p[3]} opacity="0.4"/>
    {/* secondary towers */}
    <rect x="40" y="120" width="60" height="180" fill={p[1]} opacity="0.85"/>
    <rect x="320" y="80" width="50" height="220" fill={p[1]} opacity="0.85"/>
    {/* hero tower */}
    <rect x="150" y="20" width="100" height="280" fill={p[2]}/>
    {/* vertical stripes — curtain wall */}
    {Array.from({length: 5}).map((_, i) => (
      <rect key={'v-'+i} x={156 + i*20} y="28" width="6" height="264" fill={p[0]} opacity="0.5"/>
    ))}
    {/* horizontal floor lines */}
    {Array.from({length: 18}).map((_, i) => (
      <rect key={'h-'+i} x="150" y={28 + i*15} width="100" height="1.5" fill={p[4]} opacity="0.4"/>
    ))}
    {/* crown */}
    <rect x="160" y="12" width="80" height="10" fill={p[4]} opacity="0.7"/>
  </g>
);

const SceneTerrace = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* row of 5 terraces */}
    {Array.from({length: 5}).map((_, i) => (
      <g key={i}>
        <rect x={20 + i*72} y={140 - (i%2)*8} width="68" height={160 + (i%2)*8} fill={i%2 ? p[1] : p[2]}/>
        <polygon
          points={`${20 + i*72},${140 - (i%2)*8} ${54 + i*72},${122 - (i%2)*8} ${88 + i*72},${140 - (i%2)*8}`}
          fill={i%2 ? p[2] : p[4]} opacity="0.85"
        />
        {/* door */}
        <rect x={42 + i*72} y={250} width="14" height="50" fill={p[3]}/>
        {/* windows */}
        <rect x={28 + i*72} y={160} width="22" height="20" fill={p[0]} opacity="0.85"/>
        <rect x={58 + i*72} y={160} width="22" height="20" fill={p[0]} opacity="0.85"/>
        <rect x={28 + i*72} y={200} width="22" height="20" fill={p[0]} opacity="0.85"/>
        <rect x={58 + i*72} y={200} width="22" height="20" fill={p[0]} opacity="0.85"/>
      </g>
    ))}
    {/* street */}
    <rect y="295" width="400" height="5" fill={p[3]}/>
  </g>
);

const SceneOffice = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* glass office building, full bleed */}
    <rect x="40" y="40" width="320" height="260" fill={p[2]}/>
    {/* curtain wall grid */}
    {Array.from({length: 8}).map((_, c) =>
      Array.from({length: 10}).map((_, r) => (
        <rect key={c+'-'+r} x={50 + c*40} y={50 + r*25} width="32" height="18" fill={p[0]} opacity={(r+c)%3 ? 0.35 : 0.85}/>
      ))
    )}
    {/* entrance */}
    <rect x="170" y="240" width="60" height="60" fill={p[4]} opacity="0.65"/>
  </g>
);

const SceneCoast = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* sea */}
    <rect y="180" width="400" height="120" fill={p[3]} opacity="0.55"/>
    <rect y="210" width="400" height="90" fill={p[2]} opacity="0.6"/>
    {/* coastal villa */}
    <rect x="100" y="120" width="200" height="80" fill={p[1]}/>
    <rect x="80" y="160" width="40" height="40" fill={p[2]}/>
    <rect x="280" y="150" width="40" height="50" fill={p[2]}/>
    {/* flat roof */}
    <rect x="98" y="116" width="204" height="6" fill={p[4]}/>
    {/* windows */}
    {Array.from({length:6}).map((_, i) => (
      <rect key={i} x={114 + i*28} y="138" width="20" height="38" fill={p[0]} opacity="0.7"/>
    ))}
    {/* palm hint */}
    <rect x="354" y="180" width="3" height="50" fill={p[4]}/>
    <path d="M355 180 Q 370 170 380 180 Q 365 178 355 180z" fill={p[4]}/>
    <path d="M355 180 Q 340 170 330 180 Q 345 178 355 180z" fill={p[4]}/>
  </g>
);

const SceneRetail = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* mixed-use building */}
    <rect x="30" y="40" width="340" height="260" fill={p[1]}/>
    {/* ground-floor shopfront */}
    <rect x="30" y="220" width="340" height="80" fill={p[2]}/>
    <rect x="50" y="240" width="60" height="60" fill={p[0]} opacity="0.85"/>
    <rect x="130" y="240" width="60" height="60" fill={p[0]} opacity="0.85"/>
    <rect x="210" y="240" width="60" height="60" fill={p[0]} opacity="0.85"/>
    <rect x="290" y="240" width="60" height="60" fill={p[4]} opacity="0.8"/>
    {/* awning */}
    <rect x="30" y="216" width="340" height="6" fill={p[4]}/>
    {/* upper windows grid */}
    {Array.from({length:8}).map((_, c) =>
      Array.from({length:4}).map((_, r) => (
        <rect key={c+'-'+r} x={42 + c*42} y={56 + r*38} width="28" height="24" fill={p[0]} opacity="0.8"/>
      ))
    )}
  </g>
);

const SceneHistoric = ({ p }) => (
  <g>
    <rect width="400" height="300" fill={p[0]}/>
    {/* Historic stucco façade */}
    <rect x="40" y="60" width="320" height="240" fill={p[1]}/>
    {/* cornice */}
    <rect x="34" y="54" width="332" height="10" fill={p[2]}/>
    <rect x="34" y="156" width="332" height="6" fill={p[2]}/>
    {/* arched windows top floor */}
    {Array.from({length: 5}).map((_, i) => (
      <g key={i}>
        <rect x={68 + i*58} y="82" width="40" height="60" fill={p[3]}/>
        <ellipse cx={88 + i*58} cy="82" rx="20" ry="14" fill={p[3]}/>
      </g>
    ))}
    {/* bottom rect windows */}
    {Array.from({length: 5}).map((_, i) => (
      <rect key={i} x={68 + i*58} y="180" width="40" height="80" fill={p[3]}/>
    ))}
    {/* door */}
    <rect x="184" y="220" width="32" height="80" fill={p[4]}/>
    <ellipse cx="200" cy="220" rx="16" ry="14" fill={p[4]}/>
    {/* steps */}
    <rect x="170" y="296" width="60" height="4" fill={p[2]}/>
  </g>
);

const SCENES = {
  apartment: SceneApartment,
  villa:     SceneVilla,
  tower:     SceneTower,
  terrace:   SceneTerrace,
  office:    SceneOffice,
  coast:     SceneCoast,
  retail:    SceneRetail,
  historic:  SceneHistoric,
};

/* ── Photo component ─────────────────────────────────────────── */

const Photo = ({ scene = 'apartment', palette = 'warm', caption, children }) => {
  const Scene = SCENES[scene] || SCENES.apartment;
  const p = PHOTO_PALETTES[palette] || PHOTO_PALETTES.warm;
  return (
    <div className="photo">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <Scene p={p}/>
      </svg>
      {caption && <span className="photo-caption">{caption}</span>}
      {children}
    </div>
  );
};

Object.assign(window, { Photo, PHOTO_PALETTES });
