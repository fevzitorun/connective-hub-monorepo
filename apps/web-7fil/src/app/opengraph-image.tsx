import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '7fil — Evin için doğru adım'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
          fontFamily: 'serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '80px', fontWeight: 700, color: '#FAFAF7', letterSpacing: '-2px' }}>
            7
          </span>
          <span style={{ fontSize: '80px', fontWeight: 700, color: '#D4AF37', letterSpacing: '-2px' }}>
            fil
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#FAFAF7',
            opacity: 0.85,
            fontWeight: 400,
            letterSpacing: '1px',
            marginBottom: '48px',
          }}
        >
          Evin için doğru adım
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: '16px' }}>
          {['AI Değerleme', 'Hukuki Doğrulama', 'Mortgage', 'Müzayede'].map((f) => (
            <div
              key={f}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#D4AF37',
                fontSize: '16px',
                fontFamily: 'sans-serif',
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '48px',
            fontSize: '16px',
            color: 'rgba(250,250,247,0.4)',
            fontFamily: 'sans-serif',
          }}
        >
          7fil.com.tr
        </div>
      </div>
    ),
    { ...size },
  )
}
