import React from 'react';

interface IconProps {
  size?: number;
  stroke?: number;
  [key: string]: unknown;
}

const Icon = ({ children, size = 20, stroke = 1.6, ...rest }: IconProps & { children?: React.ReactNode }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="square"
    strokeLinejoin="miter"
    {...rest}
  >
    {children}
  </svg>
);

export const IconMapPin = (p: IconProps) => <Icon {...p}><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.4"/></Icon>;
export const IconBed    = (p: IconProps) => <Icon {...p}><path d="M3 18V8M3 12h18M21 18V12a2 2 0 0 0-2-2H9"/><path d="M3 18h18"/><circle cx="6.4" cy="13" r="1.6"/></Icon>;
export const IconArea   = (p: IconProps) => <Icon {...p}><path d="M4 4h16v16H4z"/><path d="M9 4v16M4 9h16"/></Icon>;
export const IconBuilding = (p: IconProps) => <Icon {...p}><path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16"/><path d="M16 9h3a1 1 0 0 1 1 1v11"/><path d="M7 8h2M7 12h2M7 16h2M12 8h2M12 12h2M12 16h2"/></Icon>;
export const IconHeart  = (p: IconProps) => <Icon {...p}><path d="M20.4 6.6a5 5 0 0 0-8.4-2.4 5 5 0 0 0-8.4 2.4c-1 4 3.4 7.6 8.4 11.4 5-3.8 9.4-7.4 8.4-11.4z" fill="currentColor" stroke="none"/></Icon>;
export const IconHeartLine = (p: IconProps) => <Icon {...p}><path d="M20.4 6.6a5 5 0 0 0-8.4-2.4 5 5 0 0 0-8.4 2.4c-1 4 3.4 7.6 8.4 11.4 5-3.8 9.4-7.4 8.4-11.4z"/></Icon>;
export const IconSearch = (p: IconProps) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
export const IconArrowRight = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
export const IconArrowLeft  = (p: IconProps) => <Icon {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></Icon>;
export const IconSparkle = (p: IconProps) => <Icon {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/></Icon>;
export const IconShield = (p: IconProps) => <Icon {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/><path d="M9.5 12l2 2 3.5-4"/></Icon>;
export const IconClock  = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></Icon>;
export const IconStar   = (p: IconProps) => <Icon {...p}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.4l-5.5 2.9 1.1-6.3L3 9.6l6.3-.9L12 3z" fill="currentColor" stroke="none"/></Icon>;
export const IconWhatsapp = (p: IconProps) => <Icon {...p}><path d="M20 12a8 8 0 0 1-12.4 6.7L4 20l1.3-3.6A8 8 0 1 1 20 12z"/><path d="M9 9c0 4 2 6 6 6l1.6-1-1.6-2-2 1c-1 0-2-1-2-2l1-2-2-1.6L9 9z" fill="currentColor" stroke="none"/></Icon>;
export const IconChevDown = (p: IconProps) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
export const IconChevRight = (p: IconProps) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
export const IconChevLeft  = (p: IconProps) => <Icon {...p}><path d="M15 6l-6 6 6 6"/></Icon>;
export const IconClose = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>;
export const IconCheck = (p: IconProps) => <Icon {...p}><path d="M4 12l5 5L20 6"/></Icon>;
export const IconKebab = (p: IconProps) => <Icon {...p}><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></Icon>;
export const IconEye   = (p: IconProps) => <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></Icon>;
export const IconChat  = (p: IconProps) => <Icon {...p}><path d="M21 12c0 4.4-4 8-9 8-1.4 0-2.8-.3-4-.8L3 21l1.4-4A8 8 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8z"/></Icon>;
export const IconBookmark = (p: IconProps) => <Icon {...p}><path d="M6 4h12v17l-6-4-6 4V4z"/></Icon>;
export const IconEdit  = (p: IconProps) => <Icon {...p}><path d="M4 20h4l11-11-4-4L4 16v4z"/><path d="M14 5l4 4"/></Icon>;
export const IconPause = (p: IconProps) => <Icon {...p}><path d="M9 5v14M15 5v14"/></Icon>;
export const IconTrash = (p: IconProps) => <Icon {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></Icon>;
export const IconChart = (p: IconProps) => <Icon {...p}><path d="M4 20h16M7 16V10M12 16V6M17 16v-4"/></Icon>;
export const IconDocument = (p: IconProps) => <Icon {...p}><path d="M7 3h7l5 5v13H7V3z"/><path d="M14 3v5h5"/></Icon>;
export const IconMap   = (p: IconProps) => <Icon {...p}><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></Icon>;
export const IconGrid  = (p: IconProps) => <Icon {...p}><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></Icon>;
export const IconSend  = (p: IconProps) => <Icon {...p}><path d="M21 3L3 11l8 2 2 8 8-18z" fill="currentColor" stroke="none"/></Icon>;
export const IconUp    = (p: IconProps) => <Icon {...p}><path d="M7 14l5-5 5 5"/></Icon>;
export const IconDown  = (p: IconProps) => <Icon {...p}><path d="M7 10l5 5 5-5"/></Icon>;
export const IconPlay  = (p: IconProps) => <Icon {...p}><path d="M7 4v16l13-8L7 4z" fill="currentColor" stroke="none"/></Icon>;
export const IconKey   = (p: IconProps) => <Icon {...p}><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/></Icon>;
export const IconCoin  = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9 9h5a2 2 0 0 1 0 4h-5"/><path d="M9 15h6"/><path d="M12 6v12"/></Icon>;
export const IconScale = (p: IconProps) => <Icon {...p}><path d="M12 4v16M5 6h14"/><path d="M5 6l-3 7h6l-3-7zM19 6l-3 7h6l-3-7z"/><path d="M2 13h6M16 13h6"/></Icon>;
export const IconRobot = (p: IconProps) => <Icon {...p}><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 4v4M8 14h.01M16 14h.01"/><path d="M9 18h6"/></Icon>;
export const IconLayer = (p: IconProps) => <Icon {...p}><path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5M3 18l9 5 9-5"/></Icon>;
export const IconCompass = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M9 15l1.5-4.5L15 9l-1.5 4.5L9 15z" fill="currentColor" stroke="none"/></Icon>;
export const IconHome    = (p: IconProps) => <Icon {...p}><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-9z"/></Icon>;
export const IconFilter  = (p: IconProps) => <Icon {...p}><path d="M3 5h18M6 12h12M10 19h4"/></Icon>;

interface BrandMarkProps {
  size?: number;
  body?: string;
  accent?: string;
  ring?: boolean;
}

export const BrandMark = ({ size = 32, body, accent, ring = true }: BrandMarkProps) => (
  <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="7fil">
    {ring && <circle cx="32" cy="32" r="30" fill={body || 'var(--ink)'}/>}
    <g fill={accent || 'var(--gold)'}>
      <path d="M 16 44 C 16 33, 23 26, 33 26 C 41 26, 47 31, 47 39 L 47 46 L 16 46 Z" />
      <rect x="18" y="44" width="6" height="8" rx="0.5"/>
      <rect x="38" y="44" width="6" height="8" rx="0.5"/>
      <path d="M 27 28 C 23 28, 21 32, 23 36 C 25 38, 28 37, 29 35 Z" />
      <path d="M 21 32 C 16 32, 13 28, 13 23 C 13 18, 16 14, 21 14 C 23 14, 25 15, 26 17 L 22 18 C 20 18, 19 20, 19 22 C 19 25, 21 27, 24 27 L 24 31 Z" strokeLinejoin="round"/>
    </g>
    <circle cx="29" cy="32" r="1" fill={body || 'var(--ink)'}/>
  </svg>
);

interface BrandSilhouetteProps {
  size?: number;
  color?: string;
}

export const BrandSilhouette = ({ size = 600, color = 'currentColor' }: BrandSilhouetteProps) => (
  <svg width={size} viewBox="0 0 600 360" fill="none" stroke={color} strokeWidth="2.4" aria-hidden="true">
    <path d="M 120 280 C 120 200, 180 160, 260 160 C 340 160, 400 200, 400 280 L 400 310 L 120 310 Z" strokeLinejoin="round"/>
    <path d="M 150 280 V 340 M 180 280 V 340" strokeLinecap="round"/>
    <path d="M 340 280 V 340 M 370 280 V 340" strokeLinecap="round"/>
    <path d="M 240 200 C 210 200, 200 230, 220 250 C 232 258, 252 252, 256 240 Z" strokeLinejoin="round"/>
    <path d="M 220 220 C 170 220, 140 180, 140 140 C 140 100, 170 70, 210 70 C 240 70, 260 88, 264 110 L 240 116 C 230 118, 220 128, 220 142 C 220 160, 232 172, 250 174 L 250 220 Z" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="280" cy="220" r="3" fill={color} stroke="none"/>
    <path d="M 120 280 C 105 282, 100 295, 110 305" strokeLinecap="round"/>
  </svg>
);

export const SevenGlyph = ({ size = 80, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth="3" aria-hidden="true">
    <path d="M22 28h52L46 88" strokeLinecap="square"/>
  </svg>
);

export const ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  IconSearch, IconCompass, IconShield, IconCoin, IconKey, IconDocument, IconHome,
  IconMapPin, IconBed, IconArea, IconBuilding, IconHeart, IconHeartLine,
  IconArrowRight, IconArrowLeft, IconSparkle, IconClock, IconStar, IconWhatsapp,
  IconChevDown, IconChevRight, IconChevLeft, IconClose, IconCheck, IconKebab,
  IconEye, IconChat, IconBookmark, IconEdit, IconPause, IconTrash, IconChart,
  IconMap, IconGrid, IconSend, IconUp, IconDown, IconPlay, IconScale, IconRobot,
  IconLayer, IconFilter,
};
